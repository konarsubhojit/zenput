'use client';
import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import { FileInputProps } from './FileInput.types';
import { classNames, getValidationMessage, getValidationMessageClass } from '../../utils';
import { useFormField } from '../../hooks';
import { useLocale } from '../../locales/LocaleContext';
import styles from './FileInput.module.css';

function clampFileCount(files: File[], maxFiles: number | undefined): { files: File[]; exceeded: boolean } {
  if (maxFiles === undefined) return { files, exceeded: false };
  if (maxFiles <= 0) return { files: [], exceeded: files.length > 0 };
  if (files.length <= maxFiles) return { files, exceeded: false };
  return { files: files.slice(0, maxFiles), exceeded: true };
}

function normalizeFiles(files: FileList | null): File[] {
  if (!files || files.length === 0) return [];
  return Array.from(files);
}

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
      buttonLabel,
      showFileNames = true,
      dropzone,
      value,
      maxFiles,
      previewSrc,
      uploading,
      uploadProgress,
      onChange: nativeOnChange,
      onFilesChange,
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

    const { t } = useLocale();

    const [uncontrolledFiles, setUncontrolledFiles] = useState<File[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);
    const [maxFilesError, setMaxFilesError] = useState<string | undefined>(undefined);
    const fileKeyMapRef = useRef(new WeakMap<File, string>());
    const fileKeyCounterRef = useRef(0);

    const selectedFiles = value ?? uncontrolledFiles;

    const updateFiles = useCallback(
      (next: File[]) => {
        if (value === undefined) {
          setUncontrolledFiles(next);
        }
        onFilesChange?.(next);
      },
      [onFilesChange, value]
    );

    const getFileKey = useCallback((file: File) => {
      let key = fileKeyMapRef.current.get(file);
      if (!key) {
        fileKeyCounterRef.current += 1;
        key = `${file.name}-${file.size}-${file.lastModified}-${fileKeyCounterRef.current}`;
        fileKeyMapRef.current.set(file, key);
      }
      return key;
    }, []);

    // Revoke the object-URL when it changes or the component unmounts.
    // Revocation happens only here (not inside setObjectUrl) to avoid double-revocation.
    useEffect(() => {
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [objectUrl]);

    const effectiveValidationState = maxFilesError ? 'error' : validationState;
    const effectiveErrorMessage = maxFilesError ?? errorMessage;

    const { inputId, helperId, labelProps, inputAriaProps } = useFormField({
      id,
      label,
      helperText,
      errorMessage: effectiveErrorMessage,
      validationState: effectiveValidationState,
      required,
      disabled,
    });

    useEffect(() => {
      if (selectedFiles.length === 0) {
        setObjectUrl(undefined);
        return;
      }
      const file = selectedFiles[0];
      if (file && file.type.startsWith('image/')) {
        setObjectUrl(URL.createObjectURL(file));
      } else {
        setObjectUrl(undefined);
      }
    }, [selectedFiles]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        nativeOnChange?.(e);
        const newlyPicked = normalizeFiles(e.target.files);
        if (newlyPicked.length === 0) return;

        const next = multiple ? [...selectedFiles, ...newlyPicked] : [newlyPicked[0]];
        const { files: clamped, exceeded } = clampFileCount(next, maxFiles);
        setMaxFilesError(
          exceeded ? t('fileInput.maxFilesExceeded', { max: maxFiles ?? 0 }) : undefined
        );

        updateFiles(clamped);

        // Allow re-selecting the same file(s) again after removal/reorder.
        if (internalRef.current) {
          internalRef.current.value = '';
        }
      },
      [maxFiles, multiple, nativeOnChange, selectedFiles, t, updateFiles]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsDragActive(false);
        if (disabled || !internalRef.current) return;
        const dt = e.dataTransfer;
        const dropped = normalizeFiles(dt.files);
        if (dropped.length === 0) return;

        const next = multiple ? [...selectedFiles, ...dropped] : [dropped[0]];
        const { files: clamped, exceeded } = clampFileCount(next, maxFiles);
        setMaxFilesError(
          exceeded ? t('fileInput.maxFilesExceeded', { max: maxFiles ?? 0 }) : undefined
        );
        updateFiles(clamped);

        // Allow re-selecting the same file(s) again after removal/reorder.
        if (internalRef.current) {
          internalRef.current.value = '';
        }
      },
      [disabled, maxFiles, multiple, selectedFiles, t, updateFiles]
    );

    const activeMessage = getValidationMessage(
      effectiveValidationState,
      effectiveErrorMessage,
      successMessage,
      warningMessage,
      helperText
    );

    const messageClass = getValidationMessageClass(effectiveValidationState, styles);

    const activeSrc = objectUrl ?? previewSrc;
    const clampedProgress = uploadProgress && Math.min(100, Math.max(0, uploadProgress));
    const messageRole = effectiveValidationState === 'error' ? 'alert' : 'status';

    const handleRemove = useCallback(
      (index: number) => {
        const next = selectedFiles.filter((_, i) => i !== index);
        setMaxFilesError(undefined);
        updateFiles(next);
        if (internalRef.current) internalRef.current.value = '';
      },
      [selectedFiles, updateFiles]
    );

    const handleMove = useCallback(
      (from: number, to: number) => {
        if (to < 0 || to >= selectedFiles.length) return;
        const next = [...selectedFiles];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        updateFiles(next);
        if (internalRef.current) internalRef.current.value = '';
      },
      [selectedFiles, updateFiles]
    );

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
            className={classNames(
              styles.label,
              required ? styles.required : undefined,
              labelClassName
            )}
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
          <button
            type="button"
            aria-label={buttonLabel ?? t('fileInput.chooseFile')}
            disabled={disabled}
            className={classNames(
              styles.dropzone,
              isDragActive ? styles.dropzoneActive : undefined,
              disabled ? styles.dropzoneDisabled : undefined
            )}
            onClick={() => !disabled && internalRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
          >
            <span>📁 {buttonLabel ?? t('fileInput.chooseFile')}</span>
            <span className={styles.dropzoneHint}>{t('fileInput.dragAndDropHint')}</span>
          </button>
        ) : (
          <button
            type="button"
            className={styles.fileButton}
            disabled={disabled}
            onClick={() => internalRef.current?.click()}
            aria-controls={inputId}
          >
            📁 {buttonLabel ?? t('fileInput.chooseFile')}
          </button>
        )}
        {activeSrc && (
          <div className={styles.imagePreview}>
            <img
              src={activeSrc}
              alt={
                typeof label === 'string' && label.trim()
                  ? `${label} preview`
                  : 'Selected image preview'
              }
              className={styles.previewImage}
            />
          </div>
        )}
        {showFileNames && selectedFiles.length > 0 && (
          <ul className={styles.fileList}>
            {selectedFiles.map((file, index) => (
              <li key={getFileKey(file)} className={styles.fileListItem}>
                <span className={styles.fileName}>📄 {file.name}</span>
                <div className={styles.fileActions}>
                  <button
                    type="button"
                    className={styles.fileActionButton}
                    aria-label={t('fileInput.moveFileUp', { name: file.name })}
                    disabled={index === 0}
                    onClick={() => handleMove(index, index - 1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={styles.fileActionButton}
                    aria-label={t('fileInput.moveFileDown', { name: file.name })}
                    disabled={index === selectedFiles.length - 1}
                    onClick={() => handleMove(index, index + 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={styles.fileActionButton}
                    aria-label={t('fileInput.removeFile', { name: file.name })}
                    onClick={() => handleRemove(index)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {(uploading || clampedProgress !== undefined) && (
          <progress
            className={classNames(
              styles.uploadProgress,
              uploading ? styles.uploadProgressIndeterminate : undefined
            )}
            aria-label="Upload progress"
            max={100}
            value={uploading ? undefined : clampedProgress}
          />
        )}
        {activeMessage && (
          <span
            id={helperId}
            role={messageRole}
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
