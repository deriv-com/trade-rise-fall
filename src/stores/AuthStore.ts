import { makeAutoObservable } from "mobx";
import { authService } from "../services/auth.service";
import { apiRequest } from "../middleware/middleware";

interface LoginCredentials {
  accountId: string;
  password: string;
}

export class AuthStore {
  isAuthenticated: boolean = false;
  isAuthorizing: boolean = false;

  constructor() {
    // Set initial auth state before making observable
    const token = authService.getStoredToken();
    this.isAuthenticated = !!token;
    
    makeAutoObservable(this);
  }

  setAuthenticated = (state: boolean) => {
    this.isAuthenticated = state;
  };

  setAuthorizing = (state: boolean) => {
    this.isAuthorizing = state;
  };

  login = async (credentials: LoginCredentials): Promise<boolean> => {
    if (this.isAuthorizing) {
      throw new Error('Authorization already in progress');
    }

    this.setAuthorizing(true);

    try {
      const data = await apiRequest<{ token: string }>({
        url: '/login',
        method: 'POST',
        data: credentials
      });

      if (!data.token) {
        throw new Error('No token received');
      }

      authService.setToken(data.token);
      this.setAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      this.setAuthenticated(false);
      throw error;
    } finally {
      this.setAuthorizing(false);
    }
  };

  logout = () => {
    this.setAuthenticated(false);
    authService.clearAuth();
  };
}

export const authStore = new AuthStore();
