import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { DataTableProps, DataTableRecord, SortDirection } from './DataTable.types';
import { classNames } from '../../utils';
import styles from './DataTable.module.css';

const DEFAULT_SKELETON_ROW_COUNT = 5;

/**
 * Returns an array of page numbers and 'ellipsis' placeholders to render in
 * the pagination bar. Always shows the first/last page and up to `windowSize`
 * pages around the current page, with ellipsis where gaps exist.
 */
function buildPageItems(current: number, total: number, windowSize = 2): (number | 'ellipsis')[] {
  // Clamp current to a valid page range so pagination stays stable under data changes.
  const clamped = Math.min(Math.max(current, 1), Math.max(total, 1));

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | 'ellipsis')[] = [];
  const left = Math.max(2, clamped - windowSize);
  const right = Math.min(total - 1, clamped + windowSize);

  items.push(1);

  if (left > 2) items.push('ellipsis');

  for (let p = left; p <= right; p++) {
    items.push(p);
  }

  if (right < total - 1) items.push('ellipsis');

  items.push(total);
  return items;
}

export function DataTable<T extends DataTableRecord = DataTableRecord>({
  columns,
  data,
  rowKey,
  className,
  style,
  emptyMessage = 'No data available',
  pagination,
  onSort,
  loading = false,
  skeletonRowCount = DEFAULT_SKELETON_ROW_COUNT,
  onRowClick,
  expandedRowRender,
  selectable = false,
  selectedRows,
  onSelectionChange,
  bulkActions,
}: Readonly<DataTableProps<T>>) {
  /** Key of the column whose filter dropdown is currently open */
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);

  /**
   * Active filter selections: maps column key → array of selected string values.
   * An empty (or absent) array means "no filter applied" for that column.
   */
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  /** Current sort state: { key, direction } */
  const [sortState, setSortState] = useState<{ key: string; direction: SortDirection } | null>(null);

  /** Set of expanded row keys */
  const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(new Set());

  const wrapperRef = useRef<HTMLDivElement>(null);

  /** Close the open dropdown when user clicks outside the table wrapper */
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenFilterKey(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  /** Returns sorted unique string values for a given column key from ALL rows */
  const getUniqueValues = useCallback(
    (key: string): string[] => {
      const seen = new Set<string>();
      data.forEach((row) => seen.add(String(row[key] ?? '')));
      return Array.from(seen).sort((a, b) => a.localeCompare(b));
    },
    [data]
  );

  /** Toggle the filter dropdown for a column */
  const toggleFilterDropdown = useCallback(
    (key: string) => {
      setOpenFilterKey((prev) => (prev === key ? null : key));
    },
    []
  );

  /** Toggle a single checkbox value inside a column's filter */
  const toggleFilterValue = useCallback((columnKey: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[columnKey] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [columnKey]: next };
    });
  }, []);

  /** Clear all selected values for a column filter */
  const clearFilter = useCallback((columnKey: string) => {
    setActiveFilters((prev) => ({ ...prev, [columnKey]: [] }));
  }, []);

  /** Rows after applying all active filters (AND across columns, OR within a column) */
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.every((col) => {
        if (!col.filterable) return true;
        const selected = activeFilters[col.key];
        if (!selected || selected.length === 0) return true;
        return selected.includes(String(row[col.key] ?? ''));
      })
    );
  }, [data, columns, activeFilters]);

  /** Handle sortable column header click */
  const handleSortClick = useCallback(
    (key: string) => {
      const nextDirection: SortDirection =
        sortState?.key === key && sortState.direction === 'asc' ? 'desc' : 'asc';
      setSortState({ key, direction: nextDirection });
      onSort?.(key, nextDirection);
    },
    [sortState, onSort]
  );

  /** Derive the row key for a given row + index */
  const getRowKey = useCallback(
    (row: T, index: number): string | number => {
      return rowKey ? rowKey(row, index) : index;
    },
    [rowKey]
  );

  /** Toggle expanded state for a row */
  const toggleExpandedRow = useCallback((key: string | number) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  /** Handle row click */
  const handleRowClick = useCallback(
    (row: T, key: string | number) => {
      if (expandedRowRender) {
        toggleExpandedRow(key);
      }
      onRowClick?.(row);
    },
    [onRowClick, expandedRowRender, toggleExpandedRow]
  );

  // ── Selection helpers ──────────────────────────────────────────────────────

  const isControlledSelection = selectedRows !== undefined;

  const [internalSelected, setInternalSelected] = useState<Set<string | number>>(new Set());
  const activeSelected = isControlledSelection ? selectedRows : internalSelected;

  const isAllSelected =
    filteredData.length > 0 &&
    filteredData.every((row, idx) => activeSelected.has(getRowKey(row, idx)));

  const isIndeterminate =
    !isAllSelected && filteredData.some((row, idx) => activeSelected.has(getRowKey(row, idx)));

  const handleSelectAll = useCallback(() => {
    const allKeys = filteredData.map((row, idx) => getRowKey(row, idx));
    const allKeysSet = new Set(allKeys);
    const next = isAllSelected
      ? new Set<string | number>([...activeSelected].filter((k) => !allKeysSet.has(k)))
      : new Set<string | number>([...activeSelected, ...allKeys]);
    if (!isControlledSelection) setInternalSelected(next);
    onSelectionChange?.(next);
  }, [filteredData, getRowKey, isAllSelected, activeSelected, isControlledSelection, onSelectionChange]);

  const handleSelectRow = useCallback(
    (key: string | number) => {
      const next = new Set(activeSelected);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      if (!isControlledSelection) setInternalSelected(next);
      onSelectionChange?.(next);
    },
    [activeSelected, isControlledSelection, onSelectionChange]
  );

  // ── Pagination ─────────────────────────────────────────────────────────────

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize))
    : 1;

  const colSpan = columns.length + (selectable ? 1 : 0);

  // ── Skeleton rows ──────────────────────────────────────────────────────────

  const skeletonRows = useMemo(
    () => Array.from({ length: skeletonRowCount }),
    [skeletonRowCount]
  );

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.wrapper, className)}
      style={style}
    >
      {/* Bulk actions bar */}
      {selectable && activeSelected.size > 0 && bulkActions && (
        <div className={styles.bulkActionsBar}>
          <span className={styles.bulkActionsCount}>
            {activeSelected.size} selected
          </span>
          <div className={styles.bulkActionsSlot}>{bulkActions}</div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {selectable && (
                <th className={classNames(styles.th, styles.checkboxTh)}>
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={handleSelectAll}
                    className={styles.rowCheckbox}
                  />
                </th>
              )}
              {columns.map((col) => {
                const isOpen = openFilterKey === col.key;
                const selectedValues = activeFilters[col.key] ?? [];
                const isActive = selectedValues.length > 0;
                const uniqueValues = col.filterable ? getUniqueValues(col.key) : [];
                const isSorted = sortState?.key === col.key;
                const sortDir = isSorted ? sortState!.direction : null;

                return (
                  <th
                    key={col.key}
                    className={styles.th}
                    style={col.width === undefined ? undefined : { width: col.width }}
                  >
                    <div className={styles.thContent}>
                      {col.sortable ? (
                        <button
                          type="button"
                          className={classNames(styles.sortButton, isSorted ? styles.sortButtonActive : undefined)}
                          onClick={() => handleSortClick(col.key)}
                          aria-label={`Sort by ${col.header}${isSorted ? `, currently ${sortDir}` : ''}`}
                        >
                          <span className={styles.headerText}>{col.header}</span>
                          <span className={styles.sortIcon} aria-hidden="true">
                            {isSorted
                              ? sortDir === 'asc'
                                ? '▲'
                                : '▼'
                              : '⇅'}
                          </span>
                        </button>
                      ) : (
                        <span className={styles.headerText}>{col.header}</span>
                      )}
                      {col.filterable && (
                        <div className={styles.filterContainer}>
                          <button
                            type="button"
                            aria-label={`Filter by ${col.header}`}
                            aria-expanded={isOpen}
                            aria-haspopup="listbox"
                            className={classNames(
                              styles.filterButton,
                              isActive ? styles.filterButtonActive : undefined
                            )}
                            onClick={() => toggleFilterDropdown(col.key)}
                          >
                            <span
                              className={classNames(
                                styles.filterArrow,
                                isOpen ? styles.filterArrowOpen : undefined
                              )}
                              aria-hidden="true"
                            >
                              ▾
                            </span>
                          </button>
                          {isOpen && (
                            <div
                              className={styles.filterDropdown}
                              role="dialog"
                              aria-label={`Filter options for ${col.header}`}
                            >
                              <ul className={styles.filterList} role="listbox">
                                {uniqueValues.length === 0 ? (
                                  <li className={styles.filterEmpty}>No options</li>
                                ) : (
                                  uniqueValues.map((val, valIndex) => {
                                    const checked = selectedValues.includes(val);
                                    const checkboxId = `dt-filter-${col.key}-${valIndex}`;
                                    return (
                                      <li key={val} className={styles.filterItem}>
                                        <label
                                          htmlFor={checkboxId}
                                          className={styles.filterLabel}
                                        >
                                          <input
                                            id={checkboxId}
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleFilterValue(col.key, val)}
                                            className={styles.filterCheckbox}
                                          />
                                          <span className={styles.filterValueText}>{val}</span>
                                        </label>
                                      </li>
                                    );
                                  })
                                )}
                              </ul>
                              {selectedValues.length > 0 && (
                                <div className={styles.filterActions}>
                                  <button
                                    type="button"
                                    className={styles.clearButton}
                                    onClick={() => clearFilter(col.key)}
                                  >
                                    Clear
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeletonRows.map((_, skeletonIdx) => (
                <tr key={`skeleton-${skeletonIdx}`} className={styles.skeletonRow}>
                  {selectable && (
                    <td className={styles.td}>
                      <div className={classNames(styles.skeletonCell, styles.skeletonCheckbox)} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      <div className={styles.skeletonCell} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className={styles.emptyCell}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => {
                const key = getRowKey(row, rowIndex);
                const isSelected = activeSelected.has(key);
                const isExpanded = expandedKeys.has(key);
                const isClickable = !!(onRowClick || expandedRowRender);

                return (
                  <React.Fragment key={key}>
                    <tr
                      className={classNames(
                        styles.tr,
                        isClickable ? styles.trClickable : undefined,
                        isSelected ? styles.trSelected : undefined
                      )}
                      onClick={isClickable ? () => handleRowClick(row, key) : undefined}
                      aria-expanded={expandedRowRender ? isExpanded : undefined}
                    >
                      {selectable && (
                        <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            aria-label={`Select row ${key}`}
                            checked={isSelected}
                            onChange={() => handleSelectRow(key)}
                            className={styles.rowCheckbox}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className={styles.td}>
                          {col.render
                            ? col.render(row[col.key], row)
                            : String(row[col.key] ?? '')}
                        </td>
                      ))}
                    </tr>
                    {expandedRowRender && isExpanded && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={colSpan} className={styles.expandedCell}>
                          {expandedRowRender(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pagination && (
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            {loading || pagination.totalCount === 0
              ? `0–0 of ${pagination.totalCount}`
              : `${(pagination.currentPage - 1) * pagination.pageSize + 1}–${Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.totalCount
                )} of ${pagination.totalCount}`}
          </span>
          <div className={styles.paginationControls}>
            <button
              type="button"
              className={styles.pageButton}
              disabled={loading || pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              aria-label="Previous page"
            >
              ‹
            </button>
            {buildPageItems(pagination.currentPage, totalPages).map((item, idx) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className={styles.pageEllipsis} aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={classNames(
                    styles.pageButton,
                    item === pagination.currentPage ? styles.pageButtonActive : undefined
                  )}
                  disabled={loading}
                  onClick={() => pagination.onPageChange(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === pagination.currentPage ? 'page' : undefined}
                >
                  {item}
                </button>
              )
            )}
            <button
              type="button"
              className={styles.pageButton}
              disabled={loading || pagination.currentPage >= totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

DataTable.displayName = 'DataTable';
