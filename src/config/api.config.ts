export const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    maxRetries: 3,
    maxContentLength: 50 * 1024 * 1024, // 50MB
    retryStatusCodes: [408, 429, 500, 502, 503, 504] as const,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
} as const;

export const AUTH_CONFIG = {
    tokenKey: 'auth_token',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
} as const;
