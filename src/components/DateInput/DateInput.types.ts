import React from 'react';
import { BaseInputProps } from '../../types';

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    BaseInputProps {
  /** Minimum date (YYYY-MM-DD) */
  min?: string;
  /** Maximum date (YYYY-MM-DD) */
  max?: string;
}
