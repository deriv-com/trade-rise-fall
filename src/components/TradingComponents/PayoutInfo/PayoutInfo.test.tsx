import { render, screen } from '@testing-library/react';
import { PayoutInfo } from './PayoutInfo';

describe('PayoutInfo', () => {
  const defaultProps = {
    type: 'rise' as const,
    label: 'Payout',
    amount: '100.00',
    isLoading: false,
  };

  it('renders payout information when not loading', () => {
    render(<PayoutInfo {...defaultProps} />);

    expect(screen.getByText('Payout')).toBeInTheDocument();
    expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('shows nothing when loading', () => {
    render(<PayoutInfo {...defaultProps} isLoading={true} />);

    expect(screen.queryByText('Payout')).not.toBeInTheDocument();
    expect(screen.queryByText('100.00 USD')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('displays tooltip icon', () => {
    render(<PayoutInfo {...defaultProps} />);

    // Find the info icon SVG by its path content
    const tooltipIcon = screen.getByRole('img', {
      name: ''
    });
    expect(tooltipIcon).toBeInTheDocument();
    expect(tooltipIcon.getAttribute('viewBox')).toBe('0 0 14 22');
  });

  it('works with fall type', () => {
    render(<PayoutInfo {...defaultProps} type="fall" label="Fall Payout" />);

    expect(screen.getByText('Fall Payout')).toBeInTheDocument();
    expect(screen.getByText('100.00 USD')).toBeInTheDocument();
  });

  it('applies correct type-based class', () => {
    const { rerender } = render(<PayoutInfo {...defaultProps} />);
    const container = screen.getByTestId('payout-info');
    expect(container).toHaveClass('payout-info-row--rise');

    rerender(<PayoutInfo {...defaultProps} type="fall" />);
    const fallContainer = screen.getByTestId('payout-info');
    expect(fallContainer).toHaveClass('payout-info-row--fall');
  });

  it('applies correct text classes', () => {
    render(<PayoutInfo {...defaultProps} />);

    const label = screen.getByText('Payout');
    const amount = screen.getByText('100.00 USD');

    expect(label).toHaveClass('text-bold');
    expect(amount).toHaveClass('text-bold');
  });
});
