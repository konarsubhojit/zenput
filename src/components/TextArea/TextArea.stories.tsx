import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: { label: 'Description', placeholder: 'Enter your description', rows: 4 },
};

export const AutoResize: Story = {
  args: { label: 'Auto Resize', placeholder: 'Type to see auto resize', autoResize: true },
};

export const ShowCharCount: Story = {
  args: { label: 'With Character Count', placeholder: 'Max 200 chars', maxLength: 200, showCharCount: true },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextArea label="Default" placeholder="default" validationState="default" helperText="Helper text" />
      <TextArea label="Error" placeholder="error" validationState="error" errorMessage="This field is required" />
      <TextArea label="Success" placeholder="success" validationState="success" successMessage="Looks good!" />
      <TextArea label="Warning" placeholder="warning" validationState="warning" warningMessage="Check this value" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled', placeholder: 'Cannot edit', disabled: true },
};

export const Required: Story = {
  args: { label: 'Required Field', placeholder: 'Required', required: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextArea label="Small" placeholder="sm" size="sm" />
      <TextArea label="Medium" placeholder="md" size="md" />
      <TextArea label="Large" placeholder="lg" size="lg" />
    </div>
  ),
};
