import { ChartStore } from '../ChartStore';
import { tradingPanelStore } from '../TradingPanelStore';
import { reaction, configure } from 'mobx';

// Configure MobX
configure({ useProxies: "never" });

// Mock TradingPanelStore
jest.mock('../TradingPanelStore', () => ({
  tradingPanelStore: {
    setIsRiseFallValid: jest.fn(),
    priceError: null,
    durationError: null,
  },
}));

describe('ChartStore', () => {
  let store: ChartStore;

  beforeEach(() => {
    jest.clearAllMocks();
    store = new ChartStore();
  });

  describe('initialization', () => {
    test('should initialize with default values', () => {
      expect(store.symbol).toBe('');
      expect(store.chartStatus).toBe(false);
      expect(store.showChart).toBe(false);
    });
  });

  describe('setSymbol', () => {
    test('should set symbol and reset trading panel state', () => {
      store.setSymbol('EURUSD');

      expect(store.symbol).toBe('EURUSD');
      expect(tradingPanelStore.setIsRiseFallValid).toHaveBeenCalledWith(false);
      expect(tradingPanelStore.priceError).toBeNull();
      expect(tradingPanelStore.durationError).toBeNull();
    });

    test('should handle empty symbol', () => {
      store.setSymbol('');

      expect(store.symbol).toBe('');
      expect(tradingPanelStore.setIsRiseFallValid).toHaveBeenCalledWith(false);
    });

    test('should update symbol multiple times', () => {
      store.setSymbol('EURUSD');
      expect(store.symbol).toBe('EURUSD');

      store.setSymbol('GBPUSD');
      expect(store.symbol).toBe('GBPUSD');

      expect(tradingPanelStore.setIsRiseFallValid).toHaveBeenCalledTimes(2);
    });
  });

  describe('setChartStatus', () => {
    test('should set chart status', () => {
      store.setChartStatus(true);
      expect(store.chartStatus).toBe(true);

      store.setChartStatus(false);
      expect(store.chartStatus).toBe(false);
    });

    test('should handle multiple status changes', () => {
      store.setChartStatus(true);
      expect(store.chartStatus).toBe(true);

      store.setChartStatus(false);
      expect(store.chartStatus).toBe(false);

      store.setChartStatus(true);
      expect(store.chartStatus).toBe(true);
    });
  });

  describe('setShowChart', () => {
    test('should set show chart state', () => {
      store.setShowChart(true);
      expect(store.showChart).toBe(true);

      store.setShowChart(false);
      expect(store.showChart).toBe(false);
    });

    test('should handle multiple show/hide transitions', () => {
      store.setShowChart(true);
      expect(store.showChart).toBe(true);

      store.setShowChart(false);
      expect(store.showChart).toBe(false);

      store.setShowChart(true);
      expect(store.showChart).toBe(true);
    });
  });

  describe('observable behavior', () => {
    test('should be observable for symbol changes', async () => {
      const mockCallback = jest.fn();
      
      // Setup reaction
      const dispose = reaction(
        () => store.symbol,
        (value) => mockCallback(value)
      );

      // Change value
      store.setSymbol('GBPUSD');
      
      // Wait for reaction to process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(mockCallback).toHaveBeenCalledWith('GBPUSD');
      dispose();
    });

    test('should be observable for chart status changes', async () => {
      const mockCallback = jest.fn();
      
      // Setup reaction
      const dispose = reaction(
        () => store.chartStatus,
        (value) => mockCallback(value)
      );

      // Change value
      store.setChartStatus(true);
      
      // Wait for reaction to process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(mockCallback).toHaveBeenCalledWith(true);
      dispose();
    });

    test('should be observable for show chart changes', async () => {
      const mockCallback = jest.fn();
      
      // Setup reaction
      const dispose = reaction(
        () => store.showChart,
        (value) => mockCallback(value)
      );

      // Change value
      store.setShowChart(true);
      
      // Wait for reaction to process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(mockCallback).toHaveBeenCalledWith(true);
      dispose();
    });
  });

  describe('integration with TradingPanelStore', () => {
    test('should reset trading panel state when symbol changes', () => {
      store.setSymbol('EURUSD');

      expect(tradingPanelStore.setIsRiseFallValid).toHaveBeenCalledWith(false);
      expect(tradingPanelStore.priceError).toBeNull();
      expect(tradingPanelStore.durationError).toBeNull();
    });

    test('should maintain trading panel state independence', () => {
      // Chart status and show chart changes should not affect trading panel
      store.setChartStatus(true);
      store.setShowChart(true);

      expect(tradingPanelStore.setIsRiseFallValid).not.toHaveBeenCalled();
    });
  });

  describe('state transitions', () => {
    test('should handle complete chart workflow', () => {
      // Initial state
      expect(store.symbol).toBe('');
      expect(store.chartStatus).toBe(false);
      expect(store.showChart).toBe(false);

      // Set symbol
      store.setSymbol('EURUSD');
      expect(store.symbol).toBe('EURUSD');

      // Enable chart
      store.setChartStatus(true);
      expect(store.chartStatus).toBe(true);

      // Show chart
      store.setShowChart(true);
      expect(store.showChart).toBe(true);

      // Change symbol
      store.setSymbol('GBPUSD');
      expect(store.symbol).toBe('GBPUSD');
      expect(tradingPanelStore.setIsRiseFallValid).toHaveBeenCalledTimes(2);
    });
  });
});
