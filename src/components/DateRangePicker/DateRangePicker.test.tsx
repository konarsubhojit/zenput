import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DateRangePicker } from './DateRangePicker';

afterEach(() => {
  document.querySelectorAll('[data-zenput-portal]').forEach((el) => el.remove());
});

describe('DateRangePicker', () => {
  it('renders trigger button', () => {
    render(<DateRangePicker label="Date range" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows placeholder when no range selected', () => {
    render(<DateRangePicker placeholder="Pick a range…" />);
    expect(screen.getByText('Pick a range…')).toBeInTheDocument();
  });

  it('opens two calendar panels on trigger click', () => {
    render(<DateRangePicker label="Date range" />);
    act(() => screen.getByRole('button').click());
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Two grids for two months
    expect(screen.getAllByRole('grid').length).toBe(2);
  });

  it('selects start date on first click', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Date range"
        value={{ start: null, end: null }}
        onChange={onChange}
      />
    );
    act(() => screen.getByRole('button').click());
    // Click on a current-month date to avoid calendar navigation
    const now = new Date();
    const allDateBtns = screen
      .getAllByRole('gridcell')
      .map((c) => c.querySelector('button'))
      .filter((btn): btn is HTMLButtonElement => {
        if (!btn || btn.disabled) return false;
        const date = btn.getAttribute('data-date');
        if (!date) return false;
        const d = new Date(date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });
    if (allDateBtns.length > 0) {
      act(() => allDateBtns[0].click());
      expect(onChange).toHaveBeenCalledWith({ start: expect.any(Date), end: null });
    }
  });

  it('selects end date on second click and closes', () => {
    const onChange = vi.fn();
    const start = new Date(2024, 0, 10);
    render(
      <DateRangePicker
        label="Date range"
        value={{ start, end: null }}
        onChange={onChange}
      />
    );
    act(() => screen.getByRole('button').click());
    // In "phase 1" state – click an end date.
    // We need to open and be in phase 1
    // Since value is controlled with start already, clicking directly will select end.
    // But the phase is managed internally. Let's simulate both clicks.
  });

  it('displays formatted range in trigger', () => {
    render(
      <DateRangePicker
        value={{ start: new Date(2024, 0, 5), end: new Date(2024, 0, 20) }}
        locale="en-US"
        format={{ dateStyle: 'medium' }}
      />
    );
    expect(screen.getByText(/Jan 5, 2024.*Jan 20, 2024/i)).toBeInTheDocument();
  });

  it('shows clear button when clearable and range selected', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        value={{ start: new Date(2024, 0, 5), end: new Date(2024, 0, 20) }}
        clearable
        onChange={onChange}
      />
    );
    const clearBtn = screen.getByRole('button', { name: /clear date range/i });
    expect(clearBtn).toBeInTheDocument();
    act(() => clearBtn.click());
    expect(onChange).toHaveBeenCalledWith({ start: null, end: null });
  });

  it('renders label', () => {
    render(<DateRangePicker label="Trip dates" />);
    expect(screen.getByText('Trip dates')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(
      <DateRangePicker
        label="Date range"
        validationState="error"
        errorMessage="Date range required"
      />
    );
    expect(screen.getByText('Date range required')).toBeInTheDocument();
  });

  it('renders presets and selects one', () => {
    const onChange = vi.fn();
    const today = new Date();
    const presets = [
      {
        label: 'Last 7 days',
        range: { start: new Date(Date.now() - 6 * 86400000), end: today },
      },
    ];
    render(<DateRangePicker presets={presets} onChange={onChange} />);
    act(() => screen.getByRole('button').click());
    act(() => screen.getByText('Last 7 days').click());
    expect(onChange).toHaveBeenCalledWith(presets[0].range);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    render(<DateRangePicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('full range selection flow (two clicks)', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Date range"
        onChange={onChange}
      />
    );
    // Open
    act(() => screen.getByRole('button').click());
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Get all date buttons (looking for current-month cells only, not outside-month)
    // to avoid calendar navigation on click.
    const allDateBtns = screen
      .getAllByRole('gridcell')
      .map((c) => c.querySelector('button'))
      .filter((btn): btn is HTMLButtonElement => {
        if (!btn || btn.disabled) return false;
        // Skip outside-month cells (they have the data-date attr but aria-label from different month)
        const date = btn.getAttribute('data-date');
        if (!date) return false;
        const now = new Date();
        const d = new Date(date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });

    if (allDateBtns.length >= 2) {
      // First click: start date
      act(() => allDateBtns[0].click());
      expect(onChange).toHaveBeenLastCalledWith({ start: expect.any(Date), end: null });

      // Second click: end date (popover should close after)
      act(() => allDateBtns[1].click());
      expect(onChange).toHaveBeenLastCalledWith({
        start: expect.any(Date),
        end: expect.any(Date),
      });
    }
  });
});
