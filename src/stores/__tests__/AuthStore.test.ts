import { AuthStore } from '../AuthStore';
import { authService } from '../../services/auth.service';

// Mock the auth service
jest.mock('../../services/auth.service', () => ({
  authService: {
    getStoredToken: jest.fn(),
    setToken: jest.fn(),
    clearAuth: jest.fn(),
  },
}));

describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(() => {
    jest.clearAllMocks();
    (authService.getStoredToken as jest.Mock).mockReturnValue(null);
    store = new AuthStore();
  });

  describe('initialization', () => {
    it('should initialize with default values when no token exists', () => {
      expect(store.isAuthenticated).toBe(false);
      expect(store.isAuthorizing).toBe(false);
      expect(store.lastError).toBeNull();
    });

    it('should initialize as authenticated when token exists', () => {
      (authService.getStoredToken as jest.Mock).mockReturnValue('existing-token');
      store = new AuthStore();
      expect(store.isAuthenticated).toBe(true);
    });
  });

  describe('handleLoginSuccess', () => {
    it('should handle successful login', () => {
      store.handleLoginSuccess('new-token');

      expect(authService.setToken).toHaveBeenCalledWith('new-token');
      expect(store.isAuthenticated).toBe(true);
      expect(store.isAuthorizing).toBe(false);
      expect(store.lastError).toBeNull();
    });
  });

  describe('handleLoginFailure', () => {
    it('should handle login failure', () => {
      const error = new Error('Login failed');
      store.handleLoginFailure(error);

      expect(store.isAuthenticated).toBe(false);
      expect(store.isAuthorizing).toBe(false);
      expect(store.lastError).toBe('Login failed');
    });
  });

  describe('startAuthorizing', () => {
    it('should start authorization process', () => {
      store.startAuthorizing();

      expect(store.isAuthorizing).toBe(true);
      expect(store.lastError).toBeNull();
    });

    it('should throw error if authorization is already in progress', () => {
      store.startAuthorizing();

      expect(() => store.startAuthorizing()).toThrow('Authorization already in progress');
      expect(() => store.startAuthorizing()).toThrow(Error);
    });
  });

  describe('logout', () => {
    it('should handle logout', () => {
      // Set initial authenticated state
      store.handleLoginSuccess('token');
      expect(store.isAuthenticated).toBe(true);

      // Perform logout
      store.logout();

      expect(store.isAuthenticated).toBe(false);
      expect(store.lastError).toBeNull();
      expect(authService.clearAuth).toHaveBeenCalled();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      // Set initial error state
      store.handleLoginFailure(new Error('Test error'));
      expect(store.lastError).toBe('Test error');

      // Clear error
      store.clearError();
      expect(store.lastError).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should maintain error state until cleared', () => {
      const error = new Error('Test error');
      store.handleLoginFailure(error);
      expect(store.lastError).toBe('Test error');

      // Error should persist until explicitly cleared
      store.handleLoginSuccess('token');
      expect(store.lastError).toBeNull();
    });
  });

  describe('state transitions', () => {
    it('should handle complete auth flow', () => {
      // Start authorization
      store.startAuthorizing();
      expect(store.isAuthorizing).toBe(true);
      expect(store.isAuthenticated).toBe(false);

      // Successful login
      store.handleLoginSuccess('token');
      expect(store.isAuthorizing).toBe(false);
      expect(store.isAuthenticated).toBe(true);
      expect(store.lastError).toBeNull();

      // Logout
      store.logout();
      expect(store.isAuthenticated).toBe(false);
      expect(store.isAuthorizing).toBe(false);
      expect(store.lastError).toBeNull();
    });

    it('should handle failed auth flow', () => {
      // Start authorization
      store.startAuthorizing();
      expect(store.isAuthorizing).toBe(true);

      // Failed login
      store.handleLoginFailure(new Error('Auth failed'));
      expect(store.isAuthorizing).toBe(false);
      expect(store.isAuthenticated).toBe(false);
      expect(store.lastError).toBe('Auth failed');

      // Clear error
      store.clearError();
      expect(store.lastError).toBeNull();
    });
  });
});
