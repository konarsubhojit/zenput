import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DataTable } from './DataTable';
import { DataTableColumn } from './DataTable.types';

interface Person {
  id: number;
  name: string;
  role: string;
  status: string;
}

const columns: DataTableColumn<Person>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role', filterable: true },
  { key: 'status', header: 'Status', filterable: true },
];

const data: Person[] = [
  { id: 1, name: 'Alice', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob', role: 'Editor', status: 'Inactive' },
  { id: 3, name: 'Carol', role: 'Admin', status: 'Active' },
  { id: 4, name: 'Dave', role: 'Viewer', status: 'Inactive' },
];

describe('DataTable', () => {
  it('renders without errors', () => {
    render(<DataTable columns={columns} data={data} />);
  });

  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
    expect(screen.getByText('Dave')).toBeInTheDocument();
  });

  it('shows empty message when data is empty', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders a filter button only for filterable columns', () => {
    render(<DataTable columns={columns} data={data} />);
    const filterButtons = screen.getAllByRole('button', { name: /filter by/i });
    expect(filterButtons).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Filter by Role' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filter by Status' })).toBeInTheDocument();
  });

  it('opens filter dropdown when filter button is clicked', async () => {
    render(<DataTable columns={columns} data={data} />);
    const filterBtn = screen.getByRole('button', { name: 'Filter by Role' });
    await userEvent.click(filterBtn);
    expect(screen.getByRole('dialog', { name: 'Filter options for Role' })).toBeInTheDocument();
  });

  it('shows unique values as checkboxes in the filter dropdown', async () => {
    render(<DataTable columns={columns} data={data} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by Role' }));
    const dropdown = screen.getByRole('dialog', { name: 'Filter options for Role' });
    expect(within(dropdown).getByLabelText('Admin')).toBeInTheDocument();
    expect(within(dropdown).getByLabelText('Editor')).toBeInTheDocument();
    expect(within(dropdown).getByLabelText('Viewer')).toBeInTheDocument();
  });

  it('filters rows when a checkbox is selected', async () => {
    render(<DataTable columns={columns} data={data} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by Role' }));
    const adminCheckbox = screen.getByLabelText('Admin');
    await userEvent.click(adminCheckbox);
    expect(adminCheckbox).toBeChecked();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.queryByText('Dave')).not.toBeInTheDocument();
  });

  it('allows multiple values to be selected (OR logic within a column)', async () => {
    render(<DataTable columns={columns} data={data} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by Role' }));
    await userEvent.click(screen.getByLabelText('Admin'));
    await userEvent.click(screen.getByLabelText('Editor'));
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
    expect(screen.queryByText('Dave')).not.toBeInTheDocument();
  });

  it('applies AND logic across multiple filtered columns', async () => {
    render(<DataTable columns={columns} data={data} />);

    await userEvent.click(screen.getByRole('button', { name: 'Filter by Role' }));
    await userEvent.click(screen.getByLabelText('Admin'));

    await userEvent.click(screen.getByRole('button', { name: 'Filter by Status' }));
    await userEvent.click(screen.getByLabelText('Active'));

    // Only Alice and Carol are Admin + Active
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.queryByText('Dave')).not.toBeInTheDocument();
  });

  it('deselecting a checkbox removes the filter', async () => {
    render(<DataTable columns={columns} data={data} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by Role' }));
    await userEvent.click(screen.getByLabelText('Admin'));
    // Bob and Dave hidden
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Admin'));
    // All rows visible again
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Dave')).toBeInTheDocument();
  });

  it('shows a Clear button when filters are active and clicking it resets the filter', async () => {
    render(<DataTable columns={columns} data={data} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by Role' }));
    await userEvent.click(screen.getByLabelText('Admin'));

    const clearBtn = screen.getByRole('button', { name: /clear/i });
    expect(clearBtn).toBeInTheDocument();

    await userEvent.click(clearBtn);
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Dave')).toBeInTheDocument();
  });

  it('closes dropdown when another filter button is clicked', async () => {
    render(<DataTable columns={columns} data={data} />);
    await userEvent.click(screen.getByRole('button', { name: 'Filter by Role' }));
    expect(screen.getByRole('dialog', { name: 'Filter options for Role' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Filter by Status' }));
    expect(screen.queryByRole('dialog', { name: 'Filter options for Role' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Filter options for Status' })).toBeInTheDocument();
  });

  it('closes dropdown when clicking the same filter button again', async () => {
    render(<DataTable columns={columns} data={data} />);
    const filterBtn = screen.getByRole('button', { name: 'Filter by Role' });
    await userEvent.click(filterBtn);
    expect(screen.getByRole('dialog', { name: 'Filter options for Role' })).toBeInTheDocument();

    await userEvent.click(filterBtn);
    expect(screen.queryByRole('dialog', { name: 'Filter options for Role' })).not.toBeInTheDocument();
  });

  it('uses custom cell renderer when render prop is provided', () => {
    const columnsWithRender: DataTableColumn<Person>[] = [
      ...columns,
      {
        key: 'name',
        header: 'Custom Name',
        render: (value) => <strong data-testid="custom-cell">{String(value).toUpperCase()}</strong>,
      },
    ];
    render(<DataTable columns={columnsWithRender} data={data} />);
    const customCells = screen.getAllByTestId('custom-cell');
    expect(customCells[0]).toHaveTextContent('ALICE');
  });

  it('shows empty message when filters exclude all rows', async () => {
    // Use the full data set: filter Role=Viewer AND Status=Active.
    // Dave is the only Viewer but he is Inactive, so no row matches.
    render(<DataTable columns={columns} data={data} />);

    await userEvent.click(screen.getByRole('button', { name: 'Filter by Role' }));
    await userEvent.click(screen.getByLabelText('Viewer'));

    await userEvent.click(screen.getByRole('button', { name: 'Filter by Status' }));
    await userEvent.click(screen.getByLabelText('Active'));

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('applies className and style to wrapper', () => {
    const { container } = render(
      <DataTable columns={columns} data={data} className="my-table" style={{ padding: '16px' }} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('my-table');
    expect(wrapper).toHaveStyle({ padding: '16px' });
  });

  it('uses rowKey prop for stable row keys', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(row) => row.id}
      />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  // ── Sorting ───────────────────────────────────────────────────────────────

  it('renders sort button for sortable columns', () => {
    const sortableColumns: DataTableColumn<Person>[] = [
      { key: 'id', header: 'ID', sortable: true },
      ...columns.slice(1),
    ];
    render(<DataTable columns={sortableColumns} data={data} />);
    expect(screen.getByRole('button', { name: /Sort by ID/i })).toBeInTheDocument();
  });

  it('calls onSort when a sortable column header is clicked', async () => {
    const handleSort = jest.fn();
    const sortableColumns: DataTableColumn<Person>[] = [
      { key: 'name', header: 'Name', sortable: true },
      ...columns.slice(2),
    ];
    render(<DataTable columns={sortableColumns} data={data} onSort={handleSort} />);
    await userEvent.click(screen.getByRole('button', { name: /Sort by Name/i }));
    expect(handleSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('toggles sort direction on second click', async () => {
    const handleSort = jest.fn();
    const sortableColumns: DataTableColumn<Person>[] = [
      { key: 'name', header: 'Name', sortable: true },
      ...columns.slice(2),
    ];
    render(<DataTable columns={sortableColumns} data={data} onSort={handleSort} />);
    const sortBtn = screen.getByRole('button', { name: /Sort by Name/i });
    await userEvent.click(sortBtn);
    await userEvent.click(sortBtn);
    expect(handleSort).toHaveBeenLastCalledWith('name', 'desc');
  });

  // ── Loading skeleton ──────────────────────────────────────────────────────

  it('renders skeleton rows when loading is true', () => {
    render(<DataTable columns={columns} data={[]} loading skeletonRowCount={3} />);
    // Data cells are replaced by skeleton cells; no real data shown
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    // The empty message should NOT appear during loading
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });

  // ── Row click / expand ────────────────────────────────────────────────────

  it('calls onRowClick when a row is clicked', async () => {
    const handleRowClick = jest.fn();
    render(<DataTable columns={columns} data={data} onRowClick={handleRowClick} rowKey={(r) => r.id} />);
    await userEvent.click(screen.getByText('Alice'));
    expect(handleRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('expands row when expandedRowRender is provided and row is clicked', async () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        expandedRowRender={(row) => <div data-testid="expanded">{row.name} details</div>}
      />
    );
    await userEvent.click(screen.getByText('Alice'));
    expect(screen.getByTestId('expanded')).toHaveTextContent('Alice details');
  });

  it('collapses expanded row on second click', async () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        expandedRowRender={(row) => <div data-testid="expanded">{row.name} details</div>}
      />
    );
    await userEvent.click(screen.getByText('Alice'));
    expect(screen.getByTestId('expanded')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Alice'));
    expect(screen.queryByTestId('expanded')).not.toBeInTheDocument();
  });

  // ── Selection ─────────────────────────────────────────────────────────────

  it('renders checkbox column when selectable is true', () => {
    render(<DataTable columns={columns} data={data} selectable rowKey={(r) => r.id} />);
    expect(screen.getByLabelText('Select all rows')).toBeInTheDocument();
    const rowCheckboxes = screen.getAllByLabelText('Select row');
    expect(rowCheckboxes).toHaveLength(data.length);
  });

  it('calls onSelectionChange when a row checkbox is clicked', async () => {
    const handleSelectionChange = jest.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        selectable
        rowKey={(r) => r.id}
        onSelectionChange={handleSelectionChange}
      />
    );
    const [firstCheckbox] = screen.getAllByLabelText('Select row');
    await userEvent.click(firstCheckbox);
    expect(handleSelectionChange).toHaveBeenCalledWith(new Set([1]));
  });

  it('selects all rows when select-all checkbox is clicked', async () => {
    const handleSelectionChange = jest.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        selectable
        rowKey={(r) => r.id}
        onSelectionChange={handleSelectionChange}
      />
    );
    await userEvent.click(screen.getByLabelText('Select all rows'));
    expect(handleSelectionChange).toHaveBeenCalledWith(new Set([1, 2, 3, 4]));
  });

  it('shows bulkActions bar when rows are selected', async () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        selectable
        rowKey={(r) => r.id}
        bulkActions={<button>Delete</button>}
      />
    );
    const [firstCheckbox] = screen.getAllByLabelText('Select row');
    await userEvent.click(firstCheckbox);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText(/1 selected/i)).toBeInTheDocument();
  });

  // ── Pagination ────────────────────────────────────────────────────────────

  it('renders pagination controls when pagination prop is provided', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ currentPage: 1, pageSize: 2, totalCount: 4, onPageChange: jest.fn() }}
      />
    );
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
  });

  it('calls onPageChange when a page button is clicked', async () => {
    const handlePageChange = jest.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ currentPage: 1, pageSize: 2, totalCount: 4, onPageChange: handlePageChange }}
      />
    );
    await userEvent.click(screen.getByLabelText('Page 2'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ currentPage: 1, pageSize: 2, totalCount: 4, onPageChange: jest.fn() }}
      />
    );
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ currentPage: 2, pageSize: 2, totalCount: 4, onPageChange: jest.fn() }}
      />
    );
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });
});
