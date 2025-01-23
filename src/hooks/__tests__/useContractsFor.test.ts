import { renderHook } from '@testing-library/react';
import { useContractsFor } from '../useContractsFor';
import { getDerivAPI } from '../../services/deriv-api.instance';
import { tradingPanelStore } from '../../stores/TradingPanelStore';

jest.mock('../../services/deriv-api.instance');
jest.mock('../../stores/TradingPanelStore', () => ({
  tradingPanelStore: {
    setIsRiseFallValid: jest.fn(),
  },
}));

describe('useContractsFor', () => {
  const mockDerivAPI = {
    getContractsForSymbol: jest.fn(),
  };

  const mockValidContractsResponse = {
    contracts_for: {
      available: [
        {
          contract_category: 'callput',
          barriers: 0,
          barrier_category: 'euro_atm',
        },
      ],
    },
  };

  const mockInvalidContractsResponse = {
    contracts_for: {
      available: [
        {
          contract_category: 'other',
          barriers: 1,
          barrier_category: 'other',
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDerivAPI as jest.Mock).mockReturnValue(mockDerivAPI);
  });

  it('should set isRiseFallValid to true when valid contracts are available', async () => {
    mockDerivAPI.getContractsForSymbol.mockResolvedValueOnce(mockValidContractsResponse);

    renderHook(() => useContractsFor('EURUSD'));

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockDerivAPI.getContractsForSymbol).toHaveBeenCalledWith('EURUSD');
    expect(tradingPanelStore.setIsRiseFallValid).toHaveBeenCalledWith(true);
  });

  it('should set isRiseFallValid to false when no valid contracts are available', async () => {
    mockDerivAPI.getContractsForSymbol.mockResolvedValueOnce(mockInvalidContractsResponse);

    renderHook(() => useContractsFor('EURUSD'));

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockDerivAPI.getContractsForSymbol).toHaveBeenCalledWith('EURUSD');
    expect(tradingPanelStore.setIsRiseFallValid).toHaveBeenCalledWith(false);
  });

  it('should set isRiseFallValid to false when API call fails', async () => {
    const error = new Error('API Error');
    mockDerivAPI.getContractsForSymbol.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    renderHook(() => useContractsFor('EURUSD'));

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockDerivAPI.getContractsForSymbol).toHaveBeenCalledWith('EURUSD');
    expect(tradingPanelStore.setIsRiseFallValid).toHaveBeenCalledWith(false);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching contracts:', error);

    consoleSpy.mockRestore();
  });

  it('should not make API call when symbol is empty', () => {
    renderHook(() => useContractsFor(''));

    expect(mockDerivAPI.getContractsForSymbol).not.toHaveBeenCalled();
    expect(tradingPanelStore.setIsRiseFallValid).not.toHaveBeenCalled();
  });

  it('should make new API call when symbol changes', async () => {
    const { rerender } = renderHook(({ symbol }) => useContractsFor(symbol), {
      initialProps: { symbol: 'EURUSD' },
    });

    // Wait for the first API call
    await new Promise(resolve => setTimeout(resolve, 0));

    mockDerivAPI.getContractsForSymbol.mockClear();
    rerender({ symbol: 'GBPUSD' });

    // Wait for the second API call
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockDerivAPI.getContractsForSymbol).toHaveBeenCalledWith('GBPUSD');
  });
});
