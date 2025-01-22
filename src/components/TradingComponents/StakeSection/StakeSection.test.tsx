import { render } from '@testing-library/react';
import { StakeSection } from './StakeSection';
import { StakeTabValue } from '../types';

describe('StakeSection', () => {
  it('renders without crashing', () => {
    const props = {
      price: '100',
      selectedStakeTab: 'stake' as StakeTabValue,
      priceError: '',
      setPrice: jest.fn(),
      setSelectedStakeTab: jest.fn(),
    };

    const { container } = render(<StakeSection {...props} />);
    expect(container).toBeInTheDocument();
  });
});
