import React, { forwardRef, useRef, useState, useCallback } from 'react';
import { FileInputProps } from './FileInput.types';
import { classNames, getValidationMessage, getValidationMessageClass } from '../../utils';
import { useFormField } from '../../hooks';
import styles from './FileInput.module.css';

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
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
      buttonLabel = 'Choose file',
      showFileNames = true,
      dropzone,
      onChange,
      multiple,
      accept,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const fileRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef;

    const [fileNames, setFileNames] = useState<string[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);

    const { inputId, helperId, labelProps, inputAriaProps } = useFormField({
      id,
      label,
      helperText,
      errorMessage,
      validationState,
      required,
      disabled,
    });

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && showFileNames) {
          setFileNames(Array.from(files).map((f) => f.name));
        }
        onChange?.(e);
      },
      [onChange, showFileNames]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
        if (disabled || !fileRef.current) return;
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && showFileNames) {
          setFileNames(Array.from(files).map((f) => f.name));
        }
        // Create synthetic change event
        const changeEvent = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(changeEvent);
      },
      [disabled, fileRef, onChange, showFileNames]
    );

    const activeMessage = getValidationMessage(
      validationState,
      errorMessage,
      successMessage,
      warningMessage,
      helperText
    );

    const messageClass = getValidationMessageClass(validationState, styles);

    return (
      <div
        className={classNames(
          styles.wrapper,
          styles[size],
          validationState === 'error' ? styles.error : undefined,
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
        <input
          {...rest}
          {...inputAriaProps}
          ref={fileRef}
          id={inputId}
          type="file"
          disabled={disabled}
          required={required}
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className={classNames(styles.nativeInput, inputClassName, className)}
          style={inputStyle}
        />
        {dropzone ? (
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={buttonLabel}
            aria-disabled={disabled}
            className={classNames(
              styles.dropzone,
              isDragActive ? styles.dropzoneActive : undefined,
              disabled ? styles.dropzoneDisabled : undefined
            )}
            onClick={() => !disabled && fileRef.current?.click()}
            onKeyDown={(e) => {
              if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                fileRef.current?.click();
              }
            }}
            onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
          >
            <div>📁 {buttonLabel}</div>
            <p className={styles.dropzoneHint}>or drag and drop files here</p>
          </div>
        ) : (
          <button
            type="button"
            className={styles.fileButton}
            disabled={disabled}
            onClick={() => fileRef.current?.click()}
            aria-controls={inputId}
          >
            📁 {buttonLabel}
          </button>
        )}
        {showFileNames && fileNames.length > 0 && (
          <div className={styles.fileNames}>
            {fileNames.map((name) => (
              <div key={name} className={styles.fileName}>
                📄 {name}
              </div>
            ))}
          </div>
        )}
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

FileInput.displayName = 'FileInput';
