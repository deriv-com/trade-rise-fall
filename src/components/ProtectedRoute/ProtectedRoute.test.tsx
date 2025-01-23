import { render } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';

// Mock the stores
jest.mock('../../stores/AuthStore', () => ({
  authStore: {
    isAuthenticated: false,
  },
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  Navigate: jest.fn(({ to, state, replace }) => {
    mockNavigate(to, state, replace);
    return null;
  }),
  useLocation: () => ({
    pathname: '/protected-page',
    search: '',
    hash: '',
    state: null,
  }),
}));

// Mock mobx-react-lite
jest.mock('mobx-react-lite', () => ({
  observer: (component: any) => component,
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when user is not authenticated', () => {
    const { authStore } = require('../../stores/AuthStore');
    authStore.isAuthenticated = false;

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      '/login',
      {
        from: {
          pathname: '/protected-page',
          search: '',
          hash: '',
          state: null,
        },
      },
      true
    );
  });

  it('renders children when user is authenticated', () => {
    const { authStore } = require('../../stores/AuthStore');
    authStore.isAuthenticated = true;

    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('passes current location to Navigate component', () => {
    const { authStore } = require('../../stores/AuthStore');
    authStore.isAuthenticated = false;

    const customLocation = {
      pathname: '/custom-path',
      search: '?query=test',
      hash: '#section1',
      state: { someState: true },
    };

    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue(customLocation);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      '/login',
      { from: customLocation },
      true
    );
  });
});
