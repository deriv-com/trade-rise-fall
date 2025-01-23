import { render, screen } from '@testing-library/react';
import DerivTrading from '../DerivTrading';
import { Chart } from '../../components/TradingComponents/Chart/Chart';
import { TradingPanel } from '../../components/TradingComponents/TradingPanel/TradingPanel';

// Mock the child components
jest.mock('../../components/TradingComponents/Chart/Chart', () => ({
  Chart: jest.fn(() => <div data-testid="mock-chart">Mock Chart</div>)
}));

jest.mock('../../components/TradingComponents/TradingPanel/TradingPanel', () => ({
  TradingPanel: jest.fn(() => <div data-testid="mock-trading-panel">Mock Trading Panel</div>)
}));

// Mock the styles using the test mock files
jest.mock('../../test/mocks/styleMock.js', () => ({}), { virtual: true });

// Mock the specific style imports
jest.mock('../DerivTrading.scss', () => ({}));
jest.mock('@deriv/deriv-charts/dist/smartcharts.css', () => ({}));

describe('DerivTrading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should render without crashing', () => {
    render(<DerivTrading />);
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-trading-panel')).toBeInTheDocument();
  });

  it('should render Chart component', () => {
    render(<DerivTrading />);
    expect(Chart).toHaveBeenCalled();
  });

  it('should render TradingPanel component', () => {
    render(<DerivTrading />);
    expect(TradingPanel).toHaveBeenCalled();
  });

  it('should have correct container class', () => {
    const { container } = render(<DerivTrading />);
    expect(container.firstChild).toHaveClass('trading-container');
  });

  it('should maintain component structure', () => {
    const { container } = render(<DerivTrading />);
    const tradingContainer = container.firstChild;
    
    // Check if the container has exactly 2 children (Chart and TradingPanel)
    expect(tradingContainer?.childNodes).toHaveLength(2);
    
    // Check the order of components
    const [firstChild, secondChild] = Array.from(tradingContainer?.childNodes || []);
    expect(firstChild).toHaveAttribute('data-testid', 'mock-chart');
    expect(secondChild).toHaveAttribute('data-testid', 'mock-trading-panel');
  });

  it('should be wrapped with MobX observer', () => {
    const { rerender } = render(<DerivTrading />);
    
    // Initial render check
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-trading-panel')).toBeInTheDocument();
    
    // Rerender should work without issues
    rerender(<DerivTrading />);
    
    // Components should still be present after rerender
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-trading-panel')).toBeInTheDocument();
  });

  it('should have the correct DOM structure', () => {
    const { container } = render(<DerivTrading />);
    const tradingContainer = container.firstChild as HTMLElement;
    
    // Verify container element
    expect(tradingContainer).toBeInTheDocument();
    expect(tradingContainer.tagName).toBe('DIV');
    expect(tradingContainer).toHaveClass('trading-container');
    
    // Verify children
    const children = Array.from(tradingContainer.children);
    expect(children).toHaveLength(2);
    expect(children[0]).toHaveAttribute('data-testid', 'mock-chart');
    expect(children[1]).toHaveAttribute('data-testid', 'mock-trading-panel');
  });
});
