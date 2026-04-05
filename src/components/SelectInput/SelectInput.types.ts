import React from 'react';
import { BaseInputProps } from '../../types';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectInputProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    BaseInputProps {
  /** List of options */
  options: SelectOption[];
  /** Placeholder text shown as first disabled option */
  placeholder?: string;
  /**
   * When true, allows multiple values to be selected at once.
   * Selected values are displayed as dismissible chips above the select element.
   */
  multiple?: boolean;
  /**
   * Controlled array of selected values (used when multiple is true).
   * Defaults to an uncontrolled internal state when omitted.
   */
  selectedValues?: string[];
  /**
   * Called with the updated array of selected values when the selection changes
   * (used when multiple is true).
   */
  onSelectedValuesChange?: (values: string[]) => void;
}
