import React from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outlined' | 'filled' | 'underlined';
export type ValidationState = 'default' | 'error' | 'success' | 'warning';

export interface BaseInputProps {
  /** Visual size of the input */
  size?: InputSize;
  /** Visual variant/style */
  variant?: InputVariant;
  /** Validation state */
  validationState?: ValidationState;
  /** Label text */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message (shown when validationState is 'error') */
  errorMessage?: string;
  /** Success message */
  successMessage?: string;
  /** Warning message */
  warningMessage?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is read-only */
  readOnly?: boolean;
  /** Prefix icon/element */
  prefixIcon?: React.ReactNode;
  /** Suffix icon/element */
  suffixIcon?: React.ReactNode;
  /** Whether to show the label as floating */
  floatingLabel?: boolean;
  /** Full width mode */
  fullWidth?: boolean;
  /** Custom className for the wrapper element */
  wrapperClassName?: string;
  /** Custom style for the wrapper element */
  wrapperStyle?: React.CSSProperties;
  /** Custom className for the label element */
  labelClassName?: string;
  /** Custom style for the label element */
  labelStyle?: React.CSSProperties;
  /** Custom className for the input element */
  inputClassName?: string;
  /** Custom style for the input element */
  inputStyle?: React.CSSProperties;
  /** Custom className for the helper text element */
  helperTextClassName?: string;
  /** Custom style for the helper text element */
  helperTextStyle?: React.CSSProperties;
}
