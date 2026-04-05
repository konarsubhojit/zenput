import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateInput } from './DateInput';

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  args: { label: 'Date of Birth' },
};

export const WithRange: Story = {
  args: { label: 'Appointment Date', min: '2024-01-01', max: '2025-12-31', helperText: 'Between Jan 2024 and Dec 2025' },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DateInput label="Default" validationState="default" helperText="Select a date" />
      <DateInput label="Error" validationState="error" errorMessage="Please select a valid date" />
      <DateInput label="Success" validationState="success" successMessage="Date selected!" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled Date', disabled: true },
};

export const Required: Story = {
  args: { label: 'Required Date', required: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DateInput label="Small" size="sm" />
      <DateInput label="Medium" size="md" />
      <DateInput label="Large" size="lg" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DateInput label="Outlined" variant="outlined" />
      <DateInput label="Filled" variant="filled" />
      <DateInput label="Underlined" variant="underlined" />
    </div>
  ),
};
