import React, { forwardRef, useRef, useCallback } from 'react';
import { TextAreaProps } from './TextArea.types';
import { classNames } from '../../utils';
import { useFormField } from '../../hooks';
import styles from './TextArea.module.css';

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      readOnly,
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
      autoResize,
      showCharCount,
      maxLength,
      value,
      defaultValue,
      onChange,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? internalRef;

    const { inputId, helperId, labelProps, inputAriaProps } = useFormField({
      id,
      label,
      helperText,
      errorMessage,
      validationState,
      required,
      disabled,
    });

    const [charCount, setCharCount] = React.useState<number>(() => {
      const initial = value ?? defaultValue ?? '';
      return String(initial).length;
    });

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
        if (autoResize && textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
        onChange?.(e);
      },
      [autoResize, onChange, textareaRef]
    );

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

    const isExceeded = maxLength !== undefined && charCount > maxLength;

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
          <textarea
            {...rest}
            {...inputAriaProps}
            ref={textareaRef}
            id={inputId}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            className={classNames(
              styles.input,
              autoResize ? styles.autoResize : undefined,
              inputClassName,
              className
            )}
            style={inputStyle}
          />
        </div>
        {(activeMessage || showCharCount) && (
          <div className={styles.footer}>
            {activeMessage ? (
              <span
                id={helperId}
                className={classNames(messageClass, helperTextClassName)}
                style={helperTextStyle}
              >
                {activeMessage}
              </span>
            ) : (
              <span />
            )}
            {showCharCount && (
              <span className={classNames(styles.charCount, isExceeded ? styles.charCountExceeded : undefined)}>
                {maxLength !== undefined ? `${charCount}/${maxLength}` : charCount}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
