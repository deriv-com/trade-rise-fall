import { render, screen } from '@testing-library/react';
import { Chart } from './Chart';
import { chartStore } from '../../../stores/ChartStore';
import { getDerivAPI } from '../../../services/deriv-api.instance';
import * as utils from '../../../common/utils';

// Mock the scss module
jest.mock('./Chart.scss', () => ({}));
jest.mock('@deriv/deriv-charts/dist/smartcharts.css', () => ({}));

// Mock the ReconnectingLoader component
jest.mock('../../ReconnectingLoader/ReconnectingLoader', () => ({
  ReconnectingLoader: () => <div data-testid="reconnecting-loader">Reconnecting...</div>
}));

// Mock the deriv-charts components
jest.mock('@deriv/deriv-charts', () => ({
  SmartChart: ({ children }: any) => <div data-testid="smart-chart">{children}</div>,
  ChartTitle: () => <div>Chart Title</div>
}));

// Mock the deriv API instance
jest.mock('../../../services/deriv-api.instance', () => ({
  getDerivAPI: jest.fn()
}));

// Mock the utils
jest.mock('../../../common/utils', () => ({
  isBrowser: jest.fn()
}));

// Mock the chartStore
jest.mock('../../../stores/ChartStore', () => {
  const store = {
    symbol: '',
    showChart: true,
    setChartStatus: jest.fn(),
    setSymbol: jest.fn(),
    setShowChart: jest.fn()
  };
  return { chartStore: store };
});

describe('Chart', () => {
  const mockDerivAPI = {
    isConnected: jest.fn(),
    onConnectionChange: jest.fn(),
    sendRequest: jest.fn(),
    subscribeStream: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDerivAPI as jest.Mock).mockReturnValue(mockDerivAPI);
    mockDerivAPI.isConnected.mockReturnValue(true);
    mockDerivAPI.onConnectionChange.mockImplementation((callback) => {
      callback(true);
      return jest.fn(); // cleanup function
    });
    (utils.isBrowser as jest.Mock).mockReturnValue(true);
  });

  it('renders without crashing', () => {
    const { container } = render(<Chart />);
    expect(container).toBeInTheDocument();
  });

  it('initializes chart store with default values', () => {
    render(<Chart />);
    expect(chartStore.setSymbol).toHaveBeenCalledWith('1HZ10V');
    expect(chartStore.setChartStatus).toHaveBeenCalledWith(true);
    expect(chartStore.setShowChart).toHaveBeenCalledWith(true);
  });

  it('shows reconnecting loader when not connected', () => {
    mockDerivAPI.isConnected.mockReturnValue(false);
    render(<Chart />);
    expect(screen.getByTestId('reconnecting-loader')).toBeInTheDocument();
  });

  it('shows chart when connected and in browser', () => {
    render(<Chart />);
    expect(screen.getByTestId('smart-chart')).toBeInTheDocument();
  });

  it('does not show chart when not in browser', () => {
    (utils.isBrowser as jest.Mock).mockReturnValue(false);
    // Update store value before rendering
    chartStore.showChart = false;
    render(<Chart />);
    expect(screen.queryByTestId('smart-chart')).not.toBeInTheDocument();
  });
});
