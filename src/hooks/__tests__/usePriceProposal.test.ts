import { renderHook, act } from '@testing-library/react';
import { usePriceProposal } from '../usePriceProposal';
import { getDerivAPI } from '../../services/deriv-api.instance';
import { tradingPanelStore } from '../../stores/TradingPanelStore';

jest.mock('../../services/deriv-api.instance');
jest.mock('../../stores/TradingPanelStore', () => ({
  tradingPanelStore: {
    setRiseContractId: jest.fn(),
    setFallContractId: jest.fn(),
    priceError: null,
  },
}));

describe('usePriceProposal', () => {
  const mockDerivAPI = {
    subscribeStream: jest.fn(),
    unsubscribeByPrefix: jest.fn(),
  };

  const defaultProps = {
    price: '100',
    duration: 5,
    basis: 'stake',
    symbol: 'EURUSD',
    durationError: null,
    priceError: null,
    is_rise_fall_valid: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDerivAPI as jest.Mock).mockReturnValue(mockDerivAPI);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with empty proposal and loading state', () => {
    const { result } = renderHook(() => usePriceProposal(
      defaultProps.price,
      defaultProps.duration,
      defaultProps.basis,
      defaultProps.symbol,
      defaultProps.durationError,
      defaultProps.priceError,
      defaultProps.is_rise_fall_valid
    ));

    expect(result.current.proposal).toEqual({});
    expect(result.current.isLoading).toEqual({ rise: true, fall: true });
  });

  it('should not subscribe if price is invalid', () => {
    renderHook(() => usePriceProposal(
      '0',
      defaultProps.duration,
      defaultProps.basis,
      defaultProps.symbol,
      defaultProps.durationError,
      defaultProps.priceError,
      defaultProps.is_rise_fall_valid
    ));

    expect(mockDerivAPI.subscribeStream).not.toHaveBeenCalled();
  });

  it('should handle successful proposal subscriptions', async () => {
    const mockRiseProposal = { id: 'rise-123', ask_price: 100 };
    const mockFallProposal = { id: 'fall-456', ask_price: 100 };
    let riseCallback: Function;
    let fallCallback: Function;

    mockDerivAPI.subscribeStream
      .mockImplementationOnce((config, callback) => {
        if (config.contract_type === 'CALL') riseCallback = callback;
      })
      .mockImplementationOnce((config, callback) => {
        if (config.contract_type === 'PUT') fallCallback = callback;
      });

    const { result } = renderHook(() => usePriceProposal(
      defaultProps.price,
      defaultProps.duration,
      defaultProps.basis,
      defaultProps.symbol,
      defaultProps.durationError,
      defaultProps.priceError,
      defaultProps.is_rise_fall_valid
    ));

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Simulate receiving proposals
    act(() => {
      riseCallback({ proposal: mockRiseProposal });
      fallCallback({ proposal: mockFallProposal });
    });

    expect(result.current.proposal).toEqual({
      rise: mockRiseProposal,
      fall: mockFallProposal,
    });
    expect(tradingPanelStore.setRiseContractId).toHaveBeenCalledWith(mockRiseProposal.id);
    expect(tradingPanelStore.setFallContractId).toHaveBeenCalledWith(mockFallProposal.id);
  });

  it('should handle proposal errors', async () => {
    const mockError = { error: { message: 'Invalid contract parameters' } };
    let riseCallback: Function;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockDerivAPI.subscribeStream.mockImplementationOnce((config, callback) => {
      if (config.contract_type === 'CALL') riseCallback = callback;
    });

    renderHook(() => usePriceProposal(
      defaultProps.price,
      defaultProps.duration,
      defaultProps.basis,
      defaultProps.symbol,
      defaultProps.durationError,
      defaultProps.priceError,
      defaultProps.is_rise_fall_valid
    ));

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Simulate receiving error
    act(() => {
      riseCallback(mockError);
    });

    expect(consoleSpy).toHaveBeenCalledWith('rise proposal error:', mockError.error);
    expect(tradingPanelStore.priceError).toBe(mockError.error.message);

    consoleSpy.mockRestore();
  });

  it('should handle subscription errors', async () => {
    const error = { code: 'ContractBuyValidationError', message: 'Invalid parameters' };
    mockDerivAPI.subscribeStream.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    renderHook(() => usePriceProposal(
      defaultProps.price,
      defaultProps.duration,
      defaultProps.basis,
      defaultProps.symbol,
      defaultProps.durationError,
      defaultProps.priceError,
      defaultProps.is_rise_fall_valid
    ));

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Wait for the promise to resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(consoleSpy).toHaveBeenCalledWith('rise subscription error:', error);
    expect(tradingPanelStore.priceError).toBe(error.message);

    consoleSpy.mockRestore();
  });

  it('should clear proposal and unsubscribe when handleProposal is called', async () => {
    const { result } = renderHook(() => usePriceProposal(
      defaultProps.price,
      defaultProps.duration,
      defaultProps.basis,
      defaultProps.symbol,
      defaultProps.durationError,
      defaultProps.priceError,
      defaultProps.is_rise_fall_valid
    ));

    await act(async () => {
      await result.current.handleProposal();
    });

    expect(mockDerivAPI.unsubscribeByPrefix).toHaveBeenCalledWith('PROPOSAL_');
    expect(result.current.proposal).toEqual({});
  });

  it('should update proposal on price change after debounce', async () => {
    const { rerender } = renderHook(
      ({ price }) => usePriceProposal(
        price,
        defaultProps.duration,
        defaultProps.basis,
        defaultProps.symbol,
        defaultProps.durationError,
        defaultProps.priceError,
        defaultProps.is_rise_fall_valid
      ),
      { initialProps: { price: defaultProps.price } }
    );

    // Change price
    rerender({ price: '200' });

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockDerivAPI.unsubscribeByPrefix).toHaveBeenCalledWith('PROPOSAL_');
    expect(mockDerivAPI.subscribeStream).toHaveBeenCalled();
  });
});
