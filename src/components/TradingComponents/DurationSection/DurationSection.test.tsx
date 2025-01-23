import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DurationSection } from './DurationSection';
import { DurationTabValue } from '../types';

describe('DurationSection', () => {
  const defaultProps = {
    duration: 15,
    selectedDurationTab: 'duration' as DurationTabValue,
    durationError: '',
    setDuration: jest.fn(),
    setSelectedDurationTab: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders duration tab content by default', () => {
    render(<DurationSection {...defaultProps} />);

    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Range: 15 - 1,440 minutes')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('0.00');
    expect(input).toHaveValue('15');
  });

  it('switches to endtime view when endtime tab is selected', () => {
    render(
      <DurationSection
        {...defaultProps}
        selectedDurationTab="endtime"
      />
    );

    const dateInput = screen.getByDisplayValue('03 Jan 2025');
    const timeInput = screen.getByDisplayValue('03:20 GMT');

    expect(dateInput).toHaveValue('03 Jan 2025');
    expect(timeInput).toHaveValue('03:20 GMT');
  });

  it('calls setSelectedDurationTab when switching tabs', async () => {
    render(<DurationSection {...defaultProps} />);
    
    await userEvent.click(screen.getByRole('button', { name: /end time/i }));
    expect(defaultProps.setSelectedDurationTab).toHaveBeenCalledWith('endtime');
  });

  it('updates duration when value changes', async () => {
    render(<DurationSection {...defaultProps} />);

    const input = screen.getByPlaceholderText('0.00');
    await userEvent.clear(input);
    await userEvent.type(input, '20');
    
    expect(defaultProps.setDuration).toHaveBeenCalledWith('20');
  });

  it('displays duration error when provided', () => {
    const errorMessage = 'Duration must be between 15 and 1,440 minutes';
    render(
      <DurationSection
        {...defaultProps}
        durationError={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows readonly fields in endtime view', () => {
    render(
      <DurationSection
        {...defaultProps}
        selectedDurationTab="endtime"
      />
    );

    const dateInput = screen.getByDisplayValue('03 Jan 2025');
    const timeInput = screen.getByDisplayValue('03:20 GMT');

    expect(dateInput).toHaveAttribute('readonly');
    expect(timeInput).toHaveAttribute('readonly');
  });

  it('handles stepper buttons correctly', async () => {
    render(<DurationSection {...defaultProps} />);

    // Find buttons by their container class
    const buttons = screen.getAllByRole('button');
    const [decrementButton, incrementButton] = buttons.filter(button => 
      button.closest('.icon_wrapper')
    );

    await userEvent.click(incrementButton);
    expect(defaultProps.setDuration).toHaveBeenCalledWith(16);

    await userEvent.click(decrementButton);
    expect(defaultProps.setDuration).toHaveBeenCalledWith(14);
  });
});
