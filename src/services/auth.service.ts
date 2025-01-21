class AuthService {
  private static instance: AuthService;
  private readonly TOKEN_KEY = 'auth_token';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public async clearAuth(): Promise<void> {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.clear();
    
    // Clear auth-related cookies
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
  }

  public isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = AuthService.getInstance();
