import axios, { 
  AxiosRequestConfig, 
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosHeaders
} from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config/api.config';
import { calculateBackoff, shouldRetryRequest, wait } from '../utils/retry';
import { 
  ApiError, 
  AuthenticationError, 
  NetworkError, 
  TimeoutError,
  ValidationError 
} from '../types/errors';
import { authService } from '../services/auth.service';


// Extended config interface to include retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: number;
}

// Create an Axios instance with enhanced security config
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: true,
  xsrfCookieName: AUTH_CONFIG.xsrfCookieName,
  xsrfHeaderName: AUTH_CONFIG.xsrfHeaderName,
  maxRedirects: 5,
  maxContentLength: API_CONFIG.maxContentLength,
  validateStatus: (status) => status >= 200 && status < 300,
  headers: API_CONFIG.headers
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization token
    const token = authService.getStoredToken();
    if (token) {
      config.headers = config.headers ?? new AxiosHeaders();
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // Validate request URL
    if (config.url) {
      const url = new URL(config.url, API_CONFIG.baseURL);
      if (!url.href.startsWith(API_CONFIG.baseURL || '')) {
        throw new ValidationError('Invalid request URL');
      }
    }

    return config;
  },
  (error) => Promise.reject(new ApiError('Request configuration error', undefined, error.code))
);

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response) => {
    // Validate response content type
    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('application/json')) {
      throw new ValidationError('Invalid response content type');
    }
    return response;
  },
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(new ApiError('Invalid request configuration'));
    }

    // Handle retry logic
    if (shouldRetryRequest(error, {
      retry: (error.config as ExtendedAxiosRequestConfig).retry,
      maxRetries: API_CONFIG.maxRetries,
      retryStatusCodes: API_CONFIG.retryStatusCodes
    })) {
      const retryCount = ((error.config as ExtendedAxiosRequestConfig).retry ?? 0) + 1;
      const backoffDelay = calculateBackoff(retryCount);
      
      (error.config as ExtendedAxiosRequestConfig).retry = retryCount;
      await wait(backoffDelay);
      
      return apiClient.request(error.config);
    }

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      
      // Handle 401 Unauthorized
      if (status === 401) {
        await authService.clearAuth();
        throw new AuthenticationError();
      }
      
      // Handle timeout
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        throw new TimeoutError();
      }

      throw new ApiError(
        (error.response.data as { message?: string })?.message || 'Request failed',
        status,
        error.code
      );
    } 
    
    if (error.request) {
      throw new NetworkError('No response received');
    }
    
    throw new ApiError('Request failed', undefined, error.code);
  }
);

// Generic API request function with enhanced error handling
export const apiRequest = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  try {
    // Sanitize request data
    if (config.data && typeof config.data === 'object') {
      config.data = JSON.parse(JSON.stringify(config.data));
    }

    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (axios.isAxiosError(error)) {
      const urlObj = config.url ? new URL(config.url, API_CONFIG.baseURL) : null;
      const sanitizedPath = urlObj ? urlObj.pathname : 'unknown';
      
      console.error('API Request Error:', {
        path: sanitizedPath,
        method: config.method,
        timestamp: new Date().toISOString(),
        errorType: error.name,
        status: error.response?.status,
        errorCode: error.code || 'UNKNOWN_ERROR'
      });
    }
    
    throw new ApiError('An unexpected error occurred');
  }
};

export default apiClient;
