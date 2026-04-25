import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
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

  it('positions menu at right-click coordinates', () => {
    render(<BasicContextMenu />);
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('trigger-area'), { clientX: 150, clientY: 250 });
    });
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
  });
});
