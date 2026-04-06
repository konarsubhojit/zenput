import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableRecord = Record<string, any>;

export type SortDirection = 'asc' | 'desc';

export interface DataTablePagination {
  /** Current page number (1-based) */
  currentPage: number;
  /** Number of rows per page */
  pageSize: number;
  /** Total number of rows across all pages */
  totalCount: number;
  /** Called when the user navigates to a different page */
  onPageChange: (page: number) => void;
}

export interface DataTableColumn<T extends DataTableRecord = DataTableRecord> {
  /** Unique key that maps to a field in the row data */
  key: string;
  /** Text displayed in the column header */
  header: string;
  /** Whether this column supports checkbox-based filtering */
  filterable?: boolean;
  /** Whether this column is sortable */
  sortable?: boolean;
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
  /**
   * Pagination configuration. When provided, the table renders built-in
   * pagination controls below the table body.
   */
  pagination?: DataTablePagination;
  /**
   * Called when a sortable column header is clicked.
   * Receives the column key and the new sort direction.
   */
  onSort?: (key: string, direction: SortDirection) => void;
  /**
   * When true, renders shimmer skeleton rows instead of real data while a
   * fetch is in progress, keeping the table chrome (headers, pagination) stable.
   */
  loading?: boolean;
  /**
   * Number of skeleton rows to display when loading is true.
   * Defaults to 5.
   */
  skeletonRowCount?: number;
  /** Called when a data row is clicked */
  onRowClick?: (row: T) => void;
  /**
   * Renders additional content below the clicked row.
   * When provided together with onRowClick the row expands on click to reveal this content.
   */
  expandedRowRender?: (row: T) => React.ReactNode;
  /**
   * When true, adds a leading checkbox column for row selection.
   */
  selectable?: boolean;
  /**
   * Controlled set of selected row keys.
   * Each value corresponds to the return value of rowKey (or the row index when rowKey is omitted).
   */
  selectedRows?: Set<string | number>;
  /**
   * Called when the selection changes.
   * Receives the full updated set of selected row keys.
   */
  onSelectionChange?: (selected: Set<string | number>) => void;
  /**
   * Render slot for bulk-action controls.
   * Rendered in a bar above the table when at least one row is selected.
   */
  bulkActions?: React.ReactNode;
}
