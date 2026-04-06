import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MoneyInput } from './MoneyInput';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
];

const meta: Meta<typeof MoneyInput> = {
  title: 'Components/MoneyInput',
  component: MoneyInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
  args: {
    currencies: CURRENCIES,
  },
};

export default meta;
type Story = StoryObj<typeof MoneyInput>;

export const Default: Story = {
  args: {
    label: 'Price',
    placeholder: '0.00',
  },
};

export const WithDefaultValues: Story = {
  args: {
    label: 'Price',
    defaultCurrency: 'EUR',
    defaultValue: 99.99,
  },
};

export const Controlled: Story = {
  render: () => {
    const ControlledExample = () => {
      const [currency, setCurrency] = useState('USD');
      const [amount, setAmount] = useState<number | undefined>(49.99);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MoneyInput
            currencies={CURRENCIES}
            label="Product price"
            currency={currency}
            onCurrencyChange={setCurrency}
            value={amount}
            onChange={setAmount}
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Value: {currency} {amount ?? '—'}
          </p>
        </div>
      );
    };
    return <ControlledExample />;
  },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <MoneyInput currencies={CURRENCIES} label="Default" helperText="Enter a price" />
      <MoneyInput currencies={CURRENCIES} label="Error" validationState="error" errorMessage="Price must be greater than 0" />
      <MoneyInput currencies={CURRENCIES} label="Success" validationState="success" successMessage="Price is valid" defaultValue={10} />
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    label: 'Price',
    fullWidth: true,
    placeholder: '0.00',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <MoneyInput currencies={CURRENCIES} label="Small" size="sm" placeholder="0.00" />
      <MoneyInput currencies={CURRENCIES} label="Medium" size="md" placeholder="0.00" />
      <MoneyInput currencies={CURRENCIES} label="Large" size="lg" placeholder="0.00" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Price',
    disabled: true,
    defaultValue: 29.99,
    defaultCurrency: 'USD',
  },
};
