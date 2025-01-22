import { render, screen, fireEvent } from '@testing-library/react';
import { OpenContractsModal } from './OpenContractsModal';
import { tradingPanelStore } from '../../../stores/TradingPanelStore';

// Mock the store
jest.mock('../../../stores/TradingPanelStore', () => ({
  tradingPanelStore: {
    isOpenContractsModalVisible: false,
    setOpenContractsModalVisible: jest.fn(),
    openContracts: []
  }
}));

describe('OpenContractsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store to default state
    tradingPanelStore.isOpenContractsModalVisible = false;
    tradingPanelStore.openContracts = [];
  });

  it('shows no contracts message when there are no open contracts', () => {
    tradingPanelStore.isOpenContractsModalVisible = true;
    render(<OpenContractsModal />);
    expect(screen.getByText('No open contracts')).toBeInTheDocument();
  });

  it('displays contract details when contracts exist', () => {
    tradingPanelStore.isOpenContractsModalVisible = true;
    tradingPanelStore.openContracts = [{
      account_id: 1234,
      barrier: "0",
      barrier_count: 0,
      bid_price: 50,
      buy_price: 50,
      contract_id: 1,
      contract_type: "RISE",
      currency: "USD",
      current_spot: 110,
      current_spot_display_value: "110",
      current_spot_time: Date.now(),
      date_expiry: Date.now() + 3600000,
      date_settlement: Date.now() + 3600000,
      date_start: Date.now(),
      display_name: "Test Contract",
      entry_spot: 100,
      entry_spot_display_value: "100",
      entry_tick: 100,
      entry_tick_display_value: "100",
      entry_tick_time: Date.now(),
      expiry_time: Date.now() + 3600000,
      id: "1",
      is_expired: 0,
      is_forward_starting: 0,
      is_intraday: 1,
      is_path_dependent: 0,
      is_settleable: 0,
      is_sold: 0,
      is_valid_to_cancel: 1,
      is_valid_to_sell: 1,
      longcode: "Test Contract Long Code",
      payout: 100,
      profit: 10,
      profit_percentage: 20,
      purchase_time: Date.now(),
      shortcode: "RISE_TEST",
      status: "open",
      transaction_ids: {
        buy: 12345
      },
      underlying: "BTCUSD"
    }];

    render(<OpenContractsModal />);
    
    expect(screen.getByText('Test Contract - RISE')).toBeInTheDocument();
    expect(screen.getByText('Entry Price:')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('10.00 USD (20.00%)')).toBeInTheDocument();
  });

  it('calls setOpenContractsModalVisible when modal is closed', () => {
    tradingPanelStore.isOpenContractsModalVisible = true;
    render(<OpenContractsModal />);
    
    const overlay = screen.getByTestId('dt_overlay');
    fireEvent.click(overlay);
    
    expect(tradingPanelStore.setOpenContractsModalVisible).toHaveBeenCalledWith(false);
  });
});
