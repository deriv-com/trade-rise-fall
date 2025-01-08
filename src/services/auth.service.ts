import { getDerivAPI } from './deriv-api.instance';

interface TokenValidationResponse {
  authorize?: {
    email: string;
    currency_config: Array<{ id: string }>;
    balance?: number;
    landing_company_name: string;
    country: string;
    local_currency_config?: {
      currency: string;
      decimal_places: number;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async validateToken(token: string): Promise<boolean> {
    try {
      const response = await getDerivAPI().sendRequest({
        authorize: token,
        req_id: 1
      }) as TokenValidationResponse;

      if (response.error) {
        console.error('Token validation failed:', response.error);
        return false;
      }

      if (response.authorize) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_email', response.authorize.email);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  public async handleOAuthCallback(urlParams: URLSearchParams): Promise<boolean> {
    const token = urlParams.get('token1');
    
    if (!token) {
      console.error('No token found in URL parameters');
      return false;
    }

    return this.validateToken(token);
  }

  public getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  public clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    // Don't disconnect here as the WebSocket connection is managed by deriv-api.instance
  }

  public async initialize(): Promise<void> {
    const token = this.getStoredToken();
    if (token) {
      await this.validateToken(token);
    }
  }
}

export const authService = AuthService.getInstance();
