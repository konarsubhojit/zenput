import React, { useCallback, useMemo, useState } from 'react';
import { DatePickerProps } from './DatePicker.types';
import { Calendar } from '../Calendar/Calendar';
import { DateInput } from '../DateInput/DateInput';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  usePopoverState,
} from '../overlay/Popover/Popover';
import { classNames } from '../../utils';
import { useFormField } from '../../hooks';
import inputStyles from '../DateInput/DateInput.module.css';
import styles from './DatePicker.module.css';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(
  date: Date | null | undefined,
  locale: string,
  opts: Intl.DateTimeFormatOptions
): string {
  if (!date) return '';
  return new Intl.DateTimeFormat(locale, opts).format(date);
}

/** Timezone-safe local date-only string in YYYY-MM-DD format. */
function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isTouchDevice(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}

// ---------------------------------------------------------------------------
// Inner panel — needs Popover context to close after selection
// ---------------------------------------------------------------------------

interface DatePickerPanelProps {
  value: Date | null;
  onSelect: (date: Date) => void;
  min?: Date;
  max?: Date;
  disabledDates?: (date: Date) => boolean;
  locale: string;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  presets?: { label: string; date: Date }[];
}

function DatePickerPanel({
  value,
  onSelect,
  min,
  max,
  disabledDates,
  locale,
  weekStartsOn,
  presets,
}: DatePickerPanelProps): React.ReactElement {
  const { setOpen } = usePopoverState();

  const handleSelect = useCallback(
    (date: Date) => {
      onSelect(date);
      setOpen(false);
    },
    [onSelect, setOpen]
  );

  return (
    <div className={styles.panel}>
      {presets && presets.length > 0 && (
        <div className={styles.presets}>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              className={styles.presetBtn}
              onClick={() => handleSelect(p.date)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <Calendar
        value={value ?? undefined}
        onChange={handleSelect}
        min={min}
        max={max}
        disabledDates={disabledDates}
        locale={locale}
        weekStartsOn={weekStartsOn}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// DatePicker
// ---------------------------------------------------------------------------

export function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  format = { dateStyle: 'medium' } as Intl.DateTimeFormatOptions,
  locale = 'en-US',
  min,
  max,
  disabledDates,
  presets,
  clearable = false,
  placeholder = 'Select date\u2026',
  weekStartsOn = 0,
  nativeFallback = false,
  disabled = false,
  readOnly = false,
  size = 'md',
  variant = 'outlined',
  validationState = 'default',
  label,
  helperText,
  errorMessage,
  successMessage,
  warningMessage,
  required,
  id,
  wrapperClassName,
  wrapperStyle,
  labelClassName,
  labelStyle,
  helperTextClassName,
  helperTextStyle,
}: DatePickerProps): React.ReactElement {
  // Controlled vs uncontrolled state.
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null);
  const value = isControlled ? (controlledValue ?? null) : internalValue;

  const { inputId, helperId, labelProps, inputAriaProps } = useFormField({
    id,
    label,
    helperText,
    errorMessage,
    validationState,
    required,
    disabled,
  });

  const handleSelect = useCallback(
    (date: Date) => {
      if (!isControlled) setInternalValue(date);
      onChange?.(date);
    },
    [isControlled, onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isControlled) setInternalValue(null);
      onChange?.(null);
    },
    [isControlled, onChange]
  );

  const displayText = useMemo(
    () => formatDate(value, locale, format),
    [value, locale, format]
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
      ? inputStyles.errorText
      : validationState === 'success'
        ? inputStyles.successText
        : validationState === 'warning'
          ? inputStyles.warningText
          : inputStyles.helperText;

  // On touch devices with nativeFallback, render the simpler DateInput.
  if (nativeFallback && isTouchDevice()) {
    return (
      <DateInput
        id={id}
        label={label}
        helperText={helperText}
        errorMessage={errorMessage}
        successMessage={successMessage}
        warningMessage={warningMessage}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        size={size}
        variant={variant}
        validationState={validationState}
        min={min ? toLocalDateStr(min) : undefined}
        max={max ? toLocalDateStr(max) : undefined}
        value={value ? toLocalDateStr(value) : undefined}
        onChange={(e) => {
          const d = e.target.value ? new Date(e.target.value + 'T00:00:00') : null;
          if (!isControlled) setInternalValue(d);
          onChange?.(d);
        }}
      />
    );
  }

  return (
    <div
      className={classNames(
        inputStyles.wrapper,
        inputStyles[size],
        inputStyles[variant],
        validationState !== 'default' ? inputStyles[validationState] : undefined,
        wrapperClassName
      )}
      style={wrapperStyle}
    >
      {label && (
        <label
          {...labelProps}
          className={classNames(
            inputStyles.label,
            required ? inputStyles.required : undefined,
            labelClassName
          )}
          style={labelStyle}
        >
          {label}
        </label>
      )}

      <Popover>
        <div className={classNames(inputStyles.inputWrapper, styles.triggerWrap)}>
          <PopoverTrigger
            id={inputId}
            aria-label={label ? undefined : placeholder}
            disabled={disabled || readOnly}
            {...inputAriaProps}
            className={classNames(
              inputStyles.input,
              styles.trigger,
              !displayText ? styles.placeholder : undefined
            )}
          >
            <span className={styles.triggerText}>{displayText || placeholder}</span>
            <span className={styles.triggerIcons}>
              <span aria-hidden className={styles.calIcon}>
                \uD83D\uDCC5
              </span>
            </span>
          </PopoverTrigger>
          {clearable && value && !disabled && !readOnly && (
            <button
              type="button"
              aria-label="Clear date"
              className={styles.clearBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={handleClear}
            >
              \u2715
            </button>
          )}
        </div>

        <PopoverContent side="bottom" align="start" aria-label="Date picker calendar">
          <DatePickerPanel
            value={value}
            onSelect={handleSelect}
            min={min}
            max={max}
            disabledDates={disabledDates}
            locale={locale}
            weekStartsOn={weekStartsOn}
            presets={presets}
          />
        </PopoverContent>
      </Popover>

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

DatePicker.displayName = 'DatePicker';
