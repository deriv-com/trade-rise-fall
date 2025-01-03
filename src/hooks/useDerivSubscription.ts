/**
 * Custom hook for managing Deriv API subscriptions and trading data
 * @module hooks/useDerivSubscription
 */

import { useEffect, useRef, useState } from 'react';
import { getDerivAPI } from '../services/deriv-api.instance';
import type { TickResponse, APIRequest } from '../types/trading.types';

/**
 * Props for the useDerivSubscription hook
 */
interface UseDerivSubscriptionProps {
    /** The trading symbol to subscribe to */
    /** Optional callback for handling errors */
    symbol: string;
    onError?: (error: Error) => void;
}

/**
 * Hook for managing Deriv API subscriptions and trading data
 * @param props - The hook configuration props
 * @returns Object containing subscription state and methods
 */
export const useDerivSubscription = ({ symbol, onError }: UseDerivSubscriptionProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [chartStatus, setChartStatus] = useState(true);
    const derivAPI = getDerivAPI();
    const [subscriptionId, setSubscriptionId] = useState('');
    const subscriptionIdRef = useRef(subscriptionId);

    useEffect(() => {
        subscriptionIdRef.current = subscriptionId;
    }, [subscriptionId]);

    useEffect(() => {
        const initializeAPI = async () => {
            try {
                // Initialize any required API setup here
                setIsLoading(false);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Deriv API';
                setError(errorMessage);
                onError?.(new Error(errorMessage));
                setIsLoading(false);
            }
        };

        initializeAPI();

        return () => {
            derivAPI.unsubscribeAll();
        };
    }, []);

    /**
     * Sends a request to the Deriv API
     * @param request - The API request object
     * @returns Promise resolving to the API response
     */
    const requestAPI = async (request: APIRequest): Promise<any> => {
        try {
            return await derivAPI.sendRequest(request);
        } catch (error) {
            const err = error instanceof Error ? error : new Error('API request failed');
            onError?.(err);
            throw err;
        }
    };

    /**
     * Subscribes to real-time data from the Deriv API
     * @param request - The subscription request object
     * @param callback - Callback function to handle incoming data
     */
    const requestSubscribe = async (
        request: APIRequest,
        callback: (response: TickResponse) => void
    ): Promise<void> => {
        try {
            derivAPI.subscribeTicks(request, (response: TickResponse) => {
                if (response.error) {
                    throw new Error(response.error.message);
                }
                callback(response);
            });
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Subscription failed');
            if (err.message.includes('MarketIsClosed')) {
                callback({ tick: undefined } as TickResponse);
            } else {
                onError?.(err);
                throw err;
            }
        }
    };

    /**
     * Unsubscribes from all active subscriptions
     */
    const unsubscribeAll = () => {
        derivAPI.unsubscribeAll();
    };

    return {
        isLoading,
        error,
        chartStatus,
        setChartStatus,
        requestAPI,
        requestSubscribe,
        unsubscribeAll,
        isConnectionOpened: !!derivAPI
    };
};
