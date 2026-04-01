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
});
