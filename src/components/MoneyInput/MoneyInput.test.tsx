import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MoneyInput } from './MoneyInput';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
];

describe('MoneyInput', () => {
  it('renders without errors', () => {
    render(<MoneyInput currencies={CURRENCIES} />);
  });

  it('renders the currency selector with all options', () => {
    render(<MoneyInput currencies={CURRENCIES} />);
    expect(screen.getByRole('combobox', { name: 'Currency' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '$ USD - US Dollar' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '€ EUR - Euro' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '£ GBP - British Pound' })).toBeInTheDocument();
  });

  it('renders the amount input', () => {
    render(<MoneyInput currencies={CURRENCIES} />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<MoneyInput currencies={CURRENCIES} label="Price" />);
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('calls onCurrencyChange when currency is changed', async () => {
    const handleCurrencyChange = jest.fn();
    render(<MoneyInput currencies={CURRENCIES} onCurrencyChange={handleCurrencyChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Currency' }), 'EUR');
    expect(handleCurrencyChange).toHaveBeenCalledWith('EUR');
  });

  it('calls onChange when amount is typed', async () => {
    const handleChange = jest.fn();
    render(<MoneyInput currencies={CURRENCIES} onChange={handleChange} />);
    await userEvent.type(screen.getByRole('spinbutton'), '99');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders error message when validationState is error', () => {
    render(
      <MoneyInput currencies={CURRENCIES} validationState="error" errorMessage="Invalid amount" />
    );
    expect(screen.getByText('Invalid amount')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<MoneyInput currencies={CURRENCIES} helperText="Enter the product price" />);
    expect(screen.getByText('Enter the product price')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is set', () => {
    render(<MoneyInput currencies={CURRENCIES} disabled />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Currency' })).toBeDisabled();
  });

  it('disables currency selector when readOnly is true', () => {
    render(<MoneyInput currencies={CURRENCIES} readOnly defaultValue={10} />);
    expect(screen.getByRole('combobox', { name: 'Currency' })).toBeDisabled();
  });

  it('uses defaultCurrency when not controlled', () => {
    render(<MoneyInput currencies={CURRENCIES} defaultCurrency="GBP" />);
    expect(screen.getByRole('combobox', { name: 'Currency' })).toHaveValue('GBP');
  });

  it('uses controlled currency value', () => {
    render(
      <MoneyInput
        currencies={CURRENCIES}
        currency="EUR"
        onCurrencyChange={() => undefined}
      />
    );
    expect(screen.getByRole('combobox', { name: 'Currency' })).toHaveValue('EUR');
  });
});
