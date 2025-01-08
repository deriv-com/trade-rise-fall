import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  handleAuthCallback: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!authService.getStoredToken();
  });
  const navigate = useNavigate();

  const handleAuthCallback = useCallback(async (token: string): Promise<boolean> => {
    try {
      const success = await authService.validateToken(token);
      setIsAuthenticated(success);
      return success;
    } catch (error) {
      console.error('Auth callback error:', error);
      return false;
    }
  }, []);

  const login = useCallback(() => {
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
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    authService.clearAuth();
    navigate('/');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, handleAuthCallback }}>
      {children}
    </AuthContext.Provider>
  );
};
