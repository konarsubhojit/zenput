import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectInput } from './SelectInput';

const COUNTRY_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany', disabled: true },
];

const meta: Meta<typeof SelectInput> = {
  title: 'Components/SelectInput',
  component: SelectInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof SelectInput>;

export const Default: Story = {
  args: { label: 'Country', options: COUNTRY_OPTIONS, placeholder: 'Select a country' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SelectInput label="Small" options={COUNTRY_OPTIONS} size="sm" />
      <SelectInput label="Medium" options={COUNTRY_OPTIONS} size="md" />
      <SelectInput label="Large" options={COUNTRY_OPTIONS} size="lg" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SelectInput label="Outlined" options={COUNTRY_OPTIONS} variant="outlined" />
      <SelectInput label="Filled" options={COUNTRY_OPTIONS} variant="filled" />
      <SelectInput label="Underlined" options={COUNTRY_OPTIONS} variant="underlined" />
    </div>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SelectInput label="Default" options={COUNTRY_OPTIONS} validationState="default" helperText="Select a country" />
      <SelectInput label="Error" options={COUNTRY_OPTIONS} validationState="error" errorMessage="Please select a country" />
      <SelectInput label="Success" options={COUNTRY_OPTIONS} validationState="success" successMessage="Country selected!" />
      <SelectInput label="Warning" options={COUNTRY_OPTIONS} validationState="warning" warningMessage="Check your selection" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled', options: COUNTRY_OPTIONS, disabled: true },
};

export const Required: Story = {
  args: { label: 'Required', options: COUNTRY_OPTIONS, placeholder: 'Select a country', required: true },
};

export const MultiSelect: Story = {
  render: () => {
    const MultiSelectExample = () => {
      const [selected, setSelected] = useState<string[]>(['us']);
      return (
        <SelectInput
          label="Countries"
          options={COUNTRY_OPTIONS}
          multiple
          selectedValues={selected}
          onSelectedValuesChange={setSelected}
          helperText="Select one or more countries"
        />
      );
    };
    return <MultiSelectExample />;
  },
};
