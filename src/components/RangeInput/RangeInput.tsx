import React, { forwardRef, useState, useCallback } from 'react';
import { RangeInputProps } from './RangeInput.types';
import { classNames } from '../../utils';
import { useFormField } from '../../hooks';
import styles from './RangeInput.module.css';

export const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
  (
    {
      size = 'md',
      variant: _variant,
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
      min = 0,
      max = 100,
      step = 1,
      showValue,
      formatValue,
      value,
      defaultValue,
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

    const getInitial = () => {
      if (value !== undefined) return Number(value);
      if (defaultValue !== undefined) return Number(defaultValue);
      return (Number(min) + Number(max)) / 2;
    };

    const [internalValue, setInternalValue] = useState<number>(getInitial);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? Number(value) : internalValue;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const numVal = parseFloat(e.target.value);
        if (!isControlled) {
          setInternalValue(numVal);
        }
        onChange?.(e);
      },
      [isControlled, onChange]
    );

    const displayValue = formatValue ? formatValue(currentValue) : String(currentValue);

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
        <div className={styles.rangeRow}>
          <input
            {...rest}
            {...inputAriaProps}
            ref={ref}
            id={inputId}
            type="range"
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            className={classNames(styles.input, inputClassName, className)}
            style={inputStyle}
          />
          {showValue && (
            <span className={styles.valueDisplay}>{displayValue}</span>
          )}
        </div>
        <div className={styles.rangeFooter}>
          <span>{min}</span>
          <span>{max}</span>
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

RangeInput.displayName = 'RangeInput';
