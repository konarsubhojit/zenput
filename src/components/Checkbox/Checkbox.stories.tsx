import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    validationState: { control: 'select', options: ['default', 'error'] },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { label: 'I agree to the terms and conditions' },
};

export const Checked: Story = {
  args: { label: 'Checked by default', defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { label: 'Indeterminate state', indeterminate: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox label="Small checkbox" size="sm" />
      <Checkbox label="Medium checkbox" size="md" />
      <Checkbox label="Large checkbox" size="lg" />
    </div>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox label="Default" validationState="default" helperText="Helper text" />
      <Checkbox label="Error" validationState="error" errorMessage="You must accept the terms" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled checkbox', disabled: true },
};

export const Required: Story = {
  args: { label: 'Required checkbox', required: true },
};
