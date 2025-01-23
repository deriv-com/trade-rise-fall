import { render, screen, fireEvent } from '@testing-library/react';
import { Tab } from './Tab';

describe('Tab', () => {
  const mockTabs = [
    { label: 'Rise', value: 'rise' },
    { label: 'Fall', value: 'fall' },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tabs', () => {
    render(
      <Tab
        tabs={mockTabs}
        activeTab="rise"
        onChange={mockOnChange}
      />
    );

    mockTabs.forEach(tab => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it('applies active class to selected tab', () => {
    render(
      <Tab
        tabs={mockTabs}
        activeTab="fall"
        onChange={mockOnChange}
      />
    );

    const riseButton = screen.getByText('Rise').closest('button');
    const fallButton = screen.getByText('Fall').closest('button');

    expect(riseButton).not.toHaveClass('active');
    expect(fallButton).toHaveClass('active');
  });

  it('calls onChange with correct value when tab is clicked', () => {
    render(
      <Tab
        tabs={mockTabs}
        activeTab="rise"
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Fall'));
    expect(mockOnChange).toHaveBeenCalledWith('fall');

    fireEvent.click(screen.getByText('Rise'));
    expect(mockOnChange).toHaveBeenCalledWith('rise');
  });

  it('works with different string types', () => {
    const customTabs = [
      { label: 'Tab 1', value: 'tab1' as const },
      { label: 'Tab 2', value: 'tab2' as const },
    ];

    render(
      <Tab
        tabs={customTabs}
        activeTab="tab1"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Tab 1')).toHaveClass('active');
    fireEvent.click(screen.getByText('Tab 2'));
    expect(mockOnChange).toHaveBeenCalledWith('tab2');
  });

  it('renders tab container with correct class', () => {
    render(
      <Tab
        tabs={mockTabs}
        activeTab="rise"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByRole('button', { name: 'Rise' })).toHaveClass('tab-button');
    expect(screen.getByRole('button', { name: 'Fall' })).toHaveClass('tab-button');
  });
});
