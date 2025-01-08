import { makeAutoObservable } from "mobx";
import { authService } from "../services/auth.service";

export class AuthStore {
  isAuthenticated: boolean = false;
  isInitializing: boolean = true;
  isAuthorizing: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  public async initialize() {
    try {
      const token = authService.getStoredToken();
      if (token) {
        const success = await authService.validateToken(token);
        this.setAuthenticated(success);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.setAuthenticated(false);
    } finally {
      this.setInitializing(false);
    }
  }

  setInitializing = (state: boolean) => {
    this.isInitializing = state;
  };

  setAuthenticated = (state: boolean) => {
    this.isAuthenticated = state;
  };

  setAuthorizing = (state: boolean) => {
    this.isAuthorizing = state;
  };

  login = () => {
    const app_id = process.env.REACT_APP_WS_PORT;
    const server_url = process.env.OAUTH_URL;

    if (!app_id || !server_url) {
      console.error('Required environment variables are not set');
      return;
    }

    const domain = window.location.hostname;
    const redirect_uri = `${window.location.protocol}//${domain}${window.location.port ? `:${window.location.port}` : ''}${window.location.pathname}`;

    const deriv_oauth_url = `${server_url}/oauth2/authorize?app_id=${app_id}&l=EN&brand=deriv&redirect_uri=${encodeURIComponent(redirect_uri)}`;

    window.location.href = deriv_oauth_url;
  };

  logout = () => {
    this.setAuthenticated(false);
    authService.clearAuth();
  };

  handleAuthCallback = async (token: string): Promise<boolean> => {
    if (this.isAuthorizing) {
      console.log('Authorization already in progress');
      return false;
    }

    this.setAuthorizing(true);

    try {
      const success = await authService.validateToken(token);
      this.setAuthenticated(success);
      return success;
    } catch (error) {
      console.error('Auth callback error:', error);
      return false;
    } finally {
      this.setAuthorizing(false);
    }
  };
}

export const authStore = new AuthStore();
