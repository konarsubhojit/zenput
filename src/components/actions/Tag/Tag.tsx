import React, { forwardRef } from 'react';
import { classNames } from '../../../utils';
import { Button } from '../Button';
import styles from './Tag.module.css';

export type TagColor = 'brand' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
export type TagVariant = 'solid' | 'subtle' | 'outline';
export type TagSize = 'sm' | 'md' | 'lg';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic color. Default: `'neutral'`. */
  color?: TagColor;
  /** Visual variant. Default: `'subtle'`. */
  variant?: TagVariant;
  /** Size. Default: `'md'`. */
  size?: TagSize;
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Called when the remove button is clicked. When provided, a close button is shown. */
  onRemove?: () => void;
  /** Accessible label for the remove button. Default: `'Remove'`. */
  removeLabel?: string;
  /** When true, applies interactive (hover/focus) styles. */
  interactive?: boolean;
  className?: string;
}

/**
 * Interactive / closable tag / chip primitive. Distinct from `Badge` which is
 * read-only. Supports six semantic colors, three visual variants, and an
 * optional close button.
 *
 * The close button is an icon-only ghost `Button` — reusing the existing
 * button primitive so focus/keyboard behavior is consistent.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    color = 'neutral',
    variant = 'subtle',
    size = 'md',
    leftIcon,
    onRemove,
    removeLabel = 'Remove',
    interactive,
    className,
    children,
    onClick,
    ...rest
  },
  ref
) {
  const isInteractive = interactive || Boolean(onClick);
  return (
    <span
      ref={ref}
      className={classNames(
        styles.tag,
        styles[`color-${color}`],
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        isInteractive ? styles.interactive : undefined,
        className
      )}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(e as unknown as React.MouseEvent<HTMLSpanElement>);
              }
            }
          : undefined
      }
      {...rest}
    >
      {leftIcon && (
        <span className={styles.leftIcon} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          aria-label={removeLabel}
          className={styles.removeBtn}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <span aria-hidden="true">✕</span>
        </Button>
      )}
    </span>
  );
});
Tag.displayName = 'Tag';

/**
 * `Chip` is an alias for `Tag` to match alternative naming conventions.
 */
export const Chip = Tag;
