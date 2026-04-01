import React from 'react';
import { BaseInputProps } from '../../types';

export interface RangeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    BaseInputProps {
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Show the current numeric value */
  showValue?: boolean;
  /** Format the displayed value */
  formatValue?: (value: number) => string;
}
