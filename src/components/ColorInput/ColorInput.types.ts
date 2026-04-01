import React from 'react';
import { BaseInputProps } from '../../types';

export interface ColorInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    BaseInputProps {
  /** Show the hex value text next to the color picker */
  showHexValue?: boolean;
}
