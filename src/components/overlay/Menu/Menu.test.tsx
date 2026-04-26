import React, { useState } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test-utils/axe';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
} from './Menu';

afterEach(() => {
  document.querySelectorAll('[data-zenput-portal]').forEach((el) => el.remove());
});

function BasicMenu() {
  return (
    <Menu>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuContent aria-label="Actions">
        <MenuItem>Apple</MenuItem>
        <MenuItem>Banana</MenuItem>
        <MenuItem>Cherry</MenuItem>
      </MenuContent>
    </Menu>
  );
}

function SubMenu() {
  return (
    <Menu>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuContent aria-label="Actions">
        <MenuItem>Item 1</MenuItem>
        <MenuSub>
          <MenuSubTrigger>More</MenuSubTrigger>
          <MenuSubContent aria-label="Sub actions">
            <MenuItem>Sub A</MenuItem>
            <MenuItem>Sub B</MenuItem>
          </MenuSubContent>
        </MenuSub>
      </MenuContent>
    </Menu>
  );
}

describe('Menu', () => {
  it('is closed by default and opens on trigger click', () => {
    render(<BasicMenu />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('sets aria-expanded on trigger', () => {
    render(<BasicMenu />);
    const trigger = screen.getByRole('button', { name: 'Open Menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    act(() => {
      trigger.click();
    });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on Escape and returns focus to trigger', async () => {
    render(<BasicMenu />);
    const trigger = screen.getByRole('button', { name: 'Open Menu' });

    act(() => {
      trigger.click();
    });

    const menuEl = screen.getByRole('menu');
    expect(menuEl).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(menuEl, { key: 'Escape' });
    });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it('ArrowDown moves focus to next item', async () => {
    render(<BasicMenu />);
    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');

    act(() => {
      items[0].focus();
    });

    act(() => {
      fireEvent.keyDown(menuEl, { key: 'ArrowDown' });
    });

    expect(document.activeElement).toBe(items[1]);
  });

  it('ArrowUp wraps to last item from first', async () => {
    render(<BasicMenu />);
    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');

    act(() => {
      items[0].focus();
    });

    act(() => {
      fireEvent.keyDown(menuEl, { key: 'ArrowUp' });
    });

    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  it('Home moves to first item', async () => {
    render(<BasicMenu />);
    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');

    act(() => {
      items[items.length - 1].focus();
    });

    act(() => {
      fireEvent.keyDown(menuEl, { key: 'Home' });
    });

    expect(document.activeElement).toBe(items[0]);
  });

  it('End moves to last item', async () => {
    render(<BasicMenu />);
    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');

    act(() => {
      items[0].focus();
    });

    act(() => {
      fireEvent.keyDown(menuEl, { key: 'End' });
    });

    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  it('Enter selects item, calls onSelect, closes menu', () => {
    const onSelect = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuItem onSelect={onSelect}>Apple</MenuItem>
          <MenuItem>Banana</MenuItem>
        </MenuContent>
      </Menu>
    );

    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');

    act(() => {
      items[0].focus();
    });

    act(() => {
      fireEvent.keyDown(menuEl, { key: 'Enter' });
    });

    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('Enter on focused item calls onSelect exactly once (no double invocation)', () => {
    const onSelect = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuItem onSelect={onSelect}>Apple</MenuItem>
          <MenuItem>Banana</MenuItem>
        </MenuContent>
      </Menu>
    );

    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const items = screen.getAllByRole('menuitem');

    act(() => {
      items[0].focus();
    });

    // Simulate the real user flow: keydown fires on the focused item and
    // bubbles up to the menu container. The item's own onKeyDown handles
    // it (calling e.preventDefault()), so the container must not call
    // focused.click() on top of it.
    act(() => {
      fireEvent.keyDown(items[0], { key: 'Enter', bubbles: true });
    });

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('Tab closes menu', () => {
    render(<BasicMenu />);
    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const menuEl = screen.getByRole('menu');
    expect(menuEl).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(menuEl, { key: 'Tab' });
    });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('type-ahead jumps to matching item', () => {
    render(<BasicMenu />);
    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');

    act(() => {
      items[0].focus();
    });

    act(() => {
      fireEvent.keyDown(menuEl, { key: 'b' });
    });

    const bananaItem = items.find((el) => el.textContent === 'Banana');
    expect(document.activeElement).toBe(bananaItem);
  });

  it('ArrowDown wraps from last item to first', () => {
    render(<BasicMenu />);
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');
    act(() => { items[items.length - 1].focus(); });
    act(() => { fireEvent.keyDown(menuEl, { key: 'ArrowDown' }); });
    expect(document.activeElement).toBe(items[0]);
  });

  it('ArrowLeft does nothing in a top-level menu (no onArrowLeft handler)', () => {
    render(<BasicMenu />);
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    const menuEl = screen.getByRole('menu');
    const items = screen.getAllByRole('menuitem');
    act(() => { items[0].focus(); });
    act(() => { fireEvent.keyDown(menuEl, { key: 'ArrowLeft' }); });
    // Menu should remain open and focus unchanged
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(document.activeElement).toBe(items[0]);
  });

  it('Space key activates focused item', () => {
    const onSelect = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuItem onSelect={onSelect}>Apple</MenuItem>
        </MenuContent>
      </Menu>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    const menuEl = screen.getByRole('menu');
    const item = screen.getByRole('menuitem');
    act(() => { item.focus(); });
    act(() => { fireEvent.keyDown(menuEl, { key: ' ' }); });
    expect(onSelect).toHaveBeenCalled();
  });

  it('MenuContent side="right" align="end" renders positioned menu', () => {
    render(
      <Menu defaultOpen>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent aria-label="Actions" side="right" align="end" withPortal={false}>
          <MenuItem>Item</MenuItem>
        </MenuContent>
      </Menu>
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('MenuContent side="right" align="center" renders positioned menu', () => {
    render(
      <Menu defaultOpen>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent aria-label="Actions" side="right" align="center" withPortal={false}>
          <MenuItem>Item</MenuItem>
        </MenuContent>
      </Menu>
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('MenuContent auto-focuses first item after open (RAF)', () => {
    vi.useFakeTimers();
    try {
      render(
        <Menu>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuContent aria-label="Actions" withPortal={false}>
            <MenuItem>Apple</MenuItem>
            <MenuItem>Banana</MenuItem>
          </MenuContent>
        </Menu>
      );
      act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
      // Flush the requestAnimationFrame that auto-focuses the first item
      act(() => { vi.runAllTimers(); });
      expect(document.activeElement).toBe(screen.getAllByRole('menuitem')[0]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('MenuSubContent auto-focuses first item after open (RAF)', () => {
    vi.useFakeTimers();
    try {
      render(<SubMenu />);
      act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
      act(() => { screen.getByRole('menuitem', { name: /More/i }).click(); });
      act(() => { vi.runAllTimers(); });
      const subMenu = screen.getByRole('menu', { name: 'Sub actions' });
      const subItems = Array.from(subMenu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
      expect(document.activeElement).toBe(subItems[0]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('type-ahead buffer resets after 500 ms', () => {
    vi.useFakeTimers();
    try {
      render(<BasicMenu />);
      act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
      const menuEl = screen.getByRole('menu');
      const items = screen.getAllByRole('menuitem');

      // Type 'b' → focuses Banana
      act(() => { items[0].focus(); });
      act(() => { fireEvent.keyDown(menuEl, { key: 'b' }); });
      expect(document.activeElement).toBe(items.find((el) => el.textContent === 'Banana'));

      // Advance past 500ms to reset the buffer
      act(() => { vi.advanceTimersByTime(600); });

      // Type 'c' on its own → focuses Cherry (not 'bc')
      act(() => { fireEvent.keyDown(menuEl, { key: 'c' }); });
      expect(document.activeElement).toBe(items.find((el) => el.textContent === 'Cherry'));
    } finally {
      vi.useRealTimers();
    }
  });

  it('focus returns to trigger on close', () => {
    render(<BasicMenu />);
    const trigger = screen.getByRole('button', { name: 'Open Menu' });

    act(() => {
      trigger.click();
    });

    const menuEl = screen.getByRole('menu');

    act(() => {
      fireEvent.keyDown(menuEl, { key: 'Escape' });
    });

    expect(document.activeElement).toBe(trigger);
  });

  it('outside mousedown closes menu', () => {
    render(
      <div>
        <BasicMenu />
        <button data-testid="outside">Outside</button>
      </div>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    expect(screen.getByRole('menu')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseDown(screen.getByTestId('outside'));
    });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disabled MenuItem does not call onSelect', () => {
    const onSelect = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuItem disabled onSelect={onSelect}>Disabled</MenuItem>
        </MenuContent>
      </Menu>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    act(() => { screen.getByRole('menuitem').click(); });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('MenuItem onClick is called and can prevent close with defaultPrevented', () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    const onSelect = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuItem onClick={onClick} onSelect={onSelect}>Item</MenuItem>
        </MenuContent>
      </Menu>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    act(() => { screen.getByRole('menuitem').click(); });
    expect(onClick).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    // menu stays open because e.preventDefault() was called
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('MenuContent withPortal=false renders inline (not in a portal)', () => {
    const { container } = render(
      <Menu defaultOpen>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent aria-label="Actions" withPortal={false}>
          <MenuItem>Item</MenuItem>
        </MenuContent>
      </Menu>
    );
    const menu = screen.getByRole('menu');
    expect(container).toContainElement(menu);
  });

  it('Menu controlled open/close via open prop', () => {
    function Controlled() {
      const [open, setOpen] = React.useState(false);
      return (
        <Menu open={open} onOpenChange={setOpen}>
          <MenuTrigger>Open Menu</MenuTrigger>
          <MenuContent aria-label="Actions">
            <MenuItem>Item</MenuItem>
          </MenuContent>
        </Menu>
      );
    }
    render(<Controlled />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    act(() => { screen.getByRole('button').click(); });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('MenuSeparator renders', () => {
    render(
      <Menu defaultOpen>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent aria-label="Actions" withPortal={false}>
          <MenuItem>Item</MenuItem>
          <MenuSeparator />
          <MenuItem>Item 2</MenuItem>
        </MenuContent>
      </Menu>
    );
    expect(document.querySelector('hr')).toBeInTheDocument();
  });

  it('MenuLabel renders with presentation role', () => {
    render(
      <Menu defaultOpen>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent aria-label="Actions" withPortal={false}>
          <MenuLabel>Section</MenuLabel>
          <MenuItem>Item</MenuItem>
        </MenuContent>
      </Menu>
    );
    expect(screen.getByText('Section')).toBeInTheDocument();
  });

  it('MenuCheckboxItem toggles checked', () => {
    const onCheckedChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
            Option
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
    );

    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const checkboxItem = screen.getByRole('menuitemcheckbox');
    act(() => {
      checkboxItem.click();
    });

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('MenuCheckboxItem Enter key toggles checked', () => {
    const onCheckedChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
            Option
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    const item = screen.getByRole('menuitemcheckbox');
    act(() => { fireEvent.keyDown(item, { key: 'Enter', bubbles: true }); });
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('MenuCheckboxItem disabled does not toggle', () => {
    const onCheckedChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuCheckboxItem checked={false} onCheckedChange={onCheckedChange} disabled>
            Option
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    act(() => { screen.getByRole('menuitemcheckbox').click(); });
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('MenuCheckboxItem shows check indicator when checked', () => {
    render(
      <Menu defaultOpen>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent aria-label="Actions" withPortal={false}>
          <MenuCheckboxItem checked>Option</MenuCheckboxItem>
        </MenuContent>
      </Menu>
    );
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('MenuRadioGroup changes value', () => {
    const onValueChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuRadioGroup value="a" onValueChange={onValueChange}>
            <MenuRadioItem value="a">Option A</MenuRadioItem>
            <MenuRadioItem value="b">Option B</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );

    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const radioItems = screen.getAllByRole('menuitemradio');
    const optionB = radioItems.find((el) => el.textContent?.includes('Option B'));
    act(() => {
      optionB!.click();
    });

    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('MenuRadioItem Enter key selects value', () => {
    const onValueChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuRadioGroup value="a" onValueChange={onValueChange}>
            <MenuRadioItem value="a">Option A</MenuRadioItem>
            <MenuRadioItem value="b">Option B</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    const items = screen.getAllByRole('menuitemradio');
    const optionB = items.find((el) => el.textContent?.includes('Option B'))!;
    act(() => { fireEvent.keyDown(optionB, { key: 'Enter', bubbles: true }); });
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('MenuRadioItem disabled does not call onValueChange', () => {
    const onValueChange = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuRadioGroup value="a" onValueChange={onValueChange}>
            <MenuRadioItem value="b" disabled>Option B</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    act(() => { screen.getByRole('menuitemradio').click(); });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('MenuRadioItem checked state reflects current value', () => {
    render(
      <Menu defaultOpen>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent aria-label="Actions" withPortal={false}>
          <MenuRadioGroup value="b" onValueChange={vi.fn()}>
            <MenuRadioItem value="a">A</MenuRadioItem>
            <MenuRadioItem value="b">B</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );
    const [itemA, itemB] = screen.getAllByRole('menuitemradio');
    expect(itemA).toHaveAttribute('aria-checked', 'false');
    expect(itemB).toHaveAttribute('aria-checked', 'true');
  });

  // ── Submenu ──────────────────────────────────────────────────────────────

  it('MenuSub opens on MenuSubTrigger click', () => {
    render(<SubMenu />);
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    expect(screen.queryAllByRole('menu')).toHaveLength(1);

    act(() => { screen.getByRole('menuitem', { name: /More/i }).click(); });

    expect(screen.getAllByRole('menu')).toHaveLength(2);
  });

  it('MenuSub opens on MouseEnter', () => {
    render(<SubMenu />);
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    const subTrigger = screen.getByRole('menuitem', { name: /More/i });

    act(() => { fireEvent.mouseEnter(subTrigger); });

    expect(screen.getAllByRole('menu')).toHaveLength(2);
  });

  it('MenuSub opens on ArrowRight key', () => {
    render(<SubMenu />);
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    const subTrigger = screen.getByRole('menuitem', { name: /More/i });

    act(() => { fireEvent.keyDown(subTrigger, { key: 'ArrowRight', bubbles: true }); });

    expect(screen.getAllByRole('menu')).toHaveLength(2);
  });

  it('MenuSubContent ArrowLeft closes submenu and focuses sub-trigger', () => {
    render(<SubMenu />);
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    const subTrigger = screen.getByRole('menuitem', { name: /More/i });
    act(() => { subTrigger.click(); });

    const menus = screen.getAllByRole('menu');
    const subMenu = menus[menus.length - 1];

    act(() => { fireEvent.keyDown(subMenu, { key: 'ArrowLeft' }); });

    expect(screen.getAllByRole('menu')).toHaveLength(1);
    expect(document.activeElement).toBe(subTrigger);
  });

  it('MenuSubContent Escape closes submenu and focuses sub-trigger', () => {
    render(<SubMenu />);
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    const subTrigger = screen.getByRole('menuitem', { name: /More/i });
    act(() => { subTrigger.click(); });

    const menus = screen.getAllByRole('menu');
    const subMenu = menus[menus.length - 1];

    act(() => { fireEvent.keyDown(subMenu, { key: 'Escape' }); });

    expect(screen.getAllByRole('menu')).toHaveLength(1);
    expect(document.activeElement).toBe(subTrigger);
  });

  it('MenuSubContent Tab closes submenu and parent, focuses trigger', () => {
    render(<SubMenu />);
    const trigger = screen.getByRole('button', { name: 'Open Menu' });
    act(() => { trigger.click(); });
    act(() => { screen.getByRole('menuitem', { name: /More/i }).click(); });

    const menus = screen.getAllByRole('menu');
    const subMenu = menus[menus.length - 1];

    act(() => { fireEvent.keyDown(subMenu, { key: 'Tab' }); });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it('MenuSubContent ArrowDown/Up navigate items', () => {
    render(<SubMenu />);
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    act(() => { screen.getByRole('menuitem', { name: /More/i }).click(); });

    const subMenu = screen.getByRole('menu', { name: 'Sub actions' });
    const subItems = Array.from(subMenu.querySelectorAll<HTMLElement>('[role="menuitem"]'));

    act(() => { subItems[0].focus(); });
    act(() => { fireEvent.keyDown(subMenu, { key: 'ArrowDown' }); });
    expect(document.activeElement).toBe(subItems[1]);

    act(() => { fireEvent.keyDown(subMenu, { key: 'ArrowUp' }); });
    expect(document.activeElement).toBe(subItems[0]);
  });

  it('outside mousedown closes submenu and parent menu', () => {
    render(
      <div>
        <SubMenu />
        <button data-testid="outside">Outside</button>
      </div>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    act(() => { screen.getByRole('menuitem', { name: /More/i }).click(); });
    expect(screen.getAllByRole('menu')).toHaveLength(2);

    act(() => { fireEvent.mouseDown(screen.getByTestId('outside')); });

    expect(screen.queryAllByRole('menu')).toHaveLength(0);
  });

  it('MenuSubTrigger disabled does not open submenu', () => {
    render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuSub>
            <MenuSubTrigger disabled>More</MenuSubTrigger>
            <MenuSubContent aria-label="Sub">
              <MenuItem>Sub A</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
    );
    act(() => { screen.getByRole('button', { name: 'Open Menu' }).click(); });
    act(() => { screen.getByRole('menuitem', { name: /More/i }).click(); });
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });

  it('portal rendering - menu renders outside main tree', () => {
    render(
      <div data-testid="wrapper">
        <BasicMenu />
      </div>
    );

    act(() => {
      screen.getByRole('button', { name: 'Open Menu' }).click();
    });

    const wrapper = screen.getByTestId('wrapper');
    const menu = screen.getByRole('menu');
    expect(wrapper).not.toContainElement(menu);
  });

  it('axe accessibility check', async () => {
    const { container } = render(
      <Menu defaultOpen>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent aria-label="Actions">
          <MenuItem>Apple</MenuItem>
          <MenuItem>Banana</MenuItem>
          <MenuItem disabled>Cherry (disabled)</MenuItem>
        </MenuContent>
      </Menu>
    );

    await expectNoA11yViolations(container);
  });
});
