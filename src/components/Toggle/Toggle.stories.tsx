import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    validationState: { control: 'select', options: ['default', 'error'] },
    labelPosition: { control: 'select', options: ['left', 'right'] },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { label: 'Enable notifications' },
};

export const Checked: Story = {
  args: { label: 'Active', defaultChecked: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Toggle label="Small" size="sm" />
      <Toggle label="Medium" size="md" />
      <Toggle label="Large" size="lg" />
    </div>
  ),
};

export const LabelLeft: Story = {
  args: { label: 'Label on left', labelPosition: 'left' },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Toggle label="Default" validationState="default" helperText="Helper text" />
      <Toggle label="Error" validationState="error" errorMessage="This field is required" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled toggle', disabled: true },
};
