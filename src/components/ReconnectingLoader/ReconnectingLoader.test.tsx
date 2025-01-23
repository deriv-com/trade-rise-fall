import { render, screen } from '@testing-library/react';
import { ReconnectingLoader } from './ReconnectingLoader';

describe('ReconnectingLoader', () => {
  it('renders the loader with correct elements', () => {
    render(<ReconnectingLoader />);
    
    // Check for main container
    const loaderContainer = screen.getByTestId('reconnecting-loader');
    expect(loaderContainer).toBeInTheDocument();
    expect(loaderContainer).toHaveClass('reconnecting-loader');

    // Check for spinner
    const spinner = screen.getByTestId('reconnecting-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('reconnecting-loader__spinner');

    // Check for text
    expect(screen.getByText('Reconnecting')).toBeInTheDocument();

    // Check for dots
    const dots = screen.getByTestId('reconnecting-dots');
    expect(dots).toBeInTheDocument();
    expect(dots).toHaveClass('reconnecting-loader__dots');
    
    // Verify all three dots are present
    const dotElements = dots.getElementsByTagName('span');
    expect(dotElements).toHaveLength(3);
    Array.from(dotElements).forEach(dot => {
      expect(dot.textContent).toBe('.');
    });
  });
});
