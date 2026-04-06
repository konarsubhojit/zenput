import React, { forwardRef, useRef, useState, useCallback, useEffect, useImperativeHandle } from 'react';
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
      previewSrc,
      uploading,
      uploadProgress,
      onChange,
      multiple,
      accept,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);

    // Always use internalRef for internal reads so that callback refs are supported.
    // Forward via useImperativeHandle so consumers with object or callback refs both work.
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const [fileNames, setFileNames] = useState<string[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);

    // Revoke the object-URL when it changes or the component unmounts.
    // Revocation happens only here (not inside setObjectUrl) to avoid double-revocation.
    useEffect(() => {
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [objectUrl]);

    const { inputId, helperId, labelProps, inputAriaProps } = useFormField({
      id,
      label,
      helperText,
      errorMessage,
      validationState,
      required,
      disabled,
    });

    const updatePreviewFromFiles = useCallback((files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setObjectUrl(URL.createObjectURL(file));
      }
    }, []);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && showFileNames) {
          setFileNames(Array.from(files).map((f) => f.name));
        }
        updatePreviewFromFiles(files);
        onChange?.(e);
      },
      [onChange, showFileNames, updatePreviewFromFiles]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
        if (disabled || !internalRef.current) return;
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && showFileNames) {
          setFileNames(Array.from(files).map((f) => f.name));
        }
        updatePreviewFromFiles(files);
        // Create synthetic change event
        const changeEvent = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(changeEvent);
      },
      [disabled, onChange, showFileNames, updatePreviewFromFiles]
    );

    const activeMessage = getValidationMessage(
      validationState,
      errorMessage,
      successMessage,
      warningMessage,
      helperText
    );

    const messageClass = getValidationMessageClass(validationState, styles);

    const activeSrc = objectUrl ?? previewSrc;
    const clampedProgress =
      uploadProgress !== undefined
        ? Math.min(100, Math.max(0, uploadProgress))
        : undefined;

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
          ref={internalRef}
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
            onClick={() => !disabled && internalRef.current?.click()}
            onKeyDown={(e) => {
              if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                internalRef.current?.click();
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
            onClick={() => internalRef.current?.click()}
            aria-controls={inputId}
          >
            📁 {buttonLabel}
          </button>
        )}
        {activeSrc && (
          <div className={styles.imagePreview}>
            <img
              src={activeSrc}
              alt={typeof label === 'string' && label.trim() ? `${label} preview` : 'Selected image preview'}
              className={styles.previewImage}
            />
          </div>
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
        {(uploading || clampedProgress !== undefined) && (
          <div
            className={styles.uploadProgress}
            role="progressbar"
            aria-valuenow={uploading ? undefined : clampedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={classNames(styles.uploadProgressBar, uploading ? styles.uploadProgressIndeterminate : undefined)}
              style={clampedProgress !== undefined && !uploading ? { width: `${clampedProgress}%` } : undefined}
            />
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
