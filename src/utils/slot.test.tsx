import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slot } from './slot';

describe('Slot', () => {
  it('clones its single child and passes through children content', () => {
    render(
      <Slot>
        <span>hello</span>
      </Slot>
    );
    expect(screen.getByText('hello').tagName).toBe('SPAN');
  });

  it('merges className onto the child', () => {
    render(
      <Slot className="parent-class">
        <span className="child-class">text</span>
      </Slot>
    );
    const el = screen.getByText('text');
    expect(el.className).toContain('parent-class');
    expect(el.className).toContain('child-class');
  });

  it('merges style objects (child wins on conflicts)', () => {
    render(
      <Slot style={{ color: 'red', fontSize: '14px' }}>
        <span style={{ color: 'blue' }}>text</span>
      </Slot>
    );
    const el = screen.getByText('text') as HTMLElement;
    // Child's color wins
    expect(el.style.color).toBe('blue');
    // Parent's fontSize is preserved
    expect(el.style.fontSize).toBe('14px');
  });

  it('composes event handlers (child fires first, then slot)', () => {
    const order: string[] = [];
    const slotClick = () => order.push('slot');
    const childClick = () => order.push('child');

    render(
      <Slot onClick={slotClick}>
        <button type="button" onClick={childClick}>
          click
        </button>
      </Slot>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(order).toEqual(['child', 'slot']);
  });

  it('child prop wins for non-event, non-className, non-style props', () => {
    render(
      <Slot data-testid="slot-id">
        <span data-testid="child-id">text</span>
      </Slot>
    );
    expect(screen.getByTestId('child-id')).toBeInTheDocument();
  });

  it('merges forwarded ref with child ref', () => {
    const forwardedRef = createRef<HTMLSpanElement>();
    const childRef = createRef<HTMLSpanElement>();

    render(
      // In React 19 `ref` is a prop; pass it directly on the child element.
      <Slot ref={forwardedRef}>
        <span ref={childRef}>text</span>
      </Slot>
    );

    const el = screen.getByText('text');
    expect(forwardedRef.current).toBe(el);
    expect(childRef.current).toBe(el);
  });

  it('returns null when given no valid React element child', () => {
    const { container } = render(<Slot>{null}</Slot>);
    expect(container.firstChild).toBeNull();
  });
});
