import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: { label: 'Password', placeholder: 'Enter password' },
};

export const WithStrengthIndicator: Story = {
  args: { label: 'Password', placeholder: 'Enter password', showStrengthIndicator: true },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PasswordInput label="Default" validationState="default" helperText="Min. 8 characters" />
      <PasswordInput label="Error" validationState="error" errorMessage="Password too weak" />
      <PasswordInput label="Success" validationState="success" successMessage="Strong password!" />
      <PasswordInput label="Warning" validationState="warning" warningMessage="Consider using symbols" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled', placeholder: 'Cannot edit', disabled: true },
};

export const Required: Story = {
  args: { label: 'Required Password', placeholder: 'Required', required: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PasswordInput label="Small" size="sm" />
      <PasswordInput label="Medium" size="md" />
      <PasswordInput label="Large" size="lg" />
    </div>
  ),
};
