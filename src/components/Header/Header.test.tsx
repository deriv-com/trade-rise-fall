import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Mock the stores
jest.mock('../../stores/AuthStore', () => ({
  authStore: {
    isAuthenticated: false,
    logout: jest.fn(),
  },
}));

jest.mock('../../stores/BalanceStore', () => ({
  balanceStore: {
    balance: '1000.00',
    currency: 'USD',
  },
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock UI components
jest.mock('@deriv-com/quill-ui', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@deriv/quill-icons', () => ({
  BrandDerivLogoCoralIcon: () => <div data-testid="brand-logo">Logo</div>,
}));

// Mock mobx-react-lite
jest.mock('mobx-react-lite', () => ({
  observer: (component: any) => component,
}));

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and navigation links', () => {
    renderHeader();
    
    expect(screen.getByTestId('brand-logo')).toBeInTheDocument();
    expect(screen.getByText('Option Trading')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      const { authStore } = require('../../stores/AuthStore');
      authStore.isAuthenticated = false;
    });

    it('shows login button and hides balance', () => {
      renderHeader();
      
      expect(screen.getByText('Log in')).toBeInTheDocument();
      expect(screen.queryByText('1000.00 USD')).not.toBeInTheDocument();
      expect(screen.queryByText('Log out')).not.toBeInTheDocument();
    });

    it('navigates to login page when login button is clicked', () => {
      renderHeader();
      
      fireEvent.click(screen.getByText('Log in'));
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      const { authStore } = require('../../stores/AuthStore');
      authStore.isAuthenticated = true;
    });

    it('shows logout button and balance', () => {
      renderHeader();
      
      expect(screen.getByText('Log out')).toBeInTheDocument();
      expect(screen.getByText('1000.00 USD')).toBeInTheDocument();
      expect(screen.queryByText('Log in')).not.toBeInTheDocument();
    });

    it('calls logout and navigates when logout button is clicked', () => {
      const { authStore } = require('../../stores/AuthStore');
      renderHeader();
      
      fireEvent.click(screen.getByText('Log out'));
      
      expect(authStore.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('displays updated balance when balance changes', () => {
      const { balanceStore } = require('../../stores/BalanceStore');
      balanceStore.balance = '2000.00';
      balanceStore.currency = 'EUR';
      
      renderHeader();
      
      expect(screen.getByText('2000.00 EUR')).toBeInTheDocument();
    });
  });
});
