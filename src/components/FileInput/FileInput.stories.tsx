import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileInput } from './FileInput';

const meta: Meta<typeof FileInput> = {
  title: 'Components/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outlined', 'filled', 'underlined'] },
    validationState: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
  },
};

export default meta;
type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  args: { label: 'Upload File', buttonLabel: 'Choose File' },
};

export const ShowFileNames: Story = {
  args: { label: 'Upload File', showFileNames: true, helperText: 'Selected files will be shown' },
};

export const Dropzone: Story = {
  args: { label: 'Drop Zone', dropzone: true, helperText: 'Drag and drop files here' },
};

export const MultipleFiles: Story = {
  args: { label: 'Multiple Files', multiple: true, showFileNames: true },
};

export const AcceptImages: Story = {
  args: { label: 'Upload Image', accept: 'image/*', helperText: 'Only image files' },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FileInput label="Default" validationState="default" helperText="Upload a file" />
      <FileInput label="Error" validationState="error" errorMessage="File is too large" />
      <FileInput label="Success" validationState="success" successMessage="File uploaded!" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
};
