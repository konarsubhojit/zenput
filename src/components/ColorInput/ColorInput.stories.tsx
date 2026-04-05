import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorInput } from './ColorInput';

const meta: Meta<typeof ColorInput> = {
  title: 'Components/ColorInput',
  component: ColorInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof ColorInput>;

export const Default: Story = {
  args: { label: 'Brand Color' },
};

export const ShowHexValue: Story = {
  args: { label: 'Brand Color', showHexValue: true, defaultValue: '#6366f1' },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ColorInput label="Default" validationState="default" helperText="Pick a color" />
      <ColorInput label="Error" validationState="error" errorMessage="Invalid color" />
      <ColorInput label="Success" validationState="success" successMessage="Color applied!" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ColorInput label="Small" size="sm" />
      <ColorInput label="Medium" size="md" />
      <ColorInput label="Large" size="lg" />
    </div>
  ),
};
