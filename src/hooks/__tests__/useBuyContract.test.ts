import { renderHook, act } from '@testing-library/react';
import { useBuyContract } from '../useBuyContract';
import { getDerivAPI } from '../../services/deriv-api.instance';
import { tradingPanelStore } from '../../stores/TradingPanelStore';

// Mock dependencies
jest.mock('../../services/deriv-api.instance');
jest.mock('../../stores/TradingPanelStore', () => ({
  tradingPanelStore: {
    riseContractId: 'rise-123',
    fallContractId: 'fall-456',
    setRiseContractId: jest.fn(),
    setFallContractId: jest.fn(),
  },
}));

describe('useBuyContract', () => {
  const mockDerivAPI = {
    sendRequest: jest.fn(),
  };

  const mockHandleProposal = jest.fn();
  const mockPrice = '100';

  beforeEach(() => {
    jest.clearAllMocks();
    (getDerivAPI as jest.Mock).mockReturnValue(mockDerivAPI);
  });

  it('should buy rise contract successfully', async () => {
    mockDerivAPI.sendRequest.mockResolvedValueOnce({ buy: 'success' });

    const { result } = renderHook(() => useBuyContract(mockPrice, mockHandleProposal));

    await act(async () => {
      await result.current.buyContract('rise');
    });

    expect(mockDerivAPI.sendRequest).toHaveBeenCalledWith({
      buy: 'rise-123',
      price: 100,
    });
    expect(tradingPanelStore.setRiseContractId).toHaveBeenCalledWith(null);
    expect(tradingPanelStore.setFallContractId).toHaveBeenCalledWith(null);
    expect(mockHandleProposal).toHaveBeenCalled();
  });

  it('should buy fall contract successfully', async () => {
    mockDerivAPI.sendRequest.mockResolvedValueOnce({ buy: 'success' });

    const { result } = renderHook(() => useBuyContract(mockPrice, mockHandleProposal));

    await act(async () => {
      await result.current.buyContract('fall');
    });

    expect(mockDerivAPI.sendRequest).toHaveBeenCalledWith({
      buy: 'fall-456',
      price: 100,
    });
    expect(tradingPanelStore.setRiseContractId).toHaveBeenCalledWith(null);
    expect(tradingPanelStore.setFallContractId).toHaveBeenCalledWith(null);
    expect(mockHandleProposal).toHaveBeenCalled();
  });

  it('should handle API error response', async () => {
    const errorResponse = { error: { message: 'API Error' } };
    mockDerivAPI.sendRequest.mockResolvedValueOnce(errorResponse);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useBuyContract(mockPrice, mockHandleProposal));

    await act(async () => {
      await result.current.buyContract('rise');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Buy contract error:', errorResponse.error);
    expect(mockHandleProposal).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle missing contract ID', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const originalRiseContractId = tradingPanelStore.riseContractId;
    (tradingPanelStore as any).riseContractId = null;

    const { result } = renderHook(() => useBuyContract(mockPrice, mockHandleProposal));

    await act(async () => {
      await result.current.buyContract('rise');
    });

    expect(consoleSpy).toHaveBeenCalledWith('No contract ID available for', 'rise');
    expect(mockDerivAPI.sendRequest).not.toHaveBeenCalled();
    expect(mockHandleProposal).not.toHaveBeenCalled();

    // Restore original value
    (tradingPanelStore as any).riseContractId = originalRiseContractId;
    consoleSpy.mockRestore();
  });

  it('should handle API request error', async () => {
    const error = new Error('Network error');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockDerivAPI.sendRequest.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useBuyContract(mockPrice, mockHandleProposal));

    await act(async () => {
      await result.current.buyContract('rise');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error buying contract:', error);
    expect(mockHandleProposal).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
