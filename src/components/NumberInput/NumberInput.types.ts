import React from 'react';
import { BaseInputProps } from '../../types';

interface NumberInputBaseProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'>,
    BaseInputProps {
  /** Current value */
  value?: number;
  /** Default value */
  defaultValue?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Hide the increment/decrement buttons */
  hideControls?: boolean;
  /**
   * Optional formatter applied to the displayed value while the input is not
   * focused. The underlying model value is always the raw number.
   * Example: `(v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' })`
   */
  formatValue?: (value: number) => string;
}

/**
 * Default mode: the field may be empty, so `onChange` receives `number | undefined`.
 *
 * @deprecated The default will flip to `allowEmpty: false` in the next major version.
 *   Opt in now via `allowEmpty={false}` to avoid a breaking change later.
 */
export type NumberInputAllowEmptyProps = NumberInputBaseProps & {
  /**
   * When `true` (default) the input is allowed to be empty and `onChange` may
   * receive `undefined`. Set to `false` to ensure `onChange` always receives a
   * concrete `number`.
   */
  allowEmpty?: true;
  /** Not available in allow-empty mode. Use `allowEmpty={false}` to enable. */
  fallbackValue?: never;
  /** Called when the value changes. Receives `undefined` when the field is empty. */
  onChange?: (value: number | undefined) => void;
};

/**
 * Strict mode (`allowEmpty={false}`): the field always produces a concrete
 * `number`. When the raw input is empty, the emitted value is resolved in
 * this order:
 *   1. `fallbackValue` (if provided), clamped to `[min, max]`
 *   2. `min` (if provided)
 *   3. `0`
 */
export type NumberInputNoEmptyProps = NumberInputBaseProps & {
  /**
   * When `false`, the input never emits `undefined`. Empty/intermediate input
   * is immediately resolved to a concrete number via `fallbackValue`, `min`,
   * or `0` (in that order), then clamped to `[min, max]`.
   */
  allowEmpty: false;
  /**
   * Value emitted when the field is empty and `allowEmpty` is `false`.
   * Clamped to `[min, max]` before emission. When omitted, `min ?? 0` is used.
   */
  fallbackValue?: number;
  /** Called when the value changes. Always receives a concrete `number`. */
  onChange?: (value: number) => void;
};

export type NumberInputProps = NumberInputAllowEmptyProps | NumberInputNoEmptyProps;
