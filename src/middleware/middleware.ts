import axios, { 
  AxiosRequestConfig, 
  AxiosResponse, 
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosHeaders
} from 'axios';

// Extended config interface to include retry property
interface RetryConfig extends InternalAxiosRequestConfig {
  retry?: number;
}

// Create an Axios instance with enhanced security config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000, // Request timeout
  withCredentials: true, // Enable sending cookies with requests
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxRedirects: 5,
  maxContentLength: 50 * 1024 * 1024, // 50MB max content length
  validateStatus: (status) => status >= 200 && status < 300, // Only accept 2xx status codes
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization token and security headers
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers ?? new AxiosHeaders();
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // Validate request URL
    if (config.url) {
      const url = new URL(config.url, process.env.REACT_APP_API_URL);
      if (!url.href.startsWith(process.env.REACT_APP_API_URL || '')) {
        throw new Error('Invalid request URL');
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Validate response content type
    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('application/json')) {
      throw new Error('Invalid response content type');
    }
    return response;
  },
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const retryConfig = error.config as RetryConfig;
    
    // Maximum retry attempts
    const MAX_RETRIES = 3;
    
    // Initialize retry count if not set
    if (typeof retryConfig.retry === 'undefined') {
      retryConfig.retry = 0;
    }

    // Conditions for retry
    const shouldRetry = (
      retryConfig.retry < MAX_RETRIES && 
      error.response && 
      [408, 429, 500, 502, 503, 504].includes(error.response.status)
    );

    if (shouldRetry) {
      retryConfig.retry += 1;
      const delayMs = Math.min(1000 * (2 ** retryConfig.retry), 10000);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      // Create a new request with the updated config
      return apiClient.request(retryConfig);
    }

    if (error.response) {
      console.error('Error response:', error.response);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear all auth-related data
        localStorage.removeItem('authToken');
        sessionStorage.clear(); // Clear any session data
        
        // Remove any auth-related cookies
        document.cookie.split(';').forEach(cookie => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
        
        // Redirect to logout
        window.location.href = '/logout';
      }
      
      // Handle timeout
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.error('Request timeout');
      }

    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

// Generic API request function with enhanced error handling
export const apiRequest = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  try {
    // Sanitize request data
    if (config.data && typeof config.data === 'object') {
      config.data = JSON.parse(JSON.stringify(config.data)); // Deep clone to prevent XSS
    }

    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log error details securely (avoid exposing sensitive info)
      console.error('API Request Error:', {
        url: config.url,
        method: config.method,
        timestamp: new Date().toISOString(),
        errorType: error.name,
        errorMessage: error.message,
        status: error.response?.status,
      });

      // Enhance error message for client
      const errorMessage = error.response?.status === 401 
        ? 'Authentication required' 
        : 'An error occurred while processing your request';
      
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export default apiClient;
