import { apiRequest } from '../middleware/middleware';
import { balanceStore } from '../stores/BalanceStore';
import { LoginCredentials, LoginResponse, BalanceResponse } from '../types/api.types';
import { authService } from '../services/auth.service';

// Auth endpoints
export const authEndpoints = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiRequest<LoginResponse>({
            url: '/login',
            method: 'POST',
            data: credentials
        });

        if (!response.token) {
            throw new Error('No token received');
        }

        // Store the token
        authService.setToken(response.token);
        
        return response;
    }
};

// Balance endpoints
export const balanceEndpoints = {
    fetchBalance: async (): Promise<BalanceResponse> => {
        try {
            const response = await apiRequest<BalanceResponse>({
                url: '/balance',
                method: 'GET'
            });
            
            // Update balance store with the response
            if (response) {
                balanceStore.setBalance(response.balance, response.currency);
            }
            
            return response;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    }
};
