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
  /**
   * Accessible label announced while `loading` is true. Provide a
   * localized string. Default: `'Loading'`.
   */
  loadingLabel?: string;
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
 * `aria-busy="true"`. The label is visually hidden and marked
 * `aria-hidden` to avoid stale announcements, while a live region
 * exposes `loadingLabel` (default `'Loading'`) to assistive tech.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    iconOnly,
    loading,
    loadingLabel = 'Loading',
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
        <>
          <span
            className={styles.spinner}
            aria-hidden="true"
            data-testid="button-spinner"
          />
          <span role="status" className={styles.srOnly}>
            {loadingLabel}
          </span>
        </>
      )}
      <span
        aria-hidden={loading ? true : undefined}
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
