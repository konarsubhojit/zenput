import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders without errors', () => {
    render(<Checkbox />);
  });

  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Checkbox label="Option" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('is checked when defaultChecked is true', () => {
    render(<Checkbox label="Option" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Checkbox label="Option" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = jest.fn();
    render(<Checkbox label="Option" onChange={handleChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message when validationState is error', () => {
    render(<Checkbox validationState="error" errorMessage="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<Checkbox helperText="Check this to continue" />);
    expect(screen.getByText('Check this to continue')).toBeInTheDocument();
  });

  it('sets indeterminate state', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} indeterminate />);
    expect(ref.current?.indeterminate).toBe(true);
  });

  it('forwards ref to checkbox element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
