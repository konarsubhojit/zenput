import { useMemo, useState } from 'react';
import { DataTable, Badge, Box, Text, type DataTableColumn } from 'zenput';
import { Section, Scenario } from './_shell';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
}

const USER_ROWS: UserRow[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@zenput.dev', role: 'admin', active: true },
  { id: 2, name: 'Alan Turing', email: 'alan@zenput.dev', role: 'editor', active: true },
  { id: 3, name: 'Grace Hopper', email: 'grace@zenput.dev', role: 'editor', active: false },
  { id: 4, name: 'Linus Torvalds', email: 'linus@zenput.dev', role: 'viewer', active: true },
  { id: 5, name: 'Margaret Hamilton', email: 'margaret@zenput.dev', role: 'admin', active: true },
  { id: 6, name: 'Dennis Ritchie', email: 'dennis@zenput.dev', role: 'viewer', active: false },
  { id: 7, name: 'Barbara Liskov', email: 'barbara@zenput.dev', role: 'editor', active: true },
];

const CURSOR_PAGE_SIZE = 3;

export function DataTableSection() {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const paginated = useMemo(
    () => USER_ROWS.slice((page - 1) * pageSize, page * pageSize),
    [page]
  );

  // Cursor pagination state
  const [cursorRows, setCursorRows] = useState(() => USER_ROWS.slice(0, CURSOR_PAGE_SIZE));
  const [cursorLoading, setCursorLoading] = useState(false);
  const hasNextPage = cursorRows.length < USER_ROWS.length;

  const handleLoadMore = () => {
    setCursorLoading(true);
    setTimeout(() => {
      setCursorRows((prev) => USER_ROWS.slice(0, prev.length + CURSOR_PAGE_SIZE));
      setCursorLoading(false);
    }, 600);
  };

  const columns: DataTableColumn<UserRow>[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'email', header: 'Email' },
      {
        key: 'role',
        header: 'Role',
        filterable: true,
        render: (value) => (
          <Badge
            tone={value === 'admin' ? 'brand' : value === 'editor' ? 'info' : 'neutral'}
          >
            {String(value)}
          </Badge>
        ),
      },
      {
        key: 'active',
        header: 'Status',
        render: (value) => (
          <Badge tone={value ? 'success' : 'danger'} variant="subtle">
            {value ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <Section
      id="data-table"
      name="DataTable"
      description="Sortable, filterable and paginated data grid with selection, expansion and skeleton loading."
    >
      <Scenario title="Full-featured (sort / filter / pagination)" full>
        <DataTable<UserRow>
          columns={columns}
          data={paginated}
          rowKey={(r) => r.id}
          pagination={{
            currentPage: page,
            pageSize,
            totalCount: USER_ROWS.length,
            onPageChange: setPage,
          }}
          selectable
        />
      </Scenario>
      <Scenario title="Cursor pagination (Load More)" full>
        <DataTable<UserRow>
          columns={columns}
          data={cursorRows}
          rowKey={(r) => r.id}
          pagination={{
            mode: 'cursor',
            hasNextPage,
            onLoadMore: handleLoadMore,
            loading: cursorLoading,
          }}
        />
      </Scenario>
      <Scenario title="Expandable rows" full>
        <DataTable<UserRow>
          columns={columns.slice(0, 3)}
          data={USER_ROWS.slice(0, 3)}
          rowKey={(r) => r.id}
          onRowClick={() => undefined}
          expandedRowRender={(row) => (
            <Box p="3" style={{ background: 'var(--zp-color-surface-subtle)' }}>
              <Text size="sm">
                <strong>{row.name}</strong> &lt;{row.email}&gt; — role {row.role}
              </Text>
            </Box>
          )}
        />
      </Scenario>
      <Scenario title="Loading skeleton" full>
        <DataTable<UserRow>
          columns={columns}
          data={[]}
          loading
          skeletonRowCount={4}
        />
      </Scenario>
      <Scenario title="Empty state" full>
        <DataTable<UserRow>
          columns={columns}
          data={[]}
          emptyMessage="No users match your filters."
        />
      </Scenario>
    </Section>
  );
}
