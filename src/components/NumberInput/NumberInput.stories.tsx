import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: { label: 'Quantity', placeholder: 'Enter quantity', min: 0, max: 100 },
};

export const WithStep: Story = {
  args: { label: 'Price', defaultValue: 10.00, step: 0.01, min: 0, helperText: 'Step by 0.01' },
};

export const HideControls: Story = {
  args: { label: 'No Stepper', defaultValue: 5, hideControls: true },
};

export const WithFormatValue: Story = {
  args: {
    label: 'Price (USD)',
    defaultValue: 1234.5,
    step: 0.01,
    min: 0,
    helperText: 'Click the field to edit the raw number; blur to see formatted value',
    formatValue: (v) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v),
  },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <NumberInput label="Default" validationState="default" helperText="Enter a number" />
      <NumberInput label="Error" validationState="error" errorMessage="Value out of range" />
      <NumberInput label="Success" validationState="success" successMessage="Valid number" defaultValue={42} />
      <NumberInput label="Warning" validationState="warning" warningMessage="Unusual value" defaultValue={999} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled', defaultValue: 5, disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <NumberInput label="Small" size="sm" />
      <NumberInput label="Medium" size="md" />
      <NumberInput label="Large" size="lg" />
    </div>
  ),
};
