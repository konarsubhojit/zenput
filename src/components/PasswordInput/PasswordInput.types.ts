import React from 'react';
import { BaseInputProps } from '../../types';

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    BaseInputProps {
  /** Show a password strength indicator */
  showStrengthIndicator?: boolean;
  /** Custom toggle visibility icon when password is visible */
  showIcon?: React.ReactNode;
  /** Custom toggle visibility icon when password is hidden */
  hideIcon?: React.ReactNode;
}
