import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OTPInput } from './OTPInput';

const meta: Meta<typeof OTPInput> = {
  title: 'Components/OTPInput',
  component: OTPInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
    inputType: { control: 'select', options: ['numeric', 'alphanumeric'] },
    length: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
  args: { label: 'Verification Code', length: 6, helperText: 'Enter the 6-digit code' },
};

export const FourDigit: Story = {
  args: { label: 'PIN', length: 4, helperText: 'Enter your 4-digit PIN' },
};

export const Alphanumeric: Story = {
  args: { label: 'Access Code', length: 8, inputType: 'alphanumeric', helperText: 'Enter the 8-character code' },
};

export const Masked: Story = {
  args: { label: 'Secret PIN', length: 4, mask: true, helperText: 'Hidden input like password' },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <OTPInput label="Default" length={6} validationState="default" helperText="Enter the code sent to your email" />
      <OTPInput label="Error" length={6} validationState="error" errorMessage="Invalid code, please try again" />
      <OTPInput label="Success" length={6} validationState="success" helperText="Code verified!" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <OTPInput label="Small" size="sm" length={6} />
      <OTPInput label="Medium" size="md" length={6} />
      <OTPInput label="Large" size="lg" length={6} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled OTP', length: 6, disabled: true },
};
