import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import type { DataTableColumn } from './DataTable.types';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    emptyMessage: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  status: string;
  salary: number;
}

const employees: Employee[] = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', role: 'Senior Engineer', status: 'Active', salary: 120000 },
  { id: 2, name: 'Bob Smith', department: 'Design', role: 'UX Designer', status: 'Active', salary: 95000 },
  { id: 3, name: 'Carol White', department: 'Engineering', role: 'Junior Engineer', status: 'Inactive', salary: 75000 },
  { id: 4, name: 'David Lee', department: 'Marketing', role: 'Marketing Manager', status: 'Active', salary: 105000 },
  { id: 5, name: 'Eve Martinez', department: 'Design', role: 'UI Designer', status: 'Active', salary: 90000 },
  { id: 6, name: 'Frank Brown', department: 'Engineering', role: 'Tech Lead', status: 'Active', salary: 140000 },
];

const basicColumns: DataTableColumn[] = [
  { key: 'id', header: 'ID', width: '60px' },
  { key: 'name', header: 'Name' },
  { key: 'department', header: 'Department' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
];

export const Default: Story = {
  args: {
    columns: basicColumns,
    data: employees,
    rowKey: (row) => row.id,
  },
};

export const WithFilterableColumns: Story = {
  render: () => {
    const filterableColumns: DataTableColumn<Employee>[] = [
      { key: 'id', header: 'ID', width: '60px' },
      { key: 'name', header: 'Name' },
      { key: 'department', header: 'Department', filterable: true },
      { key: 'role', header: 'Role' },
      { key: 'status', header: 'Status', filterable: true },
    ];

    return (
      <DataTable
        columns={filterableColumns}
        data={employees}
        rowKey={(row) => row.id}
      />
    );
  },
};

export const WithCustomRenderers: Story = {
  render: () => {
    const columnsWithRender: DataTableColumn<Employee>[] = [
      { key: 'id', header: 'ID', width: '60px' },
      { key: 'name', header: 'Name' },
      { key: 'department', header: 'Department', filterable: true },
      { key: 'status', header: 'Status', filterable: true, render: (value) => {
        const isActive = value === 'Active';
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: isActive ? '#d1fae5' : '#fee2e2',
              color: isActive ? '#065f46' : '#991b1b',
            }}
          >
            {String(value)}
          </span>
        );
      }},
      { key: 'salary', header: 'Salary', render: (value) => (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value))}
        </span>
      )},
    ];

    return (
      <DataTable
        columns={columnsWithRender}
        data={employees}
        rowKey={(row) => row.id}
      />
    );
  },
};

export const EmptyStateDefaultMessage: Story = {
  args: {
    columns: basicColumns,
    data: [],
    rowKey: (row) => row.id,
  },
};

export const EmptyStateCustomMessage: Story = {
  args: {
    columns: basicColumns,
    data: [],
    rowKey: (row) => row.id,
    emptyMessage: 'No records match the current criteria.',
  },
};
