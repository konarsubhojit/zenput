import React, { forwardRef, useCallback, useState } from 'react';
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
      multiple,
      selectedValues,
      onSelectedValuesChange,
      onChange,
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

    // ── Multi-select state ───────────────────────────────────────────────────

    const isControlled = selectedValues !== undefined;
    const [internalSelected, setInternalSelected] = useState<string[]>([]);
    const activeSelected = isControlled ? selectedValues : internalSelected;

    const handleMultiChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const picked = e.target.value;
        if (!picked) return;
        const next = activeSelected.includes(picked)
          ? activeSelected
          : [...activeSelected, picked];
        if (!isControlled) setInternalSelected(next);
        onSelectedValuesChange?.(next);
        // Reset the native select back to the placeholder so it stays visually neutral
        e.target.value = '';
        onChange?.(e);
      },
      [activeSelected, isControlled, onSelectedValuesChange, onChange]
    );

    const removeChip = useCallback(
      (value: string) => {
        const next = activeSelected.filter((v) => v !== value);
        if (!isControlled) setInternalSelected(next);
        onSelectedValuesChange?.(next);
      },
      [activeSelected, isControlled, onSelectedValuesChange]
    );

    const getLabel = (value: string) =>
      options.find((o) => o.value === value)?.label ?? value;

    // ── Render ────────────────────────────────────────────────────────────────

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

        {/* Chips for multi-select */}
        {multiple && activeSelected.length > 0 && (
          <div className={styles.chipList}>
            {activeSelected.map((val) => (
              <span key={val} className={styles.chip}>
                {getLabel(val)}
                <button
                  type="button"
                  aria-label={`Remove ${getLabel(val)}`}
                  className={styles.chipRemove}
                  disabled={disabled}
                  onClick={() => removeChip(val)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
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
            onChange={multiple ? handleMultiChange : onChange}
          >
            {(placeholder || multiple) && (
              <option value="" disabled={!multiple} className={styles.placeholderOption}>
                {placeholder ?? (multiple ? 'Add…' : undefined)}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled || (multiple && activeSelected.includes(opt.value))}
              >
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
