import React from 'react';
import type {
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  SubmitErrorHandler,
  Path,
  DefaultValues,
} from 'react-hook-form';
import type { ZodType } from 'zod';

// ---------------------------------------------------------------------------
// useZenputForm
// ---------------------------------------------------------------------------

export interface UseZenputFormOptions<TFieldValues extends FieldValues = FieldValues> {
  /**
   * Zod schema used for validation.
   * Accepts any Zod 3 or Zod 4 schema; resolved at runtime via
   * `@hookform/resolvers/zod`.
   */
  schema?: ZodType;
  /**
   * Initial values for the form fields.
   * Uses react-hook-form's `DefaultValues` type which is a deep partial,
   * supporting nested/array structures.
   */
  defaultValues?: DefaultValues<TFieldValues>;
  /** react-hook-form mode. Default: `'onBlur'`. */
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
}

// ---------------------------------------------------------------------------
// Form (root)
// ---------------------------------------------------------------------------

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onError'> {
  /** The form instance returned by `useZenputForm`. */
  form: UseFormReturn<TFieldValues>;
  /** Called with validated values on successful submit. */
  onSubmit: SubmitHandler<TFieldValues>;
  /** Called with validation errors on failed submit. */
  onError?: SubmitErrorHandler<TFieldValues>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Form.Field
// ---------------------------------------------------------------------------

/** Props injected into the render-prop child by Form.Field. */
export interface FieldRenderProps {
  /** Props to spread onto the Zenput input component. */
  props: {
    name: string;
    value: unknown;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    ref: React.Ref<unknown>;
    disabled?: boolean;
    validationState: 'default' | 'error';
    errorMessage?: string;
    'aria-invalid'?: true;
    'aria-describedby'?: string;
  };
  /** Whether the field currently has an error. */
  invalid: boolean;
  /** The current error message (if any). */
  errorMessage?: string;
}

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  /** Field name – must match a key in the form schema. */
  name: Path<TFieldValues>;
  /**
   * Render-prop child receiving `{ props, invalid, errorMessage }`.
   * Spread `field.props` onto any Zenput input.
   */
  children: (field: FieldRenderProps) => React.ReactNode;
  /** Additional accessible description id injected into `aria-describedby`. */
  descriptionId?: string;
  /** Whether the field should be disabled. */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Form.Submit
// ---------------------------------------------------------------------------

export interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// Form.Reset
// ---------------------------------------------------------------------------

export interface FormResetProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// Form.ErrorSummary
// ---------------------------------------------------------------------------

export interface FormErrorSummaryProps {
  /**
   * Heading shown above the error list.
   * Default: `'Please fix the following errors:'`
   */
  heading?: string;
  className?: string;
  style?: React.CSSProperties;
}
