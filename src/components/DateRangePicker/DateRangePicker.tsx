import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { DateRange, DateRangePickerProps } from './DateRangePicker.types';
import { Calendar } from '../Calendar/Calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  usePopoverState,
} from '../overlay/Popover/Popover';
import { classNames } from '../../utils';
import { useFormField } from '../../hooks';
import inputStyles from '../DateInput/DateInput.module.css';
import styles from './DateRangePicker.module.css';

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

// ---------------------------------------------------------------------------
// Inner panel — reads Popover context to close on complete selection
// ---------------------------------------------------------------------------

interface DateRangePickerPanelProps {
  value: DateRange;
  onSelect: (date: Date) => void;
  onPreset: (range: DateRange) => void;
  phase: 0 | 1;
  hoverDate: Date | null;
  onHover: (date: Date | null) => void;
  leftMonth: Date;
  rightMonth: Date;
  onLeftMonthChange: (m: Date) => void;
  onRightMonthChange: (m: Date) => void;
  min?: Date;
  max?: Date;
  disabledDates?: (d: Date) => boolean;
  locale: string;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  presets?: { label: string; range: DateRange }[];
}

function DateRangePickerPanel({
  value,
  onSelect,
  onPreset,
  phase,
  leftMonth,
  rightMonth,
  onLeftMonthChange,
  onRightMonthChange,
  min,
  max,
  disabledDates,
  locale,
  weekStartsOn,
  presets,
}: DateRangePickerPanelProps): React.ReactElement {
  return (
    <div className={styles.panel}>
      {presets && presets.length > 0 && (
        <div className={styles.presets}>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              className={styles.presetBtn}
              onClick={() => onPreset(p.range)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      {phase === 1 && (
        <p className={styles.hint}>Now select an end date</p>
      )}
      <div className={styles.calendars}>
        <Calendar
          month={leftMonth}
          onMonthChange={onLeftMonthChange}
          value={value.start ?? undefined}
          onChange={onSelect}
          min={min}
          max={max}
          disabledDates={disabledDates}
          locale={locale}
          weekStartsOn={weekStartsOn}
          highlightToday
        />
        <Calendar
          month={rightMonth}
          onMonthChange={(m) => {
            onRightMonthChange(m);
            onLeftMonthChange(new Date(m.getFullYear(), m.getMonth() - 1, 1));
          }}
          value={value.end ?? undefined}
          onChange={onSelect}
          min={min}
          max={max}
          disabledDates={disabledDates}
          locale={locale}
          weekStartsOn={weekStartsOn}
          highlightToday
        />
      </div>
    </div>
  );
}

// Panel wrapper that also closes the popover when presets are selected
// and after the end date is selected (range complete).
function DateRangePickerPanelWrapper(props: DateRangePickerPanelProps & { onSelectWithClose: (date: Date) => void }): React.ReactElement {
  const { setOpen } = usePopoverState();
  const { onSelectWithClose: _, ...panelProps } = props;

  const handlePreset = useCallback(
    (range: DateRange) => {
      panelProps.onPreset(range);
      setOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [panelProps.onPreset, setOpen]
  );

  const handleSelect = useCallback(
    (date: Date) => {
      props.onSelectWithClose(date);
      // Close only when completing the range (phase 1 → done).
      // The parent calls setPhase(0) after the second click; we close here.
      if (props.phase === 1) {
        setOpen(false);
      }
    },
    [props, setOpen]
  );

  return <DateRangePickerPanel {...panelProps} onSelect={handleSelect} onPreset={handlePreset} />;
}

// ---------------------------------------------------------------------------
// DateRangePicker
// ---------------------------------------------------------------------------

export function DateRangePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  min,
  max,
  disabledDates,
  locale = 'en-US',
  format = { dateStyle: 'medium' } as Intl.DateTimeFormatOptions,
  presets,
  placeholder = 'Select date range\u2026',
  weekStartsOn = 0,
  clearable = false,
  disabled = false,
  readOnly = false,
  id,
  label,
  helperText,
  errorMessage,
  successMessage,
  warningMessage,
  required,
  validationState = 'default',
  size = 'md',
  variant = 'outlined',
  wrapperClassName,
  wrapperStyle,
  labelClassName,
  labelStyle,
  helperTextClassName,
  helperTextStyle,
}: DateRangePickerProps): React.ReactElement {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<DateRange>(
    defaultValue ?? { start: null, end: null }
  );
  const emptyRange = useMemo<DateRange>(() => ({ start: null, end: null }), []);
  const value: DateRange = isControlled
    ? (controlledValue ?? emptyRange)
    : internalValue;

  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  // Phase is derived from value: if start is set but end is null we're in
  // "waiting for end date" mode (phase 1), otherwise we start fresh (phase 0).
  const derivedPhase = (value.start && !value.end) ? 1 : 0;
  const [phase, setPhase] = useState<0 | 1>(derivedPhase);

  const now = new Date();
  const [leftMonth, setLeftMonth] = useState<Date>(
    value.start
      ? new Date(value.start.getFullYear(), value.start.getMonth(), 1)
      : new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [rightMonth, setRightMonth] = useState<Date>(
    new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1)
  );

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
      if (phase === 0) {
        const next: DateRange = { start: date, end: null };
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
        setPhase(1);
      } else {
        const start = value.start;
        let next: DateRange;
        if (start && date < start) {
          next = { start: date, end: start };
        } else {
          next = { start, end: date };
        }
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
        setPhase(0);
      }
    },
    [phase, value.start, isControlled, onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const next: DateRange = { start: null, end: null };
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
      setPhase(0);
    },
    [isControlled, onChange]
  );

  const handlePreset = useCallback(
    (range: DateRange) => {
      if (!isControlled) setInternalValue(range);
      onChange?.(range);
      setPhase(0);
    },
    [isControlled, onChange]
  );

  const displayText = useMemo(() => {
    const { start, end } = value;
    if (!start && !end) return '';
    const startStr = formatDate(start, locale, format);
    const endStr = end ? formatDate(end, locale, format) : '\u2026';
    return `${startStr} \u2013 ${endStr}`;
  }, [value, locale, format]);

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
        <div className={inputStyles.inputWrapper} style={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}>
          <PopoverTrigger
            id={inputId}
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
          {clearable && (value.start || value.end) && !disabled && !readOnly && (
            <button
              type="button"
              aria-label="Clear date range"
              className={styles.clearBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClear(e);
              }}
            >
              \u2715
            </button>
          )}
        </div>

        <PopoverContent
          side="bottom"
          align="start"
          aria-label="Date range picker calendar"
        >
          <DateRangePickerPanelWrapper
            value={value}
            onSelect={handleSelect}
            onSelectWithClose={handleSelect}
            onPreset={handlePreset}
            phase={phase}
            hoverDate={hoverDate}
            onHover={setHoverDate}
            leftMonth={leftMonth}
            rightMonth={rightMonth}
            onLeftMonthChange={setLeftMonth}
            onRightMonthChange={setRightMonth}
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

DateRangePicker.displayName = 'DateRangePicker';
