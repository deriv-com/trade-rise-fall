import { BalanceStore } from '../BalanceStore';

describe('BalanceStore', () => {
  let store: BalanceStore;

  beforeEach(() => {
    store = new BalanceStore();
  });

  describe('initialization', () => {
    it('should initialize with empty values', () => {
      expect(store.balance).toBe('');
      expect(store.currency).toBe('');
    });
  });

  describe('setBalance', () => {
    it('should set balance and currency', () => {
      store.setBalance('1000.00', 'USD');
      
      expect(store.balance).toBe('1000.00');
      expect(store.currency).toBe('USD');
    });

    it('should update existing values', () => {
      // Set initial values
      store.setBalance('1000.00', 'USD');
      expect(store.balance).toBe('1000.00');
      expect(store.currency).toBe('USD');

      // Update values
      store.setBalance('2000.00', 'EUR');
      expect(store.balance).toBe('2000.00');
      expect(store.currency).toBe('EUR');
    });

    it('should handle zero balance', () => {
      store.setBalance('0.00', 'USD');
      
      expect(store.balance).toBe('0.00');
      expect(store.currency).toBe('USD');
    });

    it('should handle different currency formats', () => {
      // Test with different currency formats
      store.setBalance('1000.50', 'EUR');
      expect(store.balance).toBe('1000.50');
      expect(store.currency).toBe('EUR');

      store.setBalance('1,000.50', 'GBP');
      expect(store.balance).toBe('1,000.50');
      expect(store.currency).toBe('GBP');

      store.setBalance('1000', 'JPY');
      expect(store.balance).toBe('1000');
      expect(store.currency).toBe('JPY');
    });

    it('should handle empty values', () => {
      // Set some initial values
      store.setBalance('1000.00', 'USD');
      
      // Update with empty values
      store.setBalance('', '');
      
      expect(store.balance).toBe('');
      expect(store.currency).toBe('');
    });
  });

  describe('observable behavior', () => {
    it('should be observable', () => {
      const mockCallback = jest.fn();
      
      // Create a reaction to monitor changes
      const dispose = require('mobx').reaction(
        () => ({
          balance: store.balance,
          currency: store.currency
        }),
        (value: { balance: string; currency: string }) => mockCallback(value)
      );

      // Make changes
      store.setBalance('1000.00', 'USD');
      
      // Verify reaction was triggered
      expect(mockCallback).toHaveBeenCalledWith({
        balance: '1000.00',
        currency: 'USD'
      });

      // Cleanup
      dispose();
    });

    it('should trigger reaction only when values change', () => {
      const mockCallback = jest.fn();
      
      const dispose = require('mobx').reaction(
        () => ({
          balance: store.balance,
          currency: store.currency
        }),
        mockCallback
      );

      // Set same values multiple times
      store.setBalance('1000.00', 'USD');
      store.setBalance('1000.00', 'USD');
      store.setBalance('1000.00', 'USD');
      
      // Should only trigger once despite multiple same-value updates
      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Change to different value
      store.setBalance('2000.00', 'USD');
      
      // Should trigger again for new value
      expect(mockCallback).toHaveBeenCalledTimes(2);

      // Cleanup
      dispose();
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in balance', () => {
      store.setBalance('1,234,567.89', 'USD');
      expect(store.balance).toBe('1,234,567.89');
    });

    it('should handle different number formats', () => {
      store.setBalance('1.000,00', 'EUR'); // European format
      expect(store.balance).toBe('1.000,00');
    });

    it('should handle whitespace in values', () => {
      store.setBalance('  1000.00  ', '  USD  ');
      expect(store.balance).toBe('  1000.00  ');
      expect(store.currency).toBe('  USD  ');
    });
  });
});
