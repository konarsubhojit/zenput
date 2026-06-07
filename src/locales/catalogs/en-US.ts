import type { MessageCatalog } from '../types';

/** English (US) — the base catalog; every key must be present. */
export const enUS: MessageCatalog = {
  'autoComplete.noOptions': 'No options found',
  'autoComplete.loading': 'Loading\u2026',
  'autoComplete.suggestionsLabel': 'Suggestions',

  'combobox.noOptions': 'No options found',
  'combobox.loading': 'Loading\u2026',

  'dataTable.noData': 'No data available',
  'dataTable.paginationRange': '{start}\u2013{end} of {total}',

  'fileInput.chooseFile': 'Choose file',
  'fileInput.dragAndDropHint': 'or drag and drop files here',
  'fileInput.maxFilesExceeded': 'Maximum {max} files allowed',
  'fileInput.moveFileUp': 'Move {name} up',
  'fileInput.moveFileDown': 'Move {name} down',
  'fileInput.removeFile': 'Remove {name}',

  'pagination.navAriaLabel': 'Pagination',
  'pagination.rowsPerPage': 'Rows per page:',
  'pagination.firstPage': 'First page',
  'pagination.previousPage': 'Previous page',
  'pagination.nextPage': 'Next page',
  'pagination.lastPage': 'Last page',
  'pagination.page': 'Page {n}',
};
