import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AutoComplete } from './AutoComplete';

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
];

describe('AutoComplete', () => {
  it('renders without errors', () => {
    render(<AutoComplete options={OPTIONS} />);
  });

  it('renders with label', () => {
    render(<AutoComplete label="Framework" options={OPTIONS} />);
    expect(screen.getByText('Framework')).toBeInTheDocument();
  });

  it('renders the text input', () => {
    render(<AutoComplete options={OPTIONS} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows dropdown options when focused', async () => {
    render(<AutoComplete options={OPTIONS} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument();
  });

  it('filters options based on input', async () => {
    render(<AutoComplete options={OPTIONS} />);
    await userEvent.type(screen.getByRole('combobox'), 'vue');
    expect(screen.getByRole('option', { name: 'Vue' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'React' })).not.toBeInTheDocument();
  });

  it('selects an option on click', async () => {
    const handleSelect = jest.fn();
    render(<AutoComplete options={OPTIONS} onSelect={handleSelect} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'React' }));
    expect(handleSelect).toHaveBeenCalledWith({ value: 'react', label: 'React' });
  });

  it('shows no options message when no results', async () => {
    render(<AutoComplete options={OPTIONS} noOptionsMessage="Nothing found" />);
    await userEvent.type(screen.getByRole('combobox'), 'xyz');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    render(<AutoComplete options={OPTIONS} loading />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is set', () => {
    render(<AutoComplete options={OPTIONS} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('calls onSearch when typing', async () => {
    const handleSearch = jest.fn();
    render(<AutoComplete options={OPTIONS} onSearch={handleSearch} />);
    await userEvent.type(screen.getByRole('combobox'), 'reac');
    expect(handleSearch).toHaveBeenCalledWith('reac');
  });

  it('renders error message', () => {
    render(<AutoComplete options={OPTIONS} validationState="error" errorMessage="Selection required" />);
    expect(screen.getByText('Selection required')).toBeInTheDocument();
  });

  it('navigates options with arrow keys', async () => {
    render(<AutoComplete options={OPTIONS} />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant');
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<AutoComplete options={OPTIONS} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
