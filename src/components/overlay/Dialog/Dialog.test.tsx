import React, { useState } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from './Dialog';

// Remove any shared portal host between tests so they are isolated.
afterEach(() => {
  document.querySelectorAll('[data-zenput-portal]').forEach((el) => el.remove());
});

function BasicDialog({
  onOpenChange,
  defaultOpen,
}: {
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  return (
    <Dialog defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <button data-testid="inner-btn">Inner</button>
        </DialogBody>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('is closed by default and opens on trigger click', () => {
    render(<BasicDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: 'Open' }).click();
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('wires aria-labelledby and aria-describedby', () => {
    render(<BasicDialog defaultOpen />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)).toHaveTextContent(
      'Title'
    );
  });

  it('closes on Escape when closeOnEscape is not disabled', () => {
    render(<BasicDialog defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not close on Escape when closeOnEscape=false', () => {
    render(
      <Dialog defaultOpen closeOnEscape={false}>
        <DialogContent aria-label="No escape">
          <DialogBody>content</DialogBody>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes when DialogClose is clicked', () => {
    render(<BasicDialog defaultOpen />);
    act(() => {
      screen.getByRole('button', { name: 'Cancel' }).click();
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when clicking outside the content (backdrop)', () => {
    render(<BasicDialog defaultOpen />);
    const overlay = document.querySelector<HTMLElement>('[data-zp-dialog-overlay]');
    expect(overlay).not.toBeNull();

    act(() => {
      fireEvent.mouseDown(overlay!);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not close on backdrop click when closeOnOverlayClick=false', () => {
    render(
      <Dialog defaultOpen closeOnOverlayClick={false}>
        <DialogContent aria-label="No backdrop">
          <DialogBody>content</DialogBody>
        </DialogContent>
      </Dialog>
    );
    const overlay = document.querySelector<HTMLElement>('[data-zp-dialog-overlay]');
    expect(overlay).not.toBeNull();

    act(() => {
      fireEvent.mouseDown(overlay!);
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('restores focus to the trigger on close', () => {
    render(<BasicDialog />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    trigger.focus();

    act(() => {
      trigger.click();
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(document.activeElement).toBe(trigger);
  });

  it('calls onOpenChange when state transitions', () => {
    const changes: boolean[] = [];
    render(<BasicDialog onOpenChange={(o) => changes.push(o)} />);

    act(() => {
      screen.getByRole('button', { name: 'Open' }).click();
    });
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(changes).toEqual([true, false]);
  });

  it('works in controlled mode', () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent aria-label="Controlled">
            <DialogBody>body</DialogBody>
          </DialogContent>
        </Dialog>
      );
    }
    render(<Controlled />);

    act(() => {
      screen.getByRole('button', { name: 'Open' }).click();
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('traps focus inside the content when open', () => {
    render(<BasicDialog defaultOpen />);
    // Focus should be on first tabbable element inside content, which is the
    // inner button (DialogTitle/Description are not tabbable).
    expect(document.activeElement).toBe(screen.getByTestId('inner-btn'));
  });

  it('warns (in dev) when open without an accessible name', () => {
    vi.useFakeTimers();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogBody>no title, no aria-label</DialogBody>
        </DialogContent>
      </Dialog>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/no accessible name/i));
    warn.mockRestore();
    vi.useRealTimers();
  });
});
