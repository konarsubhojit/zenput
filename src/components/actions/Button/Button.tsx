import React, { forwardRef } from 'react';
import { classNames } from '../../../utils';
import styles from './Button.module.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'subtle'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant. Default: `'primary'`. */
  variant?: ButtonVariant;
  /** Size. Default: `'md'`. */
  size?: ButtonSize;
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Render as an icon-only square button. `aria-label` becomes required. */
  iconOnly?: boolean;
  /** When true, shows a spinner and marks the button busy/disabled. */
  loading?: boolean;
  /** Span the full available width. */
  fullWidth?: boolean;
  className?: string;
}

/**
 * Primary action primitive. Six variants (primary, secondary, subtle,
 * outline, ghost, danger), three sizes, icon slots, `iconOnly` and
 * `loading` states.
 *
 * When `loading` is true the button is both `disabled` and
 * `aria-busy="true"`, and its label is visually hidden while a spinner
 * is shown.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    iconOnly,
    loading,
    fullWidth,
    disabled,
    type = 'button',
    className,
    children,
    'aria-busy': ariaBusy,
    ...rest
  },
  ref
) {
  const isDisabled = Boolean(disabled || loading);
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading ? true : ariaBusy}
      className={classNames(
        styles.button,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        iconOnly ? styles.iconOnly : undefined,
        fullWidth ? styles.fullWidth : undefined,
        className
      )}
      {...rest}
    >
      {loading && (
        <span
          className={styles.spinner}
          role="status"
          aria-label="Loading"
          data-testid="button-spinner"
        />
      )}
      <span
        className={classNames(
          styles.content,
          loading ? styles.contentHidden : undefined
        )}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'inherit' }}
      >
        {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        {children}
        {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </span>
    </button>
  );
});
