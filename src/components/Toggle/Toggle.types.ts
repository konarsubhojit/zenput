import React from 'react';
import { BaseInputProps } from '../../types';

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    Pick<
      BaseInputProps,
      | 'size'
      | 'validationState'
      | 'label'
      | 'helperText'
      | 'errorMessage'
      | 'required'
      | 'disabled'
      | 'wrapperClassName'
      | 'wrapperStyle'
      | 'labelClassName'
      | 'labelStyle'
      | 'inputClassName'
      | 'inputStyle'
      | 'helperTextClassName'
      | 'helperTextStyle'
    > {
  /** Label position relative to the toggle */
  labelPosition?: 'left' | 'right';
}
