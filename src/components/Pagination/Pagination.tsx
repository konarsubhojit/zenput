import React from 'react';
import { classNames } from '../../utils';
import type { PaginationProps } from './Pagination.types';
import styles from './Pagination.module.css';

/**
 * Builds the array of page items (numbers or 'ellipsis' sentinels) to render.
 * Always shows the first and last page, `boundaryCount` pages at each end,
 * and `siblingCount` pages on each side of the current page.
 */
export function buildPaginationItems(
  current: number,
  total: number,
  siblingCount = 1,
  boundaryCount = 1
): (number | 'ellipsis')[] {
  if (total <= 0) return [];

  // When total pages is small enough to show all without ellipsis, return them all.
  const threshold = 2 * boundaryCount + 2 * siblingCount + 3;
  if (total <= threshold) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Clamp current to valid range.
  const clamped = Math.min(Math.max(current, 1), total);

  // Build the full set of page numbers that should always be visible.
  const startPages = Array.from({ length: boundaryCount }, (_, i) => i + 1);
  const endPages = Array.from({ length: boundaryCount }, (_, i) => total - boundaryCount + 1 + i);

  const siblingsStart = Math.max(
    boundaryCount + 1,
    clamped - siblingCount
  );
  const siblingsEnd = Math.min(
    total - boundaryCount,
    clamped + siblingCount
  );

  const siblingPages = Array.from(
    { length: Math.max(0, siblingsEnd - siblingsStart + 1) },
    (_, i) => siblingsStart + i
  );

  // Combine into a sorted unique list.
  const allPages = Array.from(
    new Set([...startPages, ...siblingPages, ...endPages])
  ).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  // Insert 'ellipsis' sentinels between non-consecutive runs.
  const items: (number | 'ellipsis')[] = [];
  for (let i = 0; i < allPages.length; i++) {
    if (i > 0 && allPages[i] - allPages[i - 1] > 1) {
      items.push('ellipsis');
    }
    items.push(allPages[i]);
  }

  return items;
}

const SIZE_CLASS: Record<NonNullable<PaginationProps['size']>, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

/**
 * Standalone pagination control for use with any list or grid (not just DataTable).
 *
 * Accessibility: wraps in a `<nav>` with `aria-label`, marks the current page
 * button with `aria-current="page"`, and hides ellipsis spans from screen readers.
 */
export function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = false,
  showPageSize = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  size = 'md',
  disabled = false,
  className,
  style,
}: PaginationProps): React.ReactElement {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const items = buildPaginationItems(currentPage, totalPages, siblingCount, boundaryCount);

  const goTo = (page: number) => {
    if (!disabled && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav
      aria-label="Pagination"
      className={classNames(styles.pagination, SIZE_CLASS[size], className)}
      style={style}
    >
      {/* Page size selector */}
      {showPageSize && onPageSizeChange && (
        <div className={styles.pageSizeWrapper}>
          <span className={styles.pageSizeLabel}>Rows per page:</span>
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            disabled={disabled}
            aria-label="Rows per page"
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Page controls */}
      <div className={styles.controls}>
        {/* First page */}
        {showFirstLast && (
          <button
            type="button"
            className={styles.btn}
            disabled={disabled || currentPage <= 1}
            onClick={() => goTo(1)}
            aria-label="First page"
          >
            «
          </button>
        )}

        {/* Previous page */}
        <button
          type="button"
          className={styles.btn}
          disabled={disabled || currentPage <= 1}
          onClick={() => goTo(currentPage - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* Page numbers / ellipses */}
        {items.map((item, idx) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className={styles.ellipsis}
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={classNames(
                styles.btn,
                item === currentPage ? styles.btnActive : undefined
              )}
              disabled={disabled}
              onClick={() => goTo(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}

        {/* Next page */}
        <button
          type="button"
          className={styles.btn}
          disabled={disabled || currentPage >= totalPages}
          onClick={() => goTo(currentPage + 1)}
          aria-label="Next page"
        >
          ›
        </button>

        {/* Last page */}
        {showFirstLast && (
          <button
            type="button"
            className={styles.btn}
            disabled={disabled || currentPage >= totalPages}
            onClick={() => goTo(totalPages)}
            aria-label="Last page"
          >
            »
          </button>
        )}
      </div>
    </nav>
  );
}

Pagination.displayName = 'Pagination';
