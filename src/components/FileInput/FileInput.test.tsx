import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileInput } from './FileInput';

describe('FileInput', () => {
  it('renders without errors', () => {
    render(<FileInput />);
  });

  it('renders with label', () => {
    render(<FileInput label="Upload file" />);
    expect(screen.getByText('Upload file')).toBeInTheDocument();
  });

  it('renders the file button', () => {
    render(<FileInput buttonLabel="Select file" />);
    expect(screen.getByRole('button', { name: /Select file/ })).toBeInTheDocument();
  });

  it('renders the hidden native file input', () => {
    render(<FileInput />);
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('disables the button when disabled', () => {
    render(<FileInput disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders dropzone when dropzone prop is set', () => {
    render(<FileInput dropzone buttonLabel="Drop files here" />);
    expect(screen.getByRole('button', { name: 'Drop files here' })).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<FileInput validationState="error" errorMessage="File required" />);
    expect(screen.getByText('File required')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<FileInput helperText="Max 5MB" />);
    expect(screen.getByText('Max 5MB')).toBeInTheDocument();
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<FileInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('renders image preview when previewSrc is provided', () => {
    render(<FileInput previewSrc="https://example.com/image.jpg" />);
    const img = screen.getByRole('img', { name: 'Selected image preview' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('uses label in preview alt text when label is provided', () => {
    render(<FileInput previewSrc="https://example.com/image.jpg" label="Avatar" />);
    expect(screen.getByRole('img', { name: 'Avatar preview' })).toBeInTheDocument();
  });

  it('does not render image preview when previewSrc is not provided', () => {
    render(<FileInput />);
    expect(screen.queryByRole('img', { name: 'Selected image preview' })).not.toBeInTheDocument();
  });

  it('renders progress bar when uploadProgress is provided', () => {
    render(<FileInput uploadProgress={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
  });

  it('renders progress bar when uploading is true', () => {
    render(<FileInput uploading />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    // Indeterminate — aria-valuenow should not be set
    expect(progressbar).not.toHaveAttribute('aria-valuenow');
  });

  it('clamps uploadProgress to 0–100', () => {
    render(<FileInput uploadProgress={120} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});
