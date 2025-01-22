import { render } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

// Mock the Spinner component from @deriv-com/quill-ui
jest.mock('@deriv-com/quill-ui', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    });
  });
});
