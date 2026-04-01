import React from 'react';
import { BaseInputProps } from '../../types';

export interface CheckboxProps
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
  /** Whether the checkbox is indeterminate */
  indeterminate?: boolean;
}
