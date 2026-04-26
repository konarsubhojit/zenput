import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { PopoverProvider, usePopover } from './PopoverProvider';

afterEach(() => {
  document.querySelectorAll('[data-zenput-portal]').forEach((el) => el.remove());
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function PopoverButton({
  onResult,
  dismissible,
}: {
  onResult: (v: unknown) => void;
  dismissible?: boolean;
}) {
  const popover = usePopover();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      onClick={() => {
        const handle = popover.open({
          anchor: buttonRef as React.RefObject<HTMLElement>,
          dismissible,
          content: ({ close }) => (
            <div>
              <span>Popover content</span>
              <button onClick={() => close('value')}>Close</button>
            </div>
          ),
        });
        handle.result.then(onResult);
      }}
    >
      Open Popover
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('usePopover', () => {
  it('renders a popover when invoked', async () => {
    render(
      <PopoverProvider>
        <PopoverButton onResult={() => undefined} />
      </PopoverProvider>
    );

    await act(async () => {
      screen.getByText('Open Popover').click();
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('resolves with the close value', async () => {
    const results: unknown[] = [];
    render(
      <PopoverProvider>
        <PopoverButton onResult={(v) => results.push(v)} />
      </PopoverProvider>
    );

    await act(async () => {
      screen.getByText('Open Popover').click();
    });
    await act(async () => {
      screen.getByText('Close').click();
    });

    await waitFor(() => expect(results).toEqual(['value']));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape when dismissible (default)', async () => {
    render(
      <PopoverProvider>
        <PopoverButton onResult={() => undefined} />
      </PopoverProvider>
    );

    await act(async () => {
      screen.getByText('Open Popover').click();
    });
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not close on Escape when dismissible=false', async () => {
    render(
      <PopoverProvider>
        <PopoverButton dismissible={false} onResult={() => undefined} />
      </PopoverProvider>
    );

    await act(async () => {
      screen.getByText('Open Popover').click();
    });
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('accepts { x, y } as anchor', async () => {
    function CoordPopover() {
      const popover = usePopover();
      return (
        <button
          onClick={() => {
            popover.open({
              anchor: { x: 100, y: 100 },
              content: () => <span>At coordinates</span>,
            });
          }}
        >
          Open At Coords
        </button>
      );
    }

    render(
      <PopoverProvider>
        <CoordPopover />
      </PopoverProvider>
    );

    await act(async () => {
      screen.getByText('Open At Coords').click();
    });

    expect(screen.getByText('At coordinates')).toBeInTheDocument();
  });
});
