import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerClose,
} from './Drawer';

afterEach(() => {
  document.querySelectorAll('[data-zenput-portal]').forEach((el) => el.remove());
});

function BasicDrawer({ side }: { side?: 'left' | 'right' | 'top' | 'bottom' }) {
  return (
    <Drawer>
      <DrawerTrigger>Open drawer</DrawerTrigger>
      <DrawerContent side={side}>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <button data-testid="inner">Inner</button>
        </DrawerBody>
        <DrawerClose>Close</DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('opens on trigger click and renders role=dialog with aria-modal', () => {
    render(<BasicDrawer />);
    act(() => {
      screen.getByRole('button', { name: 'Open drawer' }).click();
    });
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('applies the requested side via data-side', () => {
    render(<BasicDrawer side="left" />);
    act(() => {
      screen.getByRole('button', { name: 'Open drawer' }).click();
    });
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'left');
  });

  it('closes on Escape', () => {
    render(<BasicDrawer />);
    act(() => {
      screen.getByRole('button', { name: 'Open drawer' }).click();
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on backdrop click', () => {
    render(<BasicDrawer />);
    act(() => {
      screen.getByRole('button', { name: 'Open drawer' }).click();
    });
    const overlay = document.querySelector('[data-zp-drawer-overlay]') as HTMLElement;
    act(() => {
      fireEvent.mouseDown(overlay);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when DrawerClose is clicked', () => {
    render(<BasicDrawer />);
    act(() => {
      screen.getByRole('button', { name: 'Open drawer' }).click();
    });
    act(() => {
      screen.getByRole('button', { name: 'Close' }).click();
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
