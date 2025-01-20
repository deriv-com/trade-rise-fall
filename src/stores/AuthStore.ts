import { makeAutoObservable } from "mobx";
import { authService } from "../services/auth.service";
import { apiRequest } from "../middleware/middleware";

interface LoginCredentials {
  accountId: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
  };
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class AuthStore {
  isAuthenticated: boolean = false;
  isAuthorizing: boolean = false;
  lastError: string | null = null;

  constructor() {
    const token = authService.getStoredToken();
    this.isAuthenticated = !!token;
    makeAutoObservable(this);
  }

  private setAuthenticated = (state: boolean) => {
    this.isAuthenticated = state;
  };

  private setAuthorizing = (state: boolean) => {
    this.isAuthorizing = state;
  };

  private setLastError = (error: string | null) => {
    this.lastError = error;
  };

  login = async (credentials: LoginCredentials): Promise<boolean> => {
    if (this.isAuthorizing) {
      throw new AuthError('Authorization already in progress');
    }

    this.setAuthorizing(true);
    this.setLastError(null);

    try {
      const data = await apiRequest<LoginResponse>({
        url: '/login',
        method: 'POST',
        data: credentials
      });

      if (!data.token) {
        throw new AuthError('No token received');
      }

      authService.setToken(data.token);
      this.setAuthenticated(true);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      this.setLastError(errorMessage);
      this.setAuthenticated(false);
      throw error;
    } finally {
      this.setAuthorizing(false);
    }
  };

  logout = () => {
    this.setAuthenticated(false);
    this.setLastError(null);
    authService.clearAuth();
  };

  clearError = () => {
    this.setLastError(null);
  };
}

export const authStore = new AuthStore();
