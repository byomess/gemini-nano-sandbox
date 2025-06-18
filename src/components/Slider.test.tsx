import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';
import { describe, it, expect, vi } from 'vitest';

// Placeholder for icon testing
const MockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 2 L12 22" /> <path d="M2 12 L22 12" />
  </svg>
);

describe('Slider', () => {
  const defaultProps = {
    id: 'test-slider',
    label: 'Temperature',
    value: 25,
    min: 0,
    max: 100,
    step: 1,
    onChange: vi.fn(),
  };

  it('renders with initial value, label, and min/max text', () => {
    render(<Slider {...defaultProps} />);

    // Check label
    expect(screen.getByLabelText(/Temperature/i)).toBeInTheDocument();

    // Check slider input role and initial value
    const sliderInput = screen.getByRole('slider');
    expect(sliderInput).toBeInTheDocument();
    expect(sliderInput).toHaveValue(defaultProps.value.toString());

    // Check displayed value (badge)
    expect(screen.getByText(defaultProps.value.toString())).toBeInTheDocument();

    // Check min and max display text
    expect(screen.getByText(defaultProps.min.toString())).toBeInTheDocument();
    expect(screen.getByText(defaultProps.max.toString())).toBeInTheDocument();
  });

  it('applies min, max, and step attributes to the input', () => {
    render(<Slider {...defaultProps} min={10} max={50} step={5} />);
    const sliderInput = screen.getByRole('slider');
    expect(sliderInput).toHaveAttribute('min', '10');
    expect(sliderInput).toHaveAttribute('max', '50');
    expect(sliderInput).toHaveAttribute('step', '5');
  });

  it('calls onChange handler with the correct number value when changed', () => {
    const handleChange = vi.fn();
    render(<Slider {...defaultProps} onChange={handleChange} />);
    const sliderInput = screen.getByRole('slider');

    fireEvent.change(sliderInput, { target: { value: '75' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(75);
  });

  it('calls onChange with float value if step is float', () => {
    const handleChange = vi.fn();
    render(<Slider {...defaultProps} step={0.1} value={0.5} onChange={handleChange} />);
    const sliderInput = screen.getByRole('slider');

    fireEvent.change(sliderInput, { target: { value: '0.8' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(0.8);
  });

  it('updates displayed value when value prop changes (controlled component behavior)', () => {
    const { rerender } = render(<Slider {...defaultProps} value={30} />);
    expect(screen.getByRole('slider')).toHaveValue('30');
    expect(screen.getByText('30')).toBeInTheDocument(); // Badge display

    rerender(<Slider {...defaultProps} value={60} />);
    expect(screen.getByRole('slider')).toHaveValue('60');
    expect(screen.getByText('60')).toBeInTheDocument(); // Badge display
  });

  it('is disabled when disabled prop is true', () => {
    render(<Slider {...defaultProps} disabled={true} />);
    const sliderInput = screen.getByRole('slider');
    expect(sliderInput).toBeDisabled();
  });

  it('renders with an icon if provided', () => {
    render(<Slider {...defaultProps} icon={<MockIcon data-testid="slider-icon" />} />);
    expect(screen.getByTestId('slider-icon')).toBeInTheDocument();
  });

  it('renders description if provided', () => {
    render(<Slider {...defaultProps} description="This is a test description." />);
    expect(screen.getByText(/This is a test description./i)).toBeInTheDocument();
  });

  it('formats displayed value using formatValue prop if provided', () => {
    const formatValue = (val: number) => `${val}°C`;
    render(<Slider {...defaultProps} value={22} formatValue={formatValue} />);
    expect(screen.getByText(formatValue(22))).toBeInTheDocument();
    // Also check min/max are formatted
    expect(screen.getByText(formatValue(defaultProps.min))).toBeInTheDocument();
    expect(screen.getByText(formatValue(defaultProps.max))).toBeInTheDocument();
  });

  it('assigns the id to the input element for label association', () => {
    render(<Slider {...defaultProps} id="custom-slider-id" />);
    const sliderInput = screen.getByRole('slider');
    expect(sliderInput).toHaveAttribute('id', 'custom-slider-id');
    // Check label's htmlFor
    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute('id', 'custom-slider-id');
  });
});
