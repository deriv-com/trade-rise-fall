import { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

type RetryStatusCode = typeof API_CONFIG.retryStatusCodes[number];

interface RetryConfig {
    retry?: number;
    maxRetries?: number;
    retryStatusCodes?: readonly RetryStatusCode[];
}

export const calculateBackoff = (retryCount: number): number => {
    // Exponential backoff with max of 10 seconds
    return Math.min(1000 * (2 ** retryCount), 10000);
};

export const shouldRetryRequest = (
    error: AxiosError,
    config: RetryConfig
): boolean => {
    const retryCount = config.retry ?? 0;
    const maxRetries = config.maxRetries ?? API_CONFIG.maxRetries;
    const retryStatusCodes = config.retryStatusCodes ?? API_CONFIG.retryStatusCodes;

    return (
        retryCount < maxRetries &&
        error.response !== undefined &&
        retryStatusCodes.includes(error.response.status as RetryStatusCode)
    );
};

export const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
