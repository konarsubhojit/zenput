import React from 'react';
import { classNames } from '../../../utils';
import styles from './Breadcrumbs.module.css';
import type { BreadcrumbsProps } from './Breadcrumbs.types';

/**
 * Breadcrumb navigation that communicates the current page location.
 * Implements the WAI-ARIA Breadcrumb pattern:
 * — a `<nav aria-label="Breadcrumb">` landmark
 * — an ordered list of items
 * — `aria-current="page"` on the last (current) item
 */
export function Breadcrumbs({
  items,
  'aria-label': ariaLabel = 'Breadcrumb',
  separator = '/',
  className,
  style,
}: BreadcrumbsProps): React.ReactElement {
  return (
    <nav aria-label={ariaLabel} className={classNames(styles.breadcrumbs, className)} style={style}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          const LinkEl: React.ElementType = item.as ?? 'a';

          return (
            <li key={index} className={styles.item}>
              {item.href && !isCurrent ? (
                <LinkEl
                  href={item.href}
                  className={styles.link}
                  {...item.linkProps}
                >
                  {item.label}
                </LinkEl>
              ) : (
                <span
                  className={classNames(styles.text, isCurrent ? styles.current : undefined)}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isCurrent && (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
Breadcrumbs.displayName = 'Breadcrumbs';
