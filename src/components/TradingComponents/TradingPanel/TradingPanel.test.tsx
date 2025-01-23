import { render, screen, fireEvent } from '@testing-library/react';
import { TradingPanel } from './TradingPanel';
import { tradingPanelStore } from '../../../stores/TradingPanelStore';

// Mock the scss module
jest.mock('./TradingPanel.scss', () => ({}));

// Mock the stores and hooks
jest.mock('../../../stores/TradingPanelStore', () => ({
  tradingPanelStore: {
    duration: 15,
    price: '10',
    allowEquals: false,
    selectedDurationTab: 'duration',
    selectedStakeTab: 'stake',
    setDuration: jest.fn(),
    setPrice: jest.fn(),
    setAllowEquals: jest.fn(),
    setSelectedDurationTab: jest.fn(),
    setSelectedStakeTab: jest.fn(),
    durationError: null,
    priceError: null,
    is_rise_fall_valid: true,
    openContracts: [],
    setOpenContractsModalVisible: jest.fn()
  }
}));

jest.mock('../../../stores/ChartStore', () => ({
  chartStore: {
    symbol: 'BTCUSD'
  }
}));

// Mock the useRiseFallTrading hook
jest.mock('../../../hooks/useRiseFallTrading', () => ({
  useRiseFallTrading: () => ({
    proposal: {
      rise: {
        payout: 20,
        ask_price: 10
      },
      fall: {
        payout: 20,
        ask_price: 10
      }
    },
    clearProposal: jest.fn(),
    isLoading: {
      rise: false,
      fall: false
    },
    buyContract: jest.fn()
  })
}));

describe('TradingPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<TradingPanel />);
    expect(container).toBeInTheDocument();
  });

  it('displays error message when rise/fall is not valid', () => {
    tradingPanelStore.is_rise_fall_valid = false;
    render(<TradingPanel />);
    expect(screen.getByText('This contract type is not valid for Rise/Fall')).toBeInTheDocument();
  });

  it('shows correct payout values', () => {
    tradingPanelStore.is_rise_fall_valid = true;
    render(<TradingPanel />);
    // With payout 20 and ask_price 10, the percentage should be 100%
    expect(screen.getAllByText(/100\.00%/)).toHaveLength(2);
  });

  it('opens contracts modal when button is clicked', () => {
    tradingPanelStore.is_rise_fall_valid = true;
    render(<TradingPanel />);
    fireEvent.click(screen.getByRole('button', { name: /show open contracts/i }));
    expect(tradingPanelStore.setOpenContractsModalVisible).toHaveBeenCalledWith(true);
  });
});
