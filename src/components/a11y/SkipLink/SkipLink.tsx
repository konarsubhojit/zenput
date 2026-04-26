import React from 'react';
import { classNames } from '../../../utils';
import styles from './SkipLink.module.css';

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target element id to skip to. Default: `'#main'`. */
  href?: string;
  /** Link label. Default: `'Skip to main content'`. */
  children?: React.ReactNode;
}

/**
 * A keyboard-only visible anchor that becomes visible when it receives
 * focus (via Tab). Helps keyboard users skip repetitive navigation.
 *
 * Place it as the very first focusable element in your app:
 *
 * ```tsx
 * <SkipLink href="#main" />
 * <nav>…</nav>
 * <main id="main">…</main>
 * ```
 */
export function SkipLink({
  href = '#main',
  children = 'Skip to main content',
  className,
  ...rest
}: SkipLinkProps): React.ReactElement {
  return (
    <a href={href} className={classNames(styles.skipLink, className)} {...rest}>
      {children}
    </a>
  );
}

SkipLink.displayName = 'SkipLink';
