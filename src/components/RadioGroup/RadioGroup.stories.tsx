import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not', label: 'Prefer not to say', disabled: true },
];

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    direction: { control: 'select', options: ['horizontal', 'vertical'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: { label: 'Gender', name: 'gender', options: GENDER_OPTIONS },
};

export const WithDefaultValue: Story = {
  args: { label: 'Gender', name: 'gender-default', options: GENDER_OPTIONS, defaultValue: 'male' },
};

export const Horizontal: Story = {
  args: { label: 'Gender', name: 'gender-h', options: GENDER_OPTIONS, direction: 'horizontal' },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <RadioGroup label="Default" name="r1" options={GENDER_OPTIONS} validationState="default" helperText="Select one" />
      <RadioGroup label="Error" name="r2" options={GENDER_OPTIONS} validationState="error" errorMessage="Please select an option" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled Group', name: 'gender-dis', options: GENDER_OPTIONS, disabled: true },
};
