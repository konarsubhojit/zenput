import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { DataTableProps, DataTableRecord } from './DataTable.types';
import { classNames } from '../../utils';
import styles from './DataTable.module.css';

export function DataTable<T extends DataTableRecord = DataTableRecord>({
  columns,
  data,
  rowKey,
  className,
  style,
  emptyMessage = 'No data available',
}: Readonly<DataTableProps<T>>) {
  /** Key of the column whose filter dropdown is currently open */
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);

  /**
   * Active filter selections: maps column key → array of selected string values.
   * An empty (or absent) array means "no filter applied" for that column.
   */
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

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

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.wrapper, className)}
      style={style}
    >
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => {
                const isOpen = openFilterKey === col.key;
                const selectedValues = activeFilters[col.key] ?? [];
                const isActive = selectedValues.length > 0;
                const uniqueValues = col.filterable ? getUniqueValues(col.key) : [];

                return (
                  <th
                    key={col.key}
                    className={styles.th}
                    style={col.width === undefined ? undefined : { width: col.width }}
                  >
                    <div className={styles.thContent}>
                      <span className={styles.headerText}>{col.header}</span>
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
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={styles.emptyCell}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr key={rowKey ? rowKey(row, rowIndex) : rowIndex} className={styles.tr}>
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataTable.displayName = 'DataTable';
