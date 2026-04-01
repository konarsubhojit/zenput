import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('renders without errors', () => {
    render(<NumberInput />);
  });

  it('renders with label', () => {
    render(<NumberInput label="Quantity" />);
    expect(screen.getByText('Quantity')).toBeInTheDocument();
  });

  it('renders increment and decrement buttons', () => {
    render(<NumberInput />);
    expect(screen.getByLabelText('Increment')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrement')).toBeInTheDocument();
  });

  it('hides controls when hideControls is true', () => {
    render(<NumberInput hideControls />);
    expect(screen.queryByLabelText('Increment')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Decrement')).not.toBeInTheDocument();
  });

  it('increments value when increment button is clicked', async () => {
    render(<NumberInput defaultValue={5} step={1} />);
    await userEvent.click(screen.getByLabelText('Increment'));
    expect(screen.getByRole('spinbutton')).toHaveValue(6);
  });

  it('decrements value when decrement button is clicked', async () => {
    render(<NumberInput defaultValue={5} step={1} />);
    await userEvent.click(screen.getByLabelText('Decrement'));
    expect(screen.getByRole('spinbutton')).toHaveValue(4);
  });

  it('respects min value', async () => {
    render(<NumberInput defaultValue={1} min={1} step={1} />);
    expect(screen.getByLabelText('Decrement')).toBeDisabled();
  });

  it('respects max value', async () => {
    render(<NumberInput defaultValue={10} max={10} step={1} />);
    expect(screen.getByLabelText('Increment')).toBeDisabled();
  });

  it('is disabled when disabled prop is set', () => {
    render(<NumberInput disabled />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('calls onChange with numeric value', async () => {
    const handleChange = jest.fn();
    render(<NumberInput onChange={handleChange} />);
    await userEvent.type(screen.getByRole('spinbutton'), '42');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error message', () => {
    render(<NumberInput validationState="error" errorMessage="Invalid number" />);
    expect(screen.getByText('Invalid number')).toBeInTheDocument();
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<NumberInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
