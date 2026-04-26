import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { Controller, FormProvider, useFormContext, useFormState } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import type {
  FormProps,
  FormFieldProps,
  FormSubmitProps,
  FormResetProps,
  FormErrorSummaryProps,
} from './Form.types';
import styles from './Form.module.css';

// ---------------------------------------------------------------------------
// Internal context — exposes the form instance to sub-components
// ---------------------------------------------------------------------------

interface FormInternalContextValue {
  disabled?: boolean;
}

const FormInternalContext = createContext<FormInternalContextValue>({});

function useFormInternal(): FormInternalContextValue {
  return useContext(FormInternalContext);
}

// ---------------------------------------------------------------------------
// FormRoot
// ---------------------------------------------------------------------------

function FormRoot<TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  onError,
  children,
  className,
  style,
  ...rest
}: FormProps<TFieldValues>): React.ReactElement {
  const { handleSubmit, formState } = form;

  return (
    <FormProvider {...form}>
      <FormInternalContext.Provider value={{ disabled: formState.isSubmitting }}>
        <form
          className={className}
          style={style}
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          aria-busy={formState.isSubmitting || undefined}
          {...rest}
        >
          {children}
        </form>
      </FormInternalContext.Provider>
    </FormProvider>
  );
}

FormRoot.displayName = 'Form';

// ---------------------------------------------------------------------------
// Form.Field
// ---------------------------------------------------------------------------

function FormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  children,
  descriptionId,
  disabled: fieldDisabled,
}: FormFieldProps<TFieldValues>): React.ReactElement {
  const { control } = useFormContext<TFieldValues>();
  const { disabled: formDisabled } = useFormInternal();
  const isDisabled = fieldDisabled ?? formDisabled;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error);
        const errorMessage = fieldState.error?.message;
        const describedBy = [
          descriptionId,
          hasError ? `${String(name)}-error` : undefined,
        ]
          .filter(Boolean)
          .join(' ') || undefined;

        return (
          <>
            {children({
              props: {
                name: String(name),
                value: field.value ?? '',
                onChange: field.onChange,
                onBlur: field.onBlur,
                ref: field.ref,
                disabled: isDisabled,
                validationState: hasError ? 'error' : 'default',
                errorMessage,
                ...(hasError ? { 'aria-invalid': true as const } : {}),
                ...(describedBy ? { 'aria-describedby': describedBy } : {}),
              },
              invalid: hasError,
              errorMessage,
            })}
          </>
        );
      }}
    />
  );
}

FormField.displayName = 'Form.Field';

// ---------------------------------------------------------------------------
// Form.Submit
// ---------------------------------------------------------------------------

function FormSubmit({ children = 'Submit', className, ...rest }: FormSubmitProps): React.ReactElement {
  const { disabled: formDisabled } = useFormInternal();
  const { isSubmitting } = useFormState();

  return (
    <button
      type="submit"
      disabled={isSubmitting || formDisabled}
      aria-busy={isSubmitting || undefined}
      className={className ?? styles.submitButton}
      {...rest}
    >
      {children}
    </button>
  );
}

FormSubmit.displayName = 'Form.Submit';

// ---------------------------------------------------------------------------
// Form.Reset
// ---------------------------------------------------------------------------

function FormReset({ children = 'Reset', className, ...rest }: FormResetProps): React.ReactElement {
  const { disabled: formDisabled } = useFormInternal();
  const { isSubmitting } = useFormState();

  return (
    <button
      type="reset"
      disabled={isSubmitting || formDisabled}
      className={className ?? styles.resetButton}
      {...rest}
    >
      {children}
    </button>
  );
}

FormReset.displayName = 'Form.Reset';

// ---------------------------------------------------------------------------
// Form.ErrorSummary
// ---------------------------------------------------------------------------

function FormErrorSummary({
  heading = 'Please fix the following errors:',
  className,
  style,
}: FormErrorSummaryProps): React.ReactElement | null {
  const { errors } = useFormState();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevHadErrors = useRef(false);

  const flatErrors = Object.entries(errors).map(([field, error]) => ({
    field,
    message: (error as { message?: string })?.message ?? `${field} is invalid`,
  }));

  const hasErrors = flatErrors.length > 0;

  // Focus the container when errors first appear (e.g., after submit).
  useEffect(() => {
    if (hasErrors && !prevHadErrors.current) {
      containerRef.current?.focus();
    }
    prevHadErrors.current = hasErrors;
  }, [hasErrors]);

  // Jump focus to the input for that field name.
  const focusField = useCallback((fieldName: string) => {
    const el = document.querySelector<HTMLElement>(`[name="${fieldName}"], #${fieldName}`);
    el?.focus();
  }, []);

  if (!hasErrors) return null;

  return (
    <div
      ref={containerRef}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={-1}
      className={className ?? styles.errorSummary}
      style={style}
    >
      <p className={styles.errorSummaryHeading}>{heading}</p>
      <ul className={styles.errorSummaryList}>
        {flatErrors.map(({ field, message }) => (
          <li key={field}>
            <button
              type="button"
              className={styles.errorSummaryItem}
              onClick={() => focusField(field)}
            >
              {message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

FormErrorSummary.displayName = 'Form.ErrorSummary';

// ---------------------------------------------------------------------------
// Compound component
// ---------------------------------------------------------------------------

/**
 * `<Form>` — thin wrapper around react-hook-form that wires up Zenput inputs.
 *
 * Use together with `useZenputForm` to get the form instance:
 *
 * ```tsx
 * import { Form, useZenputForm } from 'zenput/forms';
 * import { z } from 'zod';
 *
 * const schema = z.object({ email: z.string().email() });
 * const form = useZenputForm({ schema, defaultValues: { email: '' } });
 *
 * <Form form={form} onSubmit={values => console.log(values)}>
 *   <Form.Field name="email">
 *     {(field) => <TextInput label="Email" {...field.props} />}
 *   </Form.Field>
 *   <Form.Submit>Send</Form.Submit>
 * </Form>
 * ```
 */
export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Submit: FormSubmit,
  Reset: FormReset,
  ErrorSummary: FormErrorSummary,
});
