import React, { useRef, useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useRovingTabIndex } from './useRovingTabIndex';

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

interface HarnessProps {
  items: string[];
  defaultActive?: string;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  disabledItems?: string[];
}

function Harness({ items, defaultActive, orientation, loop, disabledItems }: HarnessProps) {
  const [active, setActive] = useState(defaultActive ?? items[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { getTabIndex, onKeyDown } = useRovingTabIndex({
    items,
    activeItem: active,
    orientation,
    onNavigate: setActive,
    loop,
    disabledItems,
    containerRef,
  });

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- roving-tabindex container handles arrow-key navigation
    <div ref={containerRef} role="group" onKeyDown={onKeyDown} data-testid="container">
      {items.map((id) => (
        <button
          key={id}
          tabIndex={getTabIndex(id)}
          data-rti-value={id}
          data-testid={`item-${id}`}
          onClick={() => setActive(id)}
        >
          {id}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useRovingTabIndex', () => {
  it('gives tabIndex 0 to the active item and -1 to others', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="b" />);
    expect(screen.getByTestId('item-a')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByTestId('item-b')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('item-c')).toHaveAttribute('tabindex', '-1');
  });

  it('navigates forward with ArrowRight (horizontal)', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="a" orientation="horizontal" />);
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'ArrowRight' });
    expect(screen.getByTestId('item-b')).toHaveAttribute('tabindex', '0');
  });

  it('navigates backward with ArrowLeft (horizontal)', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="b" orientation="horizontal" />);
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'ArrowLeft' });
    expect(screen.getByTestId('item-a')).toHaveAttribute('tabindex', '0');
  });

  it('navigates forward with ArrowDown (vertical)', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="a" orientation="vertical" />);
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'ArrowDown' });
    expect(screen.getByTestId('item-b')).toHaveAttribute('tabindex', '0');
  });

  it('navigates backward with ArrowUp (vertical)', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="b" orientation="vertical" />);
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'ArrowUp' });
    expect(screen.getByTestId('item-a')).toHaveAttribute('tabindex', '0');
  });

  it('loops from last to first', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="c" loop />);
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'ArrowRight' });
    expect(screen.getByTestId('item-a')).toHaveAttribute('tabindex', '0');
  });

  it('does not loop when loop=false', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="c" loop={false} />);
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'ArrowRight' });
    // Active stays at 'c'
    expect(screen.getByTestId('item-c')).toHaveAttribute('tabindex', '0');
  });

  it('jumps to first with Home key', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="c" />);
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'Home' });
    expect(screen.getByTestId('item-a')).toHaveAttribute('tabindex', '0');
  });

  it('jumps to last with End key', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="a" />);
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'End' });
    expect(screen.getByTestId('item-c')).toHaveAttribute('tabindex', '0');
  });

  it('skips disabled items during navigation', () => {
    render(
      <Harness items={['a', 'b', 'c']} defaultActive="a" disabledItems={['b']} />
    );
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'ArrowRight' });
    // 'b' is disabled, so should jump to 'c'
    expect(screen.getByTestId('item-c')).toHaveAttribute('tabindex', '0');
  });

  it('does nothing for unrelated keys', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="b" />);
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'Enter' });
    // Active stays at 'b'
    expect(screen.getByTestId('item-b')).toHaveAttribute('tabindex', '0');
  });

  it('focuses the DOM element matching the next item when containerRef is provided', () => {
    render(<Harness items={['a', 'b', 'c']} defaultActive="a" orientation="horizontal" />);
    // Focus the first item so the container has a focused child
    screen.getByTestId('item-a').focus();
    fireEvent.keyDown(screen.getByTestId('container'), { key: 'ArrowRight' });
    // The hook should have called .focus() on item-b via the containerRef
    expect(document.activeElement).toBe(screen.getByTestId('item-b'));
  });
});
