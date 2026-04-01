import React, { forwardRef, useState, useCallback } from 'react';
import { PhoneInputProps, CountryCode } from './PhoneInput.types';
import { classNames } from '../../utils';
import { useFormField } from '../../hooks';
import styles from './PhoneInput.module.css';

const DEFAULT_COUNTRIES: CountryCode[] = [
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brazil' },
];

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
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
      dialCode,
      defaultDialCode = '+1',
      countries = DEFAULT_COUNTRIES,
      onChange,
      phoneValue,
      placeholder = '(555) 000-0000',
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

    const [internalDial, setInternalDial] = useState(defaultDialCode);
    const [internalPhone, setInternalPhone] = useState('');

    const isDialControlled = dialCode !== undefined;
    const isPhoneControlled = phoneValue !== undefined;

    const currentDial = isDialControlled ? dialCode : internalDial;
    const currentPhone = isPhoneControlled ? phoneValue : internalPhone;

    const handleDialChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDial = e.target.value;
        if (!isDialControlled) setInternalDial(newDial);
        onChange?.(currentPhone, newDial);
      },
      [isDialControlled, currentPhone, onChange]
    );

    const handlePhoneChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhone = e.target.value.replace(/[^\d\s\-().+]/g, '');
        if (!isPhoneControlled) setInternalPhone(newPhone);
        onChange?.(newPhone, currentDial);
      },
      [isPhoneControlled, currentDial, onChange]
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
        <div
          className={classNames(
            styles.inputWrapper,
            disabled ? styles.disabledWrapper : undefined
          )}
        >
          <select
            className={styles.dialCodeSelect}
            value={currentDial}
            onChange={handleDialChange}
            disabled={disabled}
            aria-label="Country dial code"
          >
            {countries.map((c) => (
              <option key={`${c.code}-${c.dialCode}`} value={c.dialCode}>
                {c.flag} {c.dialCode}
              </option>
            ))}
          </select>
          <input
            {...rest}
            {...inputAriaProps}
            ref={ref}
            id={inputId}
            type="tel"
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            value={currentPhone}
            onChange={handlePhoneChange}
            className={classNames(styles.phoneInput, inputClassName, className)}
            style={inputStyle}
          />
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

PhoneInput.displayName = 'PhoneInput';
