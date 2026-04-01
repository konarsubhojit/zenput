import React from 'react';
import { BaseInputProps } from '../../types';

export interface CountryCode {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'>,
    BaseInputProps {
  /** Selected dial code (e.g. "+1") */
  dialCode?: string;
  /** Default dial code */
  defaultDialCode?: string;
  /** List of country codes to show */
  countries?: CountryCode[];
  /** Called when the full phone value changes */
  onChange?: (phoneNumber: string, dialCode: string) => void;
  /** Current phone number value (without dial code) */
  phoneValue?: string;
}
