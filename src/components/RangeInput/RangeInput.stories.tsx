import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RangeInput } from './RangeInput';

const meta: Meta<typeof RangeInput> = {
  title: 'Components/RangeInput',
  component: RangeInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof RangeInput>;

export const Default: Story = {
  args: { label: 'Volume', min: 0, max: 100, defaultValue: 50 },
};

export const ShowValue: Story = {
  args: { label: 'Brightness', min: 0, max: 100, defaultValue: 75, showValue: true },
};

export const WithStep: Story = {
  args: { label: 'Rating', min: 0, max: 10, step: 0.5, showValue: true },
};

export const FormatValue: Story = {
  args: {
    label: 'Price Range',
    min: 0,
    max: 1000,
    defaultValue: 500,
    showValue: true,
    formatValue: (v: number) => `$${v}`,
  },
};

export const Disabled: Story = {
  args: { label: 'Disabled Range', min: 0, max: 100, defaultValue: 40, disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <RangeInput label="Small" min={0} max={100} size="sm" showValue />
      <RangeInput label="Medium" min={0} max={100} size="md" showValue />
      <RangeInput label="Large" min={0} max={100} size="lg" showValue />
    </div>
  ),
};
