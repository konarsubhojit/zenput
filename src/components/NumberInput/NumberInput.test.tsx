import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { NumberInput } from './NumberInput';
import { expectNoA11yViolations } from '../../test-utils/axe';

describe('NumberInput', () => {
  it('renders without errors', () => {
    const { container } = render(<NumberInput />);
    expect(container.firstChild).toBeInTheDocument();
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
    const handleChange = vi.fn();
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

  it('displays formatted value when formatValue is provided and not focused', () => {
    render(
      <NumberInput
        value={1234.5}
        formatValue={(v) => `$${v.toFixed(2)}`}
        onChange={() => undefined}
      />
    );
    expect(screen.getByDisplayValue('$1234.50')).toBeInTheDocument();
  });

  it('clears value when input is emptied', async () => {
    render(<NumberInput defaultValue={5} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    expect(input).toHaveValue(null);
  });

  it('calls onBlur when input loses focus', async () => {
    const handleBlur = vi.fn();
    render(<NumberInput onBlur={handleBlur} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.click(input);
    await userEvent.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('calls onFocus when input is focused', async () => {
    const handleFocus = vi.fn();
    render(<NumberInput onFocus={handleFocus} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.click(input);
    expect(handleFocus).toHaveBeenCalled();
  });

  it('renders success message', () => {
    render(<NumberInput validationState="success" successMessage="Valid number!" />);
    expect(screen.getByText('Valid number!')).toBeInTheDocument();
  });

  it('renders warning message', () => {
    render(<NumberInput validationState="warning" warningMessage="Value may be high" />);
    expect(screen.getByText('Value may be high')).toBeInTheDocument();
  });

  it('renders with fullWidth and required label', () => {
    render(<NumberInput label="Amount" fullWidth required />);
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });
});

describe('NumberInput allowEmpty={false}', () => {
  it('snaps to 0 when input is cleared and no min/fallbackValue', async () => {
    const handleChange = vi.fn();
    render(<NumberInput allowEmpty={false} defaultValue={5} onChange={handleChange} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    expect(handleChange).toHaveBeenLastCalledWith(0);
    expect(input).toHaveValue(0);
  });

  it('snaps to min when input is cleared and min is provided', async () => {
    const handleChange = vi.fn();
    render(<NumberInput allowEmpty={false} defaultValue={5} min={2} onChange={handleChange} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    expect(handleChange).toHaveBeenLastCalledWith(2);
    expect(input).toHaveValue(2);
  });

  it('snaps to fallbackValue (clamped to min/max) when input is cleared', async () => {
    const handleChange = vi.fn();
    render(
      <NumberInput
        allowEmpty={false}
        defaultValue={5}
        min={1}
        max={10}
        fallbackValue={3}
        onChange={handleChange}
      />
    );
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    expect(handleChange).toHaveBeenLastCalledWith(3);
    expect(input).toHaveValue(3);
  });

  it('clamps fallbackValue to min', async () => {
    const handleChange = vi.fn();
    render(
      <NumberInput
        allowEmpty={false}
        defaultValue={5}
        min={4}
        fallbackValue={1}
        onChange={handleChange}
      />
    );
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    // fallbackValue=1 is below min=4, so snaps to min=4
    expect(handleChange).toHaveBeenLastCalledWith(4);
    expect(input).toHaveValue(4);
  });

  it('clamps fallbackValue to max', async () => {
    const handleChange = vi.fn();
    render(
      <NumberInput
        allowEmpty={false}
        defaultValue={5}
        max={8}
        fallbackValue={20}
        onChange={handleChange}
      />
    );
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    // fallbackValue=20 is above max=8, so snaps to max=8
    expect(handleChange).toHaveBeenLastCalledWith(8);
    expect(input).toHaveValue(8);
  });

  it('never calls onChange with undefined', async () => {
    const handleChange = vi.fn();
    render(<NumberInput allowEmpty={false} onChange={handleChange} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.type(input, '42');
    await userEvent.clear(input);
    const allArgs = handleChange.mock.calls.map(([v]) => v);
    expect(allArgs.every((v) => typeof v === 'number')).toBe(true);
  });

  it('still emits typed numeric values normally', async () => {
    const handleChange = vi.fn();
    render(<NumberInput allowEmpty={false} onChange={handleChange} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.type(input, '7');
    expect(handleChange).toHaveBeenLastCalledWith(7);
  });
});

describe('a11y (axe)', () => {
  it('has no detectable axe violations in default render', async () => {
    const { container } = render(<NumberInput label="Quantity" />);
    await expectNoA11yViolations(container);
  });
});
