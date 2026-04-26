/**
 * All user-facing string keys used across Zenput components.
 * Every key must be present in the `en-US` base catalog; other catalogs use
 * `PartialMessageCatalog` and fall back to `en-US` for missing keys.
 */
export type MessageCatalog = {
  // AutoComplete
  'autoComplete.noOptions': string;
  'autoComplete.loading': string;

  // Combobox
  'combobox.noOptions': string;
  'combobox.loading': string;

  // DataTable
  'dataTable.noData': string;
  /** Template: "{start}–{end} of {total}" — vars: start, end, total */
  'dataTable.paginationRange': string;

  // FileInput
  'fileInput.chooseFile': string;
  'fileInput.dragAndDropHint': string;

  // Pagination
  'pagination.navAriaLabel': string;
  'pagination.rowsPerPage': string;
  'pagination.firstPage': string;
  'pagination.previousPage': string;
  'pagination.nextPage': string;
  'pagination.lastPage': string;
  /** Template: "Page {n}" — var: n */
  'pagination.page': string;
};

export type MessageKey = keyof MessageCatalog;

/** Partial override map — only the keys you want to customise. */
export type PartialMessageCatalog = Partial<MessageCatalog>;
