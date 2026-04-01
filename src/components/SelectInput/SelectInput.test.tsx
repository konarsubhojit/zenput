import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SelectInput } from './SelectInput';

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
];

describe('SelectInput', () => {
  it('renders without errors', () => {
    render(<SelectInput options={OPTIONS} />);
  });

  it('renders with label', () => {
    render(<SelectInput label="Country" options={OPTIONS} />);
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<SelectInput options={OPTIONS} />);
    expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'United Kingdom' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument();
  });

  it('renders placeholder as disabled option', () => {
    render(<SelectInput options={OPTIONS} placeholder="Select a country" />);
    const placeholder = screen.getByRole('option', { name: 'Select a country' });
    expect(placeholder).toBeDisabled();
  });

  it('is disabled when disabled prop is set', () => {
    render(<SelectInput options={OPTIONS} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('associates label with select via htmlFor/id', () => {
    render(<SelectInput label="Country" options={OPTIONS} />);
    const label = screen.getByText('Country');
    const select = screen.getByRole('combobox');
    expect(label).toHaveAttribute('for', select.id);
  });

  it('renders error message when validationState is error', () => {
    render(<SelectInput options={OPTIONS} validationState="error" errorMessage="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', async () => {
    const handleChange = jest.fn();
    render(<SelectInput options={OPTIONS} onChange={handleChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox'), 'uk');
    expect(handleChange).toHaveBeenCalled();
  });

  it('forwards ref to select element', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<SelectInput options={OPTIONS} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
