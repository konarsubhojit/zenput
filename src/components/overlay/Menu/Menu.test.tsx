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
