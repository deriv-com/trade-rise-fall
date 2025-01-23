import { API_CONFIG, AUTH_CONFIG } from '../api.config';

describe('API_CONFIG', () => {
  it('should have correct base configuration', () => {
    expect(API_CONFIG).toEqual({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 10000,
      maxRetries: 3,
      maxContentLength: 52428800, // 50MB in bytes
      retryStatusCodes: [408, 429, 500, 502, 503, 504],
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  });

  it('should have correct timeout value', () => {
    expect(API_CONFIG.timeout).toBe(10000);
  });

  it('should have correct max retries', () => {
    expect(API_CONFIG.maxRetries).toBe(3);
  });

  it('should have correct max content length', () => {
    expect(API_CONFIG.maxContentLength).toBe(50 * 1024 * 1024); // 50MB
  });

  it('should have correct retry status codes', () => {
    expect(API_CONFIG.retryStatusCodes).toEqual([408, 429, 500, 502, 503, 504]);
  });

  it('should have correct headers', () => {
    expect(API_CONFIG.headers).toEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
  });
});

describe('AUTH_CONFIG', () => {
  it('should have correct authentication configuration', () => {
    expect(AUTH_CONFIG).toEqual({
      tokenKey: 'auth_token',
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
    });
  });

  it('should have correct token key', () => {
    expect(AUTH_CONFIG.tokenKey).toBe('auth_token');
  });

  it('should have correct XSRF cookie name', () => {
    expect(AUTH_CONFIG.xsrfCookieName).toBe('XSRF-TOKEN');
  });

  it('should have correct XSRF header name', () => {
    expect(AUTH_CONFIG.xsrfHeaderName).toBe('X-XSRF-TOKEN');
  });
});
