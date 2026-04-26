import React, { forwardRef, useState } from 'react';
import { classNames } from '../../../utils';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image source URL. */
  src?: string;
  /** Full name used for initials and the img `alt` attribute. */
  name?: string;
  /** Avatar size. Default: `'md'`. */
  size?: AvatarSize;
  /** Avatar shape. Default: `'circle'`. */
  shape?: AvatarShape;
  /** Presence status indicator. */
  status?: AvatarStatus;
  /** Fallback icon rendered when no image and no name are available. */
  fallbackIcon?: React.ReactNode;
  /** Derive a deterministic background color from the name. Default: `false`. */
  colorByName?: boolean;
  className?: string;
}

const BG_COLORS = [
  '#4f46e5', // indigo
  '#7c3aed', // violet
  '#db2777', // pink
  '#dc2626', // red
  '#d97706', // amber
  '#059669', // emerald
  '#0284c7', // sky
  '#0891b2', // cyan
  '#16a34a', // green
  '#9333ea', // purple
];

/** Derive initials (up to 2 chars) from a display name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/** Deterministic index into BG_COLORS based on the name string. */
function colorIndexFromName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash) % BG_COLORS.length;
}

/**
 * Displays a user avatar with image, initials, or a fallback icon.
 *
 * - Auto-derives initials from `name`.
 * - `colorByName` selects a deterministic background color.
 * - Failed image hides gracefully and falls back to initials/icon.
 * - Optional `status` indicator (online, offline, away, busy).
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    src,
    name,
    size = 'md',
    shape = 'circle',
    status,
    fallbackIcon,
    colorByName = false,
    className,
    style,
    ...rest
  },
  ref
) {
  const [imgError, setImgError] = useState(false);
  const showImg = Boolean(src) && !imgError;
  const initials = name ? getInitials(name) : undefined;

  const bgColor =
    colorByName && name ? BG_COLORS[colorIndexFromName(name)] : undefined;

  return (
    <span
      ref={ref}
      className={classNames(
        styles.avatar,
        styles[`size-${size}`],
        styles[`shape-${shape}`],
        className
      )}
      style={bgColor && !showImg ? { ...style, backgroundColor: bgColor } : style}
      aria-label={name}
      role="img"
      {...rest}
    >
      {showImg ? (
        <img
          src={src}
          alt={name ?? ''}
          className={styles.img}
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <span className={styles.initials} aria-hidden="true">
          {initials}
        </span>
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {fallbackIcon}
        </span>
      )}
      {status && (
        <span
          className={classNames(styles.status, styles[`status-${status}`])}
          aria-label={status}
        />
      )}
    </span>
  );
});
Avatar.displayName = 'Avatar';

// ---------------------------------------------------------------------------
// AvatarGroup
// ---------------------------------------------------------------------------

export interface AvatarGroupProps {
  /** Maximum number of avatars to show before overflow indicator. */
  max?: number;
  /** Size applied to all child avatars. Overrides individual avatar size. */
  size?: AvatarSize;
  /** Negative margin to create overlap between avatars. Default: `'-0.5rem'`. */
  spacing?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Accessible label for the group. Default: `'Avatar group'`. */
  'aria-label'?: string;
  /** ID of the element that labels the group. */
  'aria-labelledby'?: string;
}

/**
 * Renders a group of `<Avatar>` elements with overlap and an overflow count indicator.
 */
export function AvatarGroup({
  max,
  size = 'md',
  spacing = '-0.5rem',
  children,
  className,
  style,
  'aria-label': ariaLabel = 'Avatar group',
  'aria-labelledby': ariaLabelledBy,
}: AvatarGroupProps): React.ReactElement {
  const childArray = React.Children.toArray(children);
  const visible = max !== undefined ? childArray.slice(0, max) : childArray;
  const overflow = max !== undefined ? childArray.length - max : 0;

  return (
    <span
      className={classNames(styles.group, className)}
      style={style}
      role="group"
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {visible.map((child, idx) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<AvatarProps>, {
          size,
          key: (child as React.ReactElement).key ?? idx,
          style: {
            ...(child as React.ReactElement<AvatarProps>).props.style,
            marginLeft: idx === 0 ? undefined : spacing,
          },
        });
      })}
      {overflow > 0 && (
        <span
          className={classNames(styles.avatar, styles[`size-${size}`], styles['shape-circle'], styles.overflow)}
          style={{ marginLeft: spacing }}
          aria-label={`${overflow} more`}
          role="img"
        >
          <span className={styles.initials} aria-hidden="true">
            +{overflow}
          </span>
        </span>
      )}
    </span>
  );
}
AvatarGroup.displayName = 'AvatarGroup';
