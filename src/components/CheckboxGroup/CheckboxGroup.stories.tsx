import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CheckboxGroup } from './CheckboxGroup';

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
];

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    direction: { control: 'select', options: ['horizontal', 'vertical'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
  args: { label: 'Favorite Fruits', options: FRUIT_OPTIONS },
};

export const WithDefaultValues: Story = {
  args: { label: 'Favorite Fruits', options: FRUIT_OPTIONS, defaultValue: ['apple', 'cherry'] },
};

export const Horizontal: Story = {
  args: { label: 'Favorite Fruits', options: FRUIT_OPTIONS, direction: 'horizontal' },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <CheckboxGroup label="Default" options={FRUIT_OPTIONS} validationState="default" helperText="Select all that apply" />
      <CheckboxGroup label="Error" options={FRUIT_OPTIONS} validationState="error" errorMessage="Please select at least one" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled Group', options: FRUIT_OPTIONS, disabled: true },
};
