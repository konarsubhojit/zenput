import React from 'react';
import { BaseInputProps } from '../../types';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'>,
    BaseInputProps {
  /** Current value */
  value?: number;
  /** Default value */
  defaultValue?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Hide the increment/decrement buttons */
  hideControls?: boolean;
  /** Called when the value changes */
  onChange?: (value: number | undefined) => void;
  /**
   * Optional formatter applied to the displayed value while the input is not
   * focused. The underlying model value is always the raw number.
   * Example: `(v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })`
   */
  formatValue?: (value: number) => string;
}
