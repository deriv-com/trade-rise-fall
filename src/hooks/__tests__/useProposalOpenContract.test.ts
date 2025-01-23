import { renderHook } from '@testing-library/react';
import { useProposalOpenContract } from '../useProposalOpenContract';
import { getDerivAPI } from '../../services/deriv-api.instance';
import { tradingPanelStore } from '../../stores/TradingPanelStore';
import { isLogged } from '../../common/utils';

jest.mock('../../services/deriv-api.instance');
jest.mock('../../stores/TradingPanelStore', () => ({
  tradingPanelStore: {
    addOpenContract: jest.fn(),
  },
}));
jest.mock('../../common/utils', () => ({
  isLogged: jest.fn(),
}));

describe('useProposalOpenContract', () => {
  const mockDerivAPI = {
    subscribeStream: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDerivAPI as jest.Mock).mockReturnValue(mockDerivAPI);
  });

  it('should not subscribe if user is not logged in', () => {
    (isLogged as jest.Mock).mockReturnValue(false);

    renderHook(() => useProposalOpenContract());

    expect(mockDerivAPI.subscribeStream).not.toHaveBeenCalled();
  });

  it('should subscribe to open contracts if user is logged in', () => {
    (isLogged as jest.Mock).mockReturnValue(true);

    renderHook(() => useProposalOpenContract());

    expect(mockDerivAPI.subscribeStream).toHaveBeenCalledWith(
      {
        proposal_open_contract: 1,
        subscribe: 1,
      },
      expect.any(Function),
      'OPENCONTRACTS'
    );
  });

  it('should handle successful contract updates', () => {
    (isLogged as jest.Mock).mockReturnValue(true);
    const mockContract = { id: '123', type: 'CALL' };
    let subscriptionCallback: Function | undefined;

    mockDerivAPI.subscribeStream.mockImplementation((_config, callback) => {
      subscriptionCallback = callback;
    });

    renderHook(() => useProposalOpenContract());

    // Ensure callback was set
    expect(subscriptionCallback).toBeDefined();
    // Simulate receiving contract update
    subscriptionCallback!({ proposal_open_contract: mockContract });

    expect(tradingPanelStore.addOpenContract).toHaveBeenCalledWith(mockContract);
  });

  it('should handle error in contract updates', () => {
    (isLogged as jest.Mock).mockReturnValue(true);
    const mockError = { error: { message: 'Subscription error' } };
    let subscriptionCallback: Function | undefined;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockDerivAPI.subscribeStream.mockImplementation((_config, callback) => {
      subscriptionCallback = callback;
    });

    renderHook(() => useProposalOpenContract());

    // Ensure callback was set
    expect(subscriptionCallback).toBeDefined();
    // Simulate receiving error
    subscriptionCallback!(mockError);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Proposal open contract error:',
      mockError.error
    );
    expect(tradingPanelStore.addOpenContract).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle subscription error', async () => {
    (isLogged as jest.Mock).mockReturnValue(true);
    const error = new Error('Subscription failed');
    mockDerivAPI.subscribeStream.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    renderHook(() => useProposalOpenContract());

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Proposal open contract subscription error:',
      error
    );

    consoleSpy.mockRestore();
  });

  it('should subscribe only once on mount', () => {
    (isLogged as jest.Mock).mockReturnValue(true);

    const { rerender } = renderHook(() => useProposalOpenContract());

    // Rerender the hook
    rerender();

    // Should still only be called once
    expect(mockDerivAPI.subscribeStream).toHaveBeenCalledTimes(1);
  });
});
