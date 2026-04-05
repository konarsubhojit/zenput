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
    uploadProgress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
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

export const WithImagePreview: Story = {
  args: {
    label: 'Product Image',
    accept: 'image/*',
    previewSrc: 'https://placehold.co/200x150',
    helperText: 'Current image shown; pick a new file to update the preview',
  },
};

export const WithUploadProgress: Story = {
  args: {
    label: 'Upload Image',
    accept: 'image/*',
    uploadProgress: 65,
    helperText: '65% uploaded',
  },
};

export const Uploading: Story = {
  args: {
    label: 'Upload Image',
    accept: 'image/*',
    uploading: true,
    helperText: 'Upload in progress…',
  },
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
