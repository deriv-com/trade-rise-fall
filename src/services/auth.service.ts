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
  private pingInterval: NodeJS.Timeout | null = null;
  private tokenCheckInterval: NodeJS.Timeout | null = null;
  private isAuthorizing = false;

  private constructor() {
    // Start token check interval
    this.startTokenCheck();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private startTokenCheck(): void {
    // Check token validity every minute
    this.tokenCheckInterval = setInterval(async () => {
      const token = this.getStoredToken();
      if (token) {
        const isValid = await this.checkTokenValidity(token);
        if (!isValid) {
          this.handleTokenExpiration();
        }
      }
    }, 60000);
  }

  private async checkTokenValidity(token: string): Promise<boolean> {
    try {
      const derivAPI = getDerivAPI();
      const response = await derivAPI.sendRequest({
        authorize: token,
        req_id: Date.now()
      }) as TokenValidationResponse;

      return !response.error;
    } catch (error) {
      console.error('Token validity check failed:', error);
      return false;
    }
  }

  private handleTokenExpiration(): void {
    this.clearAuth();
    console.log('Session expired. Please log in again.');
  }

  public async validateToken(token: string): Promise<boolean> {
    if (this.isAuthorizing) {
      console.log('Authorization already in progress');
      return false;
    }

    this.isAuthorizing = true;

    try {
      const derivAPI = getDerivAPI();
      const response = await derivAPI.sendRequest({
        authorize: token,
        req_id: Date.now()
      }) as TokenValidationResponse;

      if (response.error) {
        console.error('Token validation failed:', response.error);
        return false;
      }

      if (response.authorize) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_email', response.authorize.email);
        this.setupPingInterval();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    } finally {
      this.isAuthorizing = false;
    }
  }

  private setupPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(() => {
      const token = this.getStoredToken();
      if (token) {
        this.checkTokenValidity(token).catch(console.error);
      }
    }, 30000);
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
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    try {
      const derivAPI = getDerivAPI();
      derivAPI.sendRequest({
        logout: 1
      }).catch(console.error);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  public async initialize(): Promise<boolean> {
    const token = this.getStoredToken();
    if (token) {
      return this.validateToken(token);
    }
    return false;
  }

  public cleanup(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }
}

export const authService = AuthService.getInstance();
