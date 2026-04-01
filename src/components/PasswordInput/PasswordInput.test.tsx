import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('renders without errors', () => {
    render(<PasswordInput />);
  });

  it('renders with label', () => {
    render(<PasswordInput label="Password" />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('defaults to password type (hidden)', () => {
    render(<PasswordInput />);
    expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
  });

  it('has a toggle visibility button', () => {
    render(<PasswordInput />);
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
  });

  it('toggles password visibility when button is clicked', async () => {
    render(<PasswordInput />);
    const input = document.querySelector('input[type="password"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Show password'));
    expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
  });

  it('toggle button label changes after click', async () => {
    render(<PasswordInput />);
    await userEvent.click(screen.getByLabelText('Show password'));
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is set', () => {
    render(<PasswordInput disabled />);
    expect(document.querySelector('input')).toBeDisabled();
    expect(screen.getByLabelText('Show password')).toBeDisabled();
  });

  it('renders strength indicator when showStrengthIndicator is true', async () => {
    render(<PasswordInput showStrengthIndicator defaultValue="Abc123!@" />);
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<PasswordInput validationState="error" errorMessage="Password too short" />);
    expect(screen.getByText('Password too short')).toBeInTheDocument();
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
