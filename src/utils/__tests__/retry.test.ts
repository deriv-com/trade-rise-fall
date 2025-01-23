import { calculateBackoff, shouldRetryRequest, wait } from '../retry';
import { AxiosError } from 'axios';
import { API_CONFIG } from '../../config/api.config';

describe('retry utils', () => {
  describe('calculateBackoff', () => {
    it('should calculate exponential backoff correctly', () => {
      expect(calculateBackoff(0)).toBe(1000); // 2^0 * 1000 = 1000
      expect(calculateBackoff(1)).toBe(2000); // 2^1 * 1000 = 2000
      expect(calculateBackoff(2)).toBe(4000); // 2^2 * 1000 = 4000
      expect(calculateBackoff(3)).toBe(8000); // 2^3 * 1000 = 8000
    });

    it('should not exceed maximum backoff of 10 seconds', () => {
      expect(calculateBackoff(4)).toBe(10000); // Would be 16000, but capped at 10000
      expect(calculateBackoff(5)).toBe(10000); // Would be 32000, but capped at 10000
    });
  });

  describe('shouldRetryRequest', () => {
    const createAxiosError = (status: number): AxiosError => ({
      response: { status } as any,
      isAxiosError: true,
      name: '',
      message: '',
      toJSON: () => ({}),
    });

    it('should return true for retryable status codes within max retries', () => {
      const error = createAxiosError(429);
      const config = { retry: 0, maxRetries: 3 };
      
      expect(shouldRetryRequest(error, config)).toBe(true);
    });

    it('should return false when max retries exceeded', () => {
      const error = createAxiosError(429);
      const config = { retry: 3, maxRetries: 3 };
      
      expect(shouldRetryRequest(error, config)).toBe(false);
    });

    it('should return false for non-retryable status codes', () => {
      const error = createAxiosError(400);
      const config = { retry: 0, maxRetries: 3 };
      
      expect(shouldRetryRequest(error, config)).toBe(false);
    });

    it('should use default config values when not provided', () => {
      const error = createAxiosError(429);
      
      expect(shouldRetryRequest(error, {})).toBe(true);
    });

    it('should handle custom retry status codes from default config', () => {
      const error = createAxiosError(503);
      const config = {
        retry: 0,
        maxRetries: 3,
        retryStatusCodes: API_CONFIG.retryStatusCodes
      };
      
      expect(shouldRetryRequest(error, config)).toBe(true);
    });

    it('should return false when response is undefined', () => {
      const error = {
        isAxiosError: true,
        name: '',
        message: '',
        toJSON: () => ({}),
      } as AxiosError;
      
      expect(shouldRetryRequest(error, {})).toBe(false);
    });

    it('should handle all default retry status codes', () => {
      const config = { retry: 0, maxRetries: 3 };
      
      API_CONFIG.retryStatusCodes.forEach(statusCode => {
        const error = createAxiosError(statusCode);
        expect(shouldRetryRequest(error, config)).toBe(true);
      });
    });
  });

  describe('wait', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should wait for the specified time', async () => {
      const waitPromise = wait(1000);
      
      jest.advanceTimersByTime(999);
      expect(jest.getTimerCount()).toBe(1);
      
      jest.advanceTimersByTime(1);
      await expect(waitPromise).resolves.toBeUndefined();
      expect(jest.getTimerCount()).toBe(0);
    });

    it('should resolve after the timeout', async () => {
      const callback = jest.fn();
      wait(1000).then(callback);

      expect(callback).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(1000);
      await Promise.resolve(); // Let the promise resolve
      
      expect(callback).toHaveBeenCalled();
    });
  });
});
