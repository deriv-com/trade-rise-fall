import { renderHook } from '@testing-library/react';
import { useRiseFallTrading } from '../useRiseFallTrading';
import { useContractsFor } from '../useContractsFor';
import { usePriceProposal } from '../usePriceProposal';
import { useProposalOpenContract } from '../useProposalOpenContract';
import { useBuyContract } from '../useBuyContract';

// Mock all dependent hooks
jest.mock('../useContractsFor');
jest.mock('../usePriceProposal');
jest.mock('../useProposalOpenContract');
jest.mock('../useBuyContract');

describe('useRiseFallTrading', () => {
  const mockProps = {
    symbol: 'EURUSD',
    price: '100',
    duration: 5,
    basis: 'stake',
    durationError: null,
    priceError: null,
    isRiseFallValid: true,
  };

  const mockProposal = {
    rise: { id: 'rise-123', ask_price: 100 },
    fall: { id: 'fall-456', ask_price: 100 },
  };

  const mockIsLoading = {
    rise: false,
    fall: false,
  };

  const mockBuyContract = jest.fn();
  const mockClearProposal = jest.fn();
  const mockHandleProposal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the return values of each hook
    (useContractsFor as jest.Mock).mockImplementation(() => undefined);
    (useProposalOpenContract as jest.Mock).mockImplementation(() => undefined);
    (usePriceProposal as jest.Mock).mockImplementation(() => ({
      proposal: mockProposal,
      clearProposal: mockClearProposal,
      isLoading: mockIsLoading,
      handleProposal: mockHandleProposal,
    }));
    (useBuyContract as jest.Mock).mockImplementation(() => ({
      buyContract: mockBuyContract,
    }));
  });

  it('should call all required hooks with correct parameters', () => {
    renderHook(() => useRiseFallTrading(
      mockProps.symbol,
      mockProps.price,
      mockProps.duration,
      mockProps.basis,
      mockProps.durationError,
      mockProps.priceError,
      mockProps.isRiseFallValid
    ));

    // Verify useContractsFor was called with correct params
    expect(useContractsFor).toHaveBeenCalledWith(mockProps.symbol);

    // Verify useProposalOpenContract was called
    expect(useProposalOpenContract).toHaveBeenCalled();

    // Verify usePriceProposal was called with correct params
    expect(usePriceProposal).toHaveBeenCalledWith(
      mockProps.price,
      mockProps.duration,
      mockProps.basis,
      mockProps.symbol,
      mockProps.durationError,
      mockProps.priceError,
      mockProps.isRiseFallValid
    );

    // Verify useBuyContract was called with correct params
    expect(useBuyContract).toHaveBeenCalledWith(mockProps.price, expect.any(Function));
  });

  it('should return the combined hook values', () => {
    const { result } = renderHook(() => useRiseFallTrading(
      mockProps.symbol,
      mockProps.price,
      mockProps.duration,
      mockProps.basis,
      mockProps.durationError,
      mockProps.priceError,
      mockProps.isRiseFallValid
    ));

    expect(result.current).toEqual({
      proposal: mockProposal,
      clearProposal: mockClearProposal,
      isLoading: mockIsLoading,
      buyContract: mockBuyContract,
    });
  });

  it('should handle parameter changes', () => {
    const { rerender } = renderHook(
      (props) => useRiseFallTrading(
        props.symbol,
        props.price,
        props.duration,
        props.basis,
        props.durationError,
        props.priceError,
        props.isRiseFallValid
      ),
      { initialProps: mockProps }
    );

    // Reset mock call counts
    jest.clearAllMocks();

    // Change some parameters
    const newProps = {
      ...mockProps,
      symbol: 'GBPUSD',
      price: '200',
    };

    rerender(newProps);

    // Verify hooks were called with updated params
    expect(useContractsFor).toHaveBeenCalledWith(newProps.symbol);
    expect(usePriceProposal).toHaveBeenCalledWith(
      newProps.price,
      newProps.duration,
      newProps.basis,
      newProps.symbol,
      newProps.durationError,
      newProps.priceError,
      newProps.isRiseFallValid
    );
  });

  it('should handle errors in parameters', () => {
    const propsWithErrors = {
      ...mockProps,
      durationError: 'Invalid duration',
      priceError: 'Invalid price',
    };

    renderHook(() => useRiseFallTrading(
      propsWithErrors.symbol,
      propsWithErrors.price,
      propsWithErrors.duration,
      propsWithErrors.basis,
      propsWithErrors.durationError,
      propsWithErrors.priceError,
      propsWithErrors.isRiseFallValid
    ));

    expect(usePriceProposal).toHaveBeenCalledWith(
      propsWithErrors.price,
      propsWithErrors.duration,
      propsWithErrors.basis,
      propsWithErrors.symbol,
      propsWithErrors.durationError,
      propsWithErrors.priceError,
      propsWithErrors.isRiseFallValid
    );
  });

  it('should handle invalid rise fall state', () => {
    const propsWithInvalidRiseFall = {
      ...mockProps,
      isRiseFallValid: false,
    };

    renderHook(() => useRiseFallTrading(
      propsWithInvalidRiseFall.symbol,
      propsWithInvalidRiseFall.price,
      propsWithInvalidRiseFall.duration,
      propsWithInvalidRiseFall.basis,
      propsWithInvalidRiseFall.durationError,
      propsWithInvalidRiseFall.priceError,
      propsWithInvalidRiseFall.isRiseFallValid
    ));

    expect(usePriceProposal).toHaveBeenCalledWith(
      propsWithInvalidRiseFall.price,
      propsWithInvalidRiseFall.duration,
      propsWithInvalidRiseFall.basis,
      propsWithInvalidRiseFall.symbol,
      propsWithInvalidRiseFall.durationError,
      propsWithInvalidRiseFall.priceError,
      propsWithInvalidRiseFall.isRiseFallValid
    );
  });
});
