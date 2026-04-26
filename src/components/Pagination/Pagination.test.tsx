import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { Pagination, buildPaginationItems } from './Pagination';
import { expectNoA11yViolations } from '../../test-utils/axe';

describe('buildPaginationItems', () => {
  it('returns all pages when total is small', () => {
    expect(buildPaginationItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns ellipsis for large page counts', () => {
    const items = buildPaginationItems(5, 10);
    expect(items).toContain('ellipsis');
    expect(items[0]).toBe(1);
    expect(items[items.length - 1]).toBe(10);
  });

  it('clamps current page', () => {
    // With total=5 and default bounds, all pages are returned (no ellipsis needed).
    const items = buildPaginationItems(0, 5);
    // page 0 is clamped to 1; all 5 pages should be present
    expect(items).toContain(1);
    expect(items).toContain(5);
    expect(items.filter((i) => i !== 'ellipsis')).toHaveLength(5);
  });
});

describe('Pagination', () => {
  it('renders without crashing', () => {
    render(
      <Pagination
        currentPage={1}
        totalCount={100}
        pageSize={10}
        onPageChange={vi.fn()}
      />
    );
  });

  it('renders a nav landmark with aria-label', () => {
    render(
      <Pagination
        currentPage={1}
        totalCount={50}
        pageSize={10}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('marks current page with aria-current="page"', () => {
    render(
      <Pagination
        currentPage={3}
        totalCount={50}
        pageSize={10}
        onPageChange={vi.fn()}
      />
    );
    const btn = screen.getByLabelText('Page 3');
    expect(btn).toHaveAttribute('aria-current', 'page');
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalCount={50}
        pageSize={10}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalCount={50}
        pageSize={10}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls onPageChange when a page button is clicked', async () => {
    const onChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalCount={50}
        pageSize={10}
        onPageChange={onChange}
      />
    );
    await userEvent.click(screen.getByLabelText('Page 2'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when next is clicked', async () => {
    const onChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalCount={50}
        pageSize={10}
        onPageChange={onChange}
      />
    );
    await userEvent.click(screen.getByLabelText('Next page'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('renders first/last buttons when showFirstLast=true', () => {
    render(
      <Pagination
        currentPage={3}
        totalCount={50}
        pageSize={10}
        onPageChange={vi.fn()}
        showFirstLast
      />
    );
    expect(screen.getByLabelText('First page')).toBeInTheDocument();
    expect(screen.getByLabelText('Last page')).toBeInTheDocument();
  });

  it('renders page size selector when showPageSize=true', () => {
    render(
      <Pagination
        currentPage={1}
        totalCount={100}
        pageSize={10}
        onPageChange={vi.fn()}
        showPageSize
        onPageSizeChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Rows per page')).toBeInTheDocument();
  });

  it('calls onPageSizeChange when a new size is selected', async () => {
    const onSizeChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalCount={100}
        pageSize={10}
        onPageChange={vi.fn()}
        showPageSize
        pageSizeOptions={[10, 20, 50]}
        onPageSizeChange={onSizeChange}
      />
    );
    await userEvent.selectOptions(screen.getByLabelText('Rows per page'), '20');
    expect(onSizeChange).toHaveBeenCalledWith(20);
  });

  it('disables all buttons when disabled=true', () => {
    render(
      <Pagination
        currentPage={3}
        totalCount={50}
        pageSize={10}
        onPageChange={vi.fn()}
        disabled
      />
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('passes a11y checks', async () => {
    const { container } = render(
      <Pagination
        currentPage={3}
        totalCount={50}
        pageSize={10}
        onPageChange={vi.fn()}
        showFirstLast
      />
    );
    await expectNoA11yViolations(container);
  });
});
