import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableRecord = Record<string, any>;

export interface DataTableColumn<T extends DataTableRecord = DataTableRecord> {
  /** Unique key that maps to a field in the row data */
  key: string;
  /** Text displayed in the column header */
  header: string;
  /** Whether this column supports checkbox-based filtering */
  filterable?: boolean;
  /** Custom cell renderer; receives the raw cell value and the full row */
  render?: (value: unknown, row: T) => React.ReactNode;
  /** Optional column width (e.g. '150px' or '20%') */
  width?: string | number;
}

export interface DataTableProps<T extends DataTableRecord = DataTableRecord> {
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Row data */
  data: T[];
  /**
   * Returns a stable, unique key for each row.
   * When omitted the row's array index is used as a fallback.
   */
  rowKey?: (row: T, index: number) => string | number;
  /** Additional CSS class applied to the outermost wrapper */
  className?: string;
  /** Additional inline style applied to the outermost wrapper */
  style?: React.CSSProperties;
  /** Message displayed when data array is empty or all rows are filtered out */
  emptyMessage?: string;
}
