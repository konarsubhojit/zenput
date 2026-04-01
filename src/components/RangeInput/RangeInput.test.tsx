import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RangeInput } from './RangeInput';

describe('RangeInput', () => {
  it('renders without errors', () => {
    render(<RangeInput />);
  });

  it('renders with label', () => {
    render(<RangeInput label="Volume" />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('renders as type="range"', () => {
    render(<RangeInput />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('shows value when showValue is true', () => {
    render(<RangeInput showValue defaultValue={42} min={0} max={100} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('uses custom formatValue function', () => {
    render(<RangeInput showValue defaultValue={50} formatValue={(v) => `${v}%`} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('respects min and max attributes', () => {
    render(<RangeInput min={10} max={90} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '90');
  });

  it('is disabled when disabled prop is set', () => {
    render(<RangeInput disabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('renders error message', () => {
    render(<RangeInput validationState="error" errorMessage="Out of range" />);
    expect(screen.getByText('Out of range')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<RangeInput helperText="Drag to adjust" />);
    expect(screen.getByText('Drag to adjust')).toBeInTheDocument();
  });

  it('calls onChange when value changes', async () => {
    const handleChange = jest.fn();
    render(<RangeInput onChange={handleChange} />);
    const slider = screen.getByRole('slider');
    await userEvent.type(slider, '{arrowright}');
    expect(handleChange).toHaveBeenCalled();
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<RangeInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
