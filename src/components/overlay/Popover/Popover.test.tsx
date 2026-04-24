import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';

afterEach(() => {
  document.querySelectorAll('[data-zenput-portal]').forEach((el) => el.remove());
});

function BasicPopover() {
  return (
    <Popover>
      <PopoverTrigger>Toggle</PopoverTrigger>
      <PopoverContent aria-label="Pop">
        <button data-testid="inside">Inside</button>
      </PopoverContent>
    </Popover>
  );
}

describe('Popover', () => {
  it('is closed by default and opens on trigger click', () => {
    render(<BasicPopover />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: 'Toggle' }).click();
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('sets aria-expanded on the trigger', () => {
    render(<BasicPopover />);
    const trigger = screen.getByRole('button', { name: 'Toggle' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    act(() => {
      trigger.click();
    });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles closed when the trigger is clicked again', () => {
    render(<BasicPopover />);
    const trigger = screen.getByRole('button', { name: 'Toggle' });
    act(() => trigger.click());
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    act(() => trigger.click());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the trigger', () => {
    render(<BasicPopover />);
    const trigger = screen.getByRole('button', { name: 'Toggle' });
    act(() => trigger.click());
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes when clicking outside both trigger and content', () => {
    render(
      <div>
        <button data-testid="outside">outside</button>
        <BasicPopover />
      </div>
    );
    act(() => screen.getByRole('button', { name: 'Toggle' }).click());
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseDown(screen.getByTestId('outside'));
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not close when clicking inside the content', () => {
    render(<BasicPopover />);
    act(() => screen.getByRole('button', { name: 'Toggle' }).click());

    act(() => {
      fireEvent.mouseDown(screen.getByTestId('inside'));
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
