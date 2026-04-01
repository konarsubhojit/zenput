import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ColorInput } from './ColorInput';

describe('ColorInput', () => {
  it('renders without errors', () => {
    render(<ColorInput />);
  });

  it('renders with label', () => {
    render(<ColorInput label="Brand color" />);
    expect(screen.getByText('Brand color')).toBeInTheDocument();
  });

  it('renders as type="color"', () => {
    render(<ColorInput />);
    expect(document.querySelector('input[type="color"]')).toBeInTheDocument();
  });

  it('shows hex value by default', () => {
    render(<ColorInput defaultValue="#FF5733" />);
    expect(screen.getByText('#FF5733')).toBeInTheDocument();
  });

  it('hides hex value when showHexValue is false', () => {
    render(<ColorInput defaultValue="#FF5733" showHexValue={false} />);
    expect(screen.queryByText('#FF5733')).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is set', () => {
    render(<ColorInput disabled />);
    expect(document.querySelector('input')).toBeDisabled();
  });

  it('renders error message', () => {
    render(<ColorInput validationState="error" errorMessage="Color required" />);
    expect(screen.getByText('Color required')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<ColorInput helperText="Choose your brand color" />);
    expect(screen.getByText('Choose your brand color')).toBeInTheDocument();
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<ColorInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
