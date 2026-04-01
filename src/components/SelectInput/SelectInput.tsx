import React, { forwardRef } from 'react';
import { SelectInputProps } from './SelectInput.types';
import { classNames } from '../../utils';
import { useFormField } from '../../hooks';
import styles from './SelectInput.module.css';

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      size = 'md',
      variant = 'outlined',
      validationState = 'default',
      label,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      required,
      disabled,
      readOnly: _readOnly,
      prefixIcon: _prefixIcon,
      suffixIcon: _suffixIcon,
      floatingLabel: _floatingLabel,
      fullWidth,
      wrapperClassName,
      wrapperStyle,
      labelClassName,
      labelStyle,
      inputClassName,
      inputStyle,
      helperTextClassName,
      helperTextStyle,
      id,
      className,
      options,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const { inputId, helperId, labelProps, inputAriaProps } = useFormField({
      id,
      label,
      helperText,
      errorMessage,
      validationState,
      required,
      disabled,
    });

    const activeMessage =
      validationState === 'error'
        ? errorMessage
        : validationState === 'success'
        ? successMessage
        : validationState === 'warning'
        ? warningMessage
        : helperText;

    const messageClass =
      validationState === 'error'
        ? styles.errorText
        : validationState === 'success'
        ? styles.successText
        : validationState === 'warning'
        ? styles.warningText
        : styles.helperText;

    return (
      <div
        className={classNames(
          styles.wrapper,
          styles[size],
          styles[variant],
          validationState !== 'default' ? styles[validationState] : undefined,
          fullWidth ? styles.fullWidth : undefined,
          wrapperClassName
        )}
        style={wrapperStyle}
      >
        {label && (
          <label
            {...labelProps}
            className={classNames(styles.label, required ? styles.required : undefined, labelClassName)}
            style={labelStyle}
          >
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          <select
            {...rest}
            {...inputAriaProps}
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={classNames(styles.input, inputClassName, className)}
            style={inputStyle}
          >
            {placeholder && (
              <option value="" disabled className={styles.placeholderOption}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className={styles.arrow}>▾</span>
        </div>
        {activeMessage && (
          <span
            id={helperId}
            className={classNames(messageClass, helperTextClassName)}
            style={helperTextStyle}
          >
            {activeMessage}
          </span>
        )}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';
