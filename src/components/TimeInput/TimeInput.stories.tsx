import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimeInput } from './TimeInput';

const meta: Meta<typeof TimeInput> = {
  title: 'Components/TimeInput',
  component: TimeInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof TimeInput>;

export const Default: Story = {
  args: { label: 'Appointment Time' },
};

export const WithRange: Story = {
  args: { label: 'Business Hours', min: '09:00', max: '17:00', helperText: 'Between 9 AM and 5 PM' },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TimeInput label="Default" validationState="default" helperText="Select a time" />
      <TimeInput label="Error" validationState="error" errorMessage="Please select a valid time" />
      <TimeInput label="Success" validationState="success" successMessage="Time selected!" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled Time', disabled: true },
};

export const Required: Story = {
  args: { label: 'Required Time', required: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TimeInput label="Small" size="sm" />
      <TimeInput label="Medium" size="md" />
      <TimeInput label="Large" size="lg" />
    </div>
  ),
};
