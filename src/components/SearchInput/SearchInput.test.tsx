import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders without errors', () => {
    render(<SearchInput />);
  });

  it('renders with label', () => {
    render(<SearchInput label="Search" />);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('renders as type="search"', () => {
    render(<SearchInput />);
    expect(document.querySelector('input[type="search"]')).toBeInTheDocument();
  });

  it('shows a search icon by default', () => {
    render(<SearchInput />);
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('shows clear button when value is present', async () => {
    render(<SearchInput />);
    const input = document.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'hello');
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('hides clear button when value is empty', () => {
    render(<SearchInput />);
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('calls onSearch when Enter is pressed', async () => {
    const handleSearch = jest.fn();
    render(<SearchInput onSearch={handleSearch} />);
    const input = document.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'react{Enter}');
    expect(handleSearch).toHaveBeenCalledWith('react');
  });

  it('is disabled when disabled prop is set', () => {
    render(<SearchInput disabled />);
    expect(document.querySelector('input')).toBeDisabled();
  });

  it('renders error message', () => {
    render(<SearchInput validationState="error" errorMessage="Search failed" />);
    expect(screen.getByText('Search failed')).toBeInTheDocument();
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
