import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: { label: 'Full Name', placeholder: 'Enter your name' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextInput label="Small" placeholder="sm" size="sm" />
      <TextInput label="Medium" placeholder="md" size="md" />
      <TextInput label="Large" placeholder="lg" size="lg" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextInput label="Outlined" placeholder="outlined" variant="outlined" />
      <TextInput label="Filled" placeholder="filled" variant="filled" />
      <TextInput label="Underlined" placeholder="underlined" variant="underlined" />
    </div>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextInput label="Default" placeholder="default" validationState="default" helperText="Helper text" />
      <TextInput label="Error" placeholder="error" validationState="error" errorMessage="This field is required" />
      <TextInput label="Success" placeholder="success" validationState="success" successMessage="Looks good!" />
      <TextInput label="Warning" placeholder="warning" validationState="warning" warningMessage="Check this value" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled', placeholder: 'Cannot edit', disabled: true },
};

export const Required: Story = {
  args: { label: 'Required Field', placeholder: 'Required', required: true },
};

export const FloatingLabel: Story = {
  args: { label: 'Floating Label', placeholder: 'Type something', floatingLabel: true },
};

export const FullWidth: Story = {
  args: { label: 'Full Width', placeholder: 'Full width input', fullWidth: true },
};
