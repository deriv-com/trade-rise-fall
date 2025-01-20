class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  public setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  public clearAuth(): void {
    localStorage.removeItem('auth_token');
  }

  public isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = AuthService.getInstance();
