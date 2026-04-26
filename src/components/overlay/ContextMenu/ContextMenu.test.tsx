import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent } from './ContextMenu';
import { MenuItem } from '../Menu/Menu';

afterEach(() => {
  document.querySelectorAll('[data-zenput-portal]').forEach((el) => el.remove());
});

function BasicContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div data-testid="trigger-area">Right click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Context actions">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

describe('ContextMenu', () => {
  it('is hidden by default', () => {
    render(<BasicContextMenu />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens on right-click (contextmenu event)', () => {
    render(<BasicContextMenu />);
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 100, clientY: 200 });
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<BasicContextMenu />);
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 100, clientY: 200 });
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on Tab', () => {
    render(<BasicContextMenu />);
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 100, clientY: 200 });
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
    });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on outside mousedown', () => {
    render(
      <div>
        <BasicContextMenu />
        <button data-testid="outside">Outside</button>
      </div>
    );
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 50, clientY: 50 });
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseDown(screen.getByTestId('outside'));
    });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ArrowDown moves focus to next item', () => {
    render(<BasicContextMenu />);
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 100, clientY: 200 });
    });
    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');
    act(() => { items[0].focus(); });
    act(() => { fireEvent.keyDown(menuEl, { key: 'ArrowDown' }); });
    expect(document.activeElement).toBe(items[1]);
  });

  it('ArrowUp moves focus to previous item', () => {
    render(<BasicContextMenu />);
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 100, clientY: 200 });
    });
    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');
    act(() => { items[1].focus(); });
    act(() => { fireEvent.keyDown(menuEl, { key: 'ArrowUp' }); });
    expect(document.activeElement).toBe(items[0]);
  });

  it('type-ahead jumps to matching item', () => {
    render(<BasicContextMenu />);
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 100, clientY: 200 });
    });
    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');
    act(() => { items[0].focus(); });
    act(() => { fireEvent.keyDown(menuEl, { key: 'p' }); });
    const pasteItem = items.find((el) => el.textContent === 'Paste');
    expect(document.activeElement).toBe(pasteItem);
  });

  it('positions menu at right-click coordinates', () => {
    render(<BasicContextMenu />);
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 150, clientY: 250 });
    });
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
  });

  it('Space key activates focused item', () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent aria-label="Context actions">
          <MenuItem onSelect={onSelect}>Cut</MenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 100, clientY: 200 });
    });
    const menuEl = screen.getByRole('menu');
    const item = screen.getByRole('menuitem');
    act(() => { item.focus(); });
    act(() => { fireEvent.keyDown(menuEl, { key: ' ' }); });
    expect(onSelect).toHaveBeenCalled();
  });

  it('auto-focuses first item after open (RAF)', () => {
    vi.useFakeTimers();
    try {
      render(<BasicContextMenu />);
      act(() => {
        fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 50, clientY: 50 });
      });
      act(() => { vi.runAllTimers(); });
      const items = screen.getAllByRole('menuitem');
      expect(document.activeElement).toBe(items[0]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('closes on outside touchstart', () => {
    render(
      <div>
        <BasicContextMenu />
        <button data-testid="outside">Outside</button>
      </div>
    );
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 50, clientY: 50 });
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();

    act(() => {
      fireEvent.touchStart(screen.getByTestId('outside'));
    });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ContextMenu controlled open/close via open prop', () => {
    function Controlled() {
      const [open, setOpen] = React.useState(false);
      return (
        <ContextMenu open={open} onOpenChange={setOpen}>
          <ContextMenuTrigger>
            <div data-testid="trigger-area">Right click here</div>
          </ContextMenuTrigger>
          <ContextMenuContent aria-label="Actions">
            <MenuItem>Cut</MenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    }
    render(<Controlled />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 10, clientY: 10 });
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
