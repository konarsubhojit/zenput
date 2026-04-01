import React from 'react';
import { BaseInputProps } from '../../types';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    BaseInputProps {
  /** Called when the user submits the search (Enter key or search button click) */
  onSearch?: (value: string) => void;
  /** Show a clear button when there is a value */
  showClearButton?: boolean;
  /** Whether to show a search icon */
  showSearchIcon?: boolean;
}
