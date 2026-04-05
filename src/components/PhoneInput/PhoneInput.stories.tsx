import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from './PhoneInput';

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
  args: { label: 'Phone Number', placeholder: '(555) 000-0000' },
};

export const WithDefaultDialCode: Story = {
  args: { label: 'Phone Number', placeholder: '(555) 000-0000', defaultDialCode: '+44' },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PhoneInput label="Default" placeholder="(555) 000-0000" validationState="default" helperText="International format" />
      <PhoneInput label="Error" placeholder="(555) 000-0000" validationState="error" errorMessage="Invalid phone number" />
      <PhoneInput label="Success" placeholder="(555) 000-0000" validationState="success" successMessage="Valid number!" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Phone Number', placeholder: '(555) 000-0000', disabled: true },
};

export const Required: Story = {
  args: { label: 'Phone Number', placeholder: '(555) 000-0000', required: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PhoneInput label="Small" size="sm" />
      <PhoneInput label="Medium" size="md" />
      <PhoneInput label="Large" size="lg" />
    </div>
  ),
};
