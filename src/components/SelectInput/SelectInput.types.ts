import React from 'react';
import { BaseInputProps } from '../../types';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectInputProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'multiple'>,
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
   * Placeholder text shown in the native select when `multiple` is true.
   * Defaults to 'Add…'.
   */
  multiplePlaceholder?: string;
  /**
   * Controlled array of selected values (used when multiple is true).
   * Defaults to an uncontrolled internal state when omitted.
   */
  selectedValues?: string[];
  /**
   * Called with the updated array of selected values when the selection changes
   * (used when multiple is true).
   */
  /**
   * Called when the selected value changes (single-select mode).
   * Do not use with `multiple`; use `onSelectedValuesChange` instead.
   */
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  /**
   * Controlled value (single-select mode).
   * Do not use with `multiple`.
   */
  value?: string | number;
  /**
   * Default value (single-select, uncontrolled).
   * Do not use with `multiple`.
   */
  defaultValue?: string | number;
  onSelectedValuesChange?: (values: string[]) => void;
}
