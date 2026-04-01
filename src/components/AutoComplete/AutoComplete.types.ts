import React from 'react';
import { BaseInputProps } from '../../types';

export interface AutoCompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AutoCompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>,
    BaseInputProps {
  /** List of options to display */
  options: AutoCompleteOption[];
  /** Currently selected value (controlled) */
  value?: string;
  /** Default value */
  defaultValue?: string;
  /** Called when the input value changes */
  onChange?: (value: string) => void;
  /** Called when an option is selected */
  onSelect?: (option: AutoCompleteOption) => void;
  /** Called when the user types (for async search) */
  onSearch?: (query: string) => void;
  /** Whether the dropdown is in a loading state */
  loading?: boolean;
  /** Message shown when no options match */
  noOptionsMessage?: string;
  /** Allow entering a custom value not in the options list */
  allowCustomValue?: boolean;
}
