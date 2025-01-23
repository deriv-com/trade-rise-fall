import { renderHook, act } from '@testing-library/react';
import useDebounce from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 300));
    expect(result.current).toBe('test');
  });

  it('should debounce value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 300 });

    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now the value should be updated
    expect(result.current).toBe('updated');
  });

  it('should use default delay if not provided', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: 'initial' },
      }
    );

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(300); // Default delay is 300ms
    });

    expect(result.current).toBe('updated');
  });

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 300));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('should handle multiple rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'initial' },
      }
    );

    // Multiple rapid updates
    rerender({ value: 'update1' });
    rerender({ value: 'update2' });
    rerender({ value: 'update3' });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Advance remaining time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Should have the last update only
    expect(result.current).toBe('update3');
  });

  it('should handle different types of values', () => {
    const { result: numberResult } = renderHook(() => useDebounce(42, 300));
    const { result: booleanResult } = renderHook(() => useDebounce(true, 300));
    const { result: objectResult } = renderHook(() => 
      useDebounce({ key: 'value' }, 300)
    );

    expect(numberResult.current).toBe(42);
    expect(booleanResult.current).toBe(true);
    expect(objectResult.current).toEqual({ key: 'value' });
  });
});
