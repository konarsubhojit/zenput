import React from 'react';
import { BaseInputProps } from '../../types';

export interface TimeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    BaseInputProps {
  /** Minimum time (HH:mm) */
  min?: string;
  /** Maximum time (HH:mm) */
  max?: string;
}
