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
}
