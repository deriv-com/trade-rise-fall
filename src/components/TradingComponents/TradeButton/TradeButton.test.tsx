import { render, screen, fireEvent } from '@testing-library/react';
import { TradeButton } from './TradeButton';

describe('TradeButton', () => {
  const mockOnBuy = jest.fn();
  
  const renderButton = (props: Partial<Parameters<typeof TradeButton>[0]> = {}) => {
    const defaultProps = {
      type: 'rise' as const,
      percentage: '10',
      onBuy: mockOnBuy,
      ...props
    };
    return render(<TradeButton {...defaultProps} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = renderButton();
    expect(container).toBeInTheDocument();
  });

  it('displays the correct percentage', () => {
    renderButton();
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('displays "Rise" text for rise type', () => {
    renderButton();
    expect(screen.getByText('Rise')).toBeInTheDocument();
  });

  it('displays "Fall" text for fall type', () => {
    renderButton({ type: 'fall' });
    expect(screen.getByText('Fall')).toBeInTheDocument();
  });

  it('calls onBuy with correct type when clicked', () => {
    renderButton();
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnBuy).toHaveBeenCalledWith('rise');
  });

  it('applies correct class based on type', () => {
    const { container } = renderButton();
    expect(container.querySelector('.rise-button')).toBeInTheDocument();

    const { container: fallContainer } = renderButton({ type: 'fall' });
    expect(fallContainer.querySelector('.fall-button')).toBeInTheDocument();
  });
});
