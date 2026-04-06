import { BaseInputProps } from '../../types';

export interface CurrencyOption {
  /** ISO 4217 currency code (e.g. 'USD') */
  code: string;
  /** Currency symbol (e.g. '$') */
  symbol: string;
  /** Human-readable label (e.g. 'US Dollar') */
  label: string;
}

export interface MoneyInputProps
  extends Omit<BaseInputProps, 'prefixIcon' | 'suffixIcon'> {
  /** List of supported currencies */
  currencies: CurrencyOption[];
  /** Currently selected currency code (controlled) */
  currency?: string;
  /** Default currency code (uncontrolled) */
  defaultCurrency?: string;
  /** Called when the selected currency changes */
  onCurrencyChange?: (code: string) => void;
  /** Numeric amount value (controlled) */
  value?: number;
  /** Default numeric amount (uncontrolled) */
  defaultValue?: number;
  /** Called when the amount value changes */
  onChange?: (value: number | undefined) => void;
  /** Minimum amount */
  min?: number;
  /** Maximum amount */
  max?: number;
  /** Step increment for the amount field */
  step?: number;
  /** Placeholder text for the amount field */
  placeholder?: string;
  /** HTML id for the amount input; auto-generated if omitted */
  id?: string;
}
