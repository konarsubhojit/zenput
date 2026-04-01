import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { OTPInput } from './OTPInput';

describe('OTPInput', () => {
  it('renders without errors', () => {
    render(<OTPInput />);
  });

  it('renders with label', () => {
    render(<OTPInput label="Verification code" />);
    expect(screen.getByText('Verification code')).toBeInTheDocument();
  });

  it('renders the correct number of digit inputs', () => {
    render(<OTPInput length={4} />);
    const inputs = document.querySelectorAll('input');
    expect(inputs).toHaveLength(4);
  });

  it('defaults to 6 digit inputs', () => {
    render(<OTPInput />);
    const inputs = document.querySelectorAll('input');
    expect(inputs).toHaveLength(6);
  });

  it('fills in a digit when typed', async () => {
    render(<OTPInput />);
    const inputs = document.querySelectorAll('input');
    await userEvent.type(inputs[0], '3');
    expect(inputs[0]).toHaveValue('3');
  });

  it('moves focus to next input after typing', async () => {
    render(<OTPInput length={4} />);
    const inputs = document.querySelectorAll('input');
    await userEvent.type(inputs[0], '1');
    expect(inputs[1]).toHaveFocus();
  });

  it('calls onChange when a digit is entered', async () => {
    const handleChange = jest.fn();
    render(<OTPInput length={4} onChange={handleChange} />);
    const inputs = document.querySelectorAll('input');
    await userEvent.type(inputs[0], '5');
    expect(handleChange).toHaveBeenCalledWith('5');
  });

  it('calls onComplete when all digits are filled', async () => {
    const handleComplete = jest.fn();
    render(<OTPInput length={4} onComplete={handleComplete} />);
    const inputs = document.querySelectorAll('input');
    await userEvent.type(inputs[0], '1');
    await userEvent.type(inputs[1], '2');
    await userEvent.type(inputs[2], '3');
    await userEvent.type(inputs[3], '4');
    expect(handleComplete).toHaveBeenCalledWith('1234');
  });

  it('is disabled when disabled prop is set', () => {
    render(<OTPInput disabled />);
    document.querySelectorAll('input').forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('renders error message', () => {
    render(<OTPInput validationState="error" errorMessage="Invalid code" />);
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  it('forwards ref to wrapper div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<OTPInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
