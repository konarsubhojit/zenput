import React, { createContext, useContext, useId, useMemo } from 'react';
import { classNames } from '../../utils';
import styles from './Field.module.css';
import type {
  FieldContextValue,
  FieldControlOwnProps,
  FieldCounterProps,
  FieldDescriptionProps,
  FieldLabelProps,
  FieldMessageProps,
  FieldMessageType,
  FieldProps,
} from './Field.types';
import type { ValidationState } from '../../types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext(): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) {
    throw new Error('Field sub-components must be rendered inside <Field>.');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Field (root)
// ---------------------------------------------------------------------------

/**
 * Composable field primitive that wires up labels, descriptions, and
 * validation messages to a form control via ARIA attributes.
 *
 * @example Simple usage
 * ```tsx
 * <Field label="Name" required error={hasError} message="Name is required">
 *   <TextInput />
 * </Field>
 * ```
 *
 * @example Advanced composition
 * ```tsx
 * <Field>
 *   <FieldLabel>Name</FieldLabel>
 *   <FieldControl as={TextInput} placeholder="Enter name" />
 *   <FieldDescription>Your full legal name</FieldDescription>
 *   <FieldMessage type="error">Name is required</FieldMessage>
 * </Field>
 * ```
 */
export function Field({
  label,
  description,
  message,
  validationState,
  error,
  required,
  disabled,
  id,
  fullWidth,
  className,
  style,
  children,
}: FieldProps): React.ReactElement {
  const generatedId = useId();
  const controlId = id ?? `field-${generatedId}`;
  const descriptionId = `${controlId}-description`;
  const messageId = `${controlId}-message`;
  const counterId = `${controlId}-counter`;

  // Convenience: `error` prop overrides validationState to 'error'
  const resolvedValidationState: ValidationState | undefined = error
    ? 'error'
    : validationState;

  const ctx = useMemo<FieldContextValue>(
    () => ({
      controlId,
      descriptionId,
      messageId,
      counterId,
      required,
      disabled,
      validationState: resolvedValidationState,
    }),
    [controlId, descriptionId, messageId, counterId, required, disabled, resolvedValidationState]
  );

  return (
    <FieldContext.Provider value={ctx}>
      <div
        className={classNames(styles.field, fullWidth ? styles.fullWidth : undefined, className)}
        style={style}
      >
        {label && <FieldLabel>{label}</FieldLabel>}
        {children}
        {description && <FieldDescription>{description}</FieldDescription>}
        {message && (
          <FieldMessage type={resolvedValidationState as FieldMessageType | undefined}>
            {message}
          </FieldMessage>
        )}
      </div>
    </FieldContext.Provider>
  );
}
Field.displayName = 'Field';

// ---------------------------------------------------------------------------
// FieldLabel
// ---------------------------------------------------------------------------

/**
 * Label element for the field. Automatically associates with the control via
 * `htmlFor`.
 */
export function FieldLabel({
  children,
  className,
  ...rest
}: FieldLabelProps): React.ReactElement {
  const { controlId, required } = useFieldContext();

  return (
    <label
      {...rest}
      htmlFor={controlId}
      className={classNames(
        styles.label,
        required ? styles.required : undefined,
        className
      )}
    >
      {children}
    </label>
  );
}
FieldLabel.displayName = 'FieldLabel';

// ---------------------------------------------------------------------------
// FieldControl
// ---------------------------------------------------------------------------

/**
 * Wraps a form control and injects the correct `id` and ARIA attributes from
 * the surrounding `<Field>` context.
 *
 * For simple inputs pass `as={TextInput}`:
 * ```tsx
 * <FieldControl as={TextInput} placeholder="Enter name" />
 * ```
 *
 * For controls that already manage their own id/aria props you can instead
 * render the control directly as a child of `<Field>` and use
 * `useFieldControlProps()` to spread the props manually.
 */
export function FieldControl({
  as: Component = 'div',
  className,
  style,
  children,
  ...rest
}: FieldControlOwnProps): React.ReactElement {
  const { controlId, descriptionId, messageId, required, disabled, validationState } =
    useFieldContext();

  // Build an aria-describedby that merges description and message ids when
  // they exist. We can't know at this point whether the description/message
  // elements are actually rendered, so we include both and let the browser
  // silently ignore any that don't match an element.
  const ariaDescribedBy = [descriptionId, messageId].join(' ');

  const injected: Record<string, unknown> = {
    id: controlId,
    'aria-describedby': ariaDescribedBy,
    ...(validationState === 'error' ? { 'aria-invalid': true as const } : {}),
    ...(required ? { 'aria-required': true as const } : {}),
    ...(disabled ? { 'aria-disabled': true as const } : {}),
  };

  return (
    <Component
      {...rest}
      {...injected}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
}
FieldControl.displayName = 'FieldControl';

// ---------------------------------------------------------------------------
// FieldDescription
// ---------------------------------------------------------------------------

/**
 * Helper / description text displayed below the control.
 */
export function FieldDescription({
  children,
  className,
  ...rest
}: FieldDescriptionProps): React.ReactElement {
  const { descriptionId } = useFieldContext();

  return (
    <span
      {...rest}
      id={descriptionId}
      className={classNames(styles.description, className)}
    >
      {children}
    </span>
  );
}
FieldDescription.displayName = 'FieldDescription';

// ---------------------------------------------------------------------------
// FieldMessage
// ---------------------------------------------------------------------------

function resolveMessageType(
  type: FieldMessageType | undefined,
  validationState: ValidationState | undefined
): FieldMessageType | undefined {
  if (type) return type;
  if (validationState === 'error') return 'error';
  if (validationState === 'success') return 'success';
  if (validationState === 'warning') return 'warning';
  return undefined;
}

/**
 * Validation/status message displayed below the control.
 * The `type` prop controls the colour; it defaults to the Field's
 * `validationState`.
 */
export function FieldMessage({
  type,
  children,
  className,
  ...rest
}: FieldMessageProps): React.ReactElement {
  const { messageId, validationState } = useFieldContext();
  const resolvedType = resolveMessageType(type, validationState);

  return (
    <span
      {...rest}
      id={messageId}
      role="alert"
      className={classNames(
        styles.message,
        resolvedType ? styles[resolvedType] : undefined,
        className
      )}
    >
      {children}
    </span>
  );
}
FieldMessage.displayName = 'FieldMessage';

// ---------------------------------------------------------------------------
// FieldCounter
// ---------------------------------------------------------------------------

/**
 * Character counter. Turns red when the current count exceeds `max`.
 */
export function FieldCounter({
  current,
  max,
  className,
  ...rest
}: FieldCounterProps): React.ReactElement {
  const { counterId } = useFieldContext();
  const exceeded = current > max;

  return (
    <span
      {...rest}
      id={counterId}
      aria-live="polite"
      className={classNames(styles.counter, exceeded ? styles.exceeded : undefined, className)}
    >
      {current}/{max}
    </span>
  );
}
FieldCounter.displayName = 'FieldCounter';

// ---------------------------------------------------------------------------
// Hook: useFieldControlProps
// ---------------------------------------------------------------------------

/**
 * Returns the ARIA props that should be spread onto a custom control rendered
 * inside a `<Field>`. Useful when you cannot use `<FieldControl as={…}>`.
 *
 * @example
 * ```tsx
 * function MyInput(props) {
 *   const fieldProps = useFieldControlProps();
 *   return <input {...fieldProps} {...props} />;
 * }
 * ```
 */
export function useFieldControlProps() {
  const ctx = useContext(FieldContext);
  if (!ctx) return {};

  const { controlId, descriptionId, messageId, required, disabled, validationState } = ctx;
  return {
    id: controlId,
    'aria-describedby': `${descriptionId} ${messageId}`,
    ...(validationState === 'error' ? { 'aria-invalid': true as const } : {}),
    ...(required ? { 'aria-required': true as const } : {}),
    ...(disabled ? { 'aria-disabled': true as const } : {}),
  };
}
