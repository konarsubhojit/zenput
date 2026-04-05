import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AutoComplete } from './AutoComplete';

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'honeydew', label: 'Honeydew' },
];

const meta: Meta<typeof AutoComplete> = {
  title: 'Components/AutoComplete',
  component: AutoComplete,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof AutoComplete>;

export const Default: Story = {
  args: { label: 'Favorite Fruit', placeholder: 'Type to search...', options: FRUIT_OPTIONS },
};

export const AllowCustomValue: Story = {
  args: {
    label: 'Fruit',
    placeholder: 'Type or select...',
    options: FRUIT_OPTIONS,
    allowCustomValue: true,
    helperText: 'You can type a custom value',
  },
};

export const Loading: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    options: [],
    loading: true,
    helperText: 'Simulating loading state',
  },
};

export const NoOptions: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    options: [],
    defaultValue: 'xyz',
    noOptionsMessage: 'No fruits found matching your search',
  },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <AutoComplete label="Default" options={FRUIT_OPTIONS} validationState="default" helperText="Start typing to search" />
      <AutoComplete label="Error" options={FRUIT_OPTIONS} validationState="error" errorMessage="Please select a valid option" />
      <AutoComplete label="Success" options={FRUIT_OPTIONS} validationState="success" successMessage="Great choice!" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled', options: FRUIT_OPTIONS, disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <AutoComplete label="Small" options={FRUIT_OPTIONS} size="sm" placeholder="Search..." />
      <AutoComplete label="Medium" options={FRUIT_OPTIONS} size="md" placeholder="Search..." />
      <AutoComplete label="Large" options={FRUIT_OPTIONS} size="lg" placeholder="Search..." />
    </div>
  ),
};
