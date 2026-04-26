import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  DrawerProvider,
  useDrawer,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
} from './DrawerProvider';

afterEach(() => {
  document.querySelectorAll('[data-zenput-portal]').forEach((el) => el.remove());
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function DrawerButton({
  options,
  onResult,
}: {
  options?: Omit<Parameters<ReturnType<typeof useDrawer>['open']>[0], 'content'>;
  onResult: (v: unknown) => void;
}) {
  const drawer = useDrawer();
  return (
    <button
      onClick={() => {
        const handle = drawer.open({
          ...options,
          content: ({ close }) => (
            <>
              <DrawerHeader>
                <DrawerTitle>Imperative Drawer</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <button onClick={() => close('done')}>Confirm</button>
                <button onClick={() => close()}>Cancel</button>
              </DrawerBody>
              <DrawerFooter />
            </>
          ),
        });
        handle.result.then(onResult);
      }}
    >
      Open Drawer
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useDrawer', () => {
  it('renders a drawer when invoked', async () => {
    render(
      <DrawerProvider>
        <DrawerButton onResult={() => undefined} />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Drawer').click();
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Imperative Drawer')).toBeInTheDocument();
  });

  it('resolves with the close value when Confirm is clicked', async () => {
    const results: unknown[] = [];
    render(
      <DrawerProvider>
        <DrawerButton onResult={(v) => results.push(v)} />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Drawer').click();
    });
    await act(async () => {
      screen.getByText('Confirm').click();
    });

    await waitFor(() => expect(results).toEqual(['done']));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('resolves null when Cancel is clicked', async () => {
    const results: unknown[] = [];
    render(
      <DrawerProvider>
        <DrawerButton onResult={(v) => results.push(v)} />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Drawer').click();
    });
    await act(async () => {
      screen.getByText('Cancel').click();
    });

    await waitFor(() => expect(results).toEqual([null]));
  });

  it('closes on Escape when dismissible (default)', async () => {
    render(
      <DrawerProvider>
        <DrawerButton onResult={() => undefined} />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Drawer').click();
    });
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not close on Escape when dismissible=false', async () => {
    render(
      <DrawerProvider>
        <DrawerButton options={{ dismissible: false }} onResult={() => undefined} />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Drawer').click();
    });
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders from the specified side', async () => {
    render(
      <DrawerProvider>
        <DrawerButton options={{ side: 'left' }} onResult={() => undefined} />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Drawer').click();
    });

    const drawerPanel = document.querySelector('[data-side="left"]');
    expect(drawerPanel).not.toBeNull();
  });

  it('stacks multiple drawers', async () => {
    function StackedDrawer() {
      const drawer = useDrawer();
      return (
        <button
          onClick={() => {
            drawer.open({ content: () => <DrawerTitle>First</DrawerTitle> });
            drawer.open({ content: () => <DrawerTitle>Second</DrawerTitle> });
          }}
        >
          Open Both
        </button>
      );
    }

    render(
      <DrawerProvider>
        <StackedDrawer />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Both').click();
    });

    expect(screen.getAllByRole('dialog').length).toBe(2);
  });

  it('renders with the specified size', async () => {
    function SizedDrawer() {
      const drawer = useDrawer();
      return (
        <button
          onClick={() =>
            drawer.open({
              size: 'lg',
              content: () => <DrawerTitle>Big drawer</DrawerTitle>,
            })
          }
        >
          Open Big
        </button>
      );
    }

    render(
      <DrawerProvider>
        <SizedDrawer />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Big').click();
    });

    expect(screen.getByText('Big drawer')).toBeInTheDocument();
  });

  it('throws when useDrawer is called outside DrawerProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => {
      render(<DrawerButton onResult={() => undefined} />);
    }).toThrow(/DrawerProvider/);
    spy.mockRestore();
  });

  it('resolves pending promises with null on provider unmount', async () => {
    const results: unknown[] = [];

    function App() {
      const drawer = useDrawer();
      return (
        <button
          onClick={() => {
            const handle = drawer.open({ content: () => <DrawerTitle>X</DrawerTitle> });
            handle.result.then((v) => results.push(v));
          }}
        >
          Open
        </button>
      );
    }

    const { unmount } = render(
      <DrawerProvider>
        <App />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open').click();
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    unmount();
    await act(async () => {
      await Promise.resolve();
    });

    expect(results).toEqual([null]);
  });
});

describe('DrawerProvider - stacked dismissal', () => {
  it('dismisses only the topmost stacked drawer on Escape', async () => {
    function StackedDrawer() {
      const drawer = useDrawer();
      return (
        <button
          onClick={() => {
            drawer.open({ content: () => <DrawerTitle>First drawer</DrawerTitle> });
            drawer.open({ content: () => <DrawerTitle>Second drawer</DrawerTitle> });
          }}
        >
          Open Both
        </button>
      );
    }

    render(
      <DrawerProvider>
        <StackedDrawer />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Both').click();
    });

    expect(screen.getAllByRole('dialog')).toHaveLength(2);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    await waitFor(() => {
      expect(screen.queryByText('Second drawer')).not.toBeInTheDocument();
    });
    expect(screen.getByText('First drawer')).toBeInTheDocument();
  });

  it('does not dismiss the underlying drawer when topmost is non-dismissible', async () => {
    function StackedDrawer() {
      const drawer = useDrawer();
      return (
        <button
          onClick={() => {
            drawer.open({ content: () => <DrawerTitle>First drawer</DrawerTitle> });
            drawer.open({
              dismissible: false,
              content: () => <DrawerTitle>Second drawer</DrawerTitle>,
            });
          }}
        >
          Open Both
        </button>
      );
    }

    render(
      <DrawerProvider>
        <StackedDrawer />
      </DrawerProvider>
    );

    await act(async () => {
      screen.getByText('Open Both').click();
    });

    expect(screen.getAllByRole('dialog')).toHaveLength(2);

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.getAllByRole('dialog')).toHaveLength(2);
    expect(screen.getByText('First drawer')).toBeInTheDocument();
    expect(screen.getByText('Second drawer')).toBeInTheDocument();
  });
});
