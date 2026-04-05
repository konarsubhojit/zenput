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
});
