import React, { useRef } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { FocusScope } from './FocusScope';
import { expectNoA11yViolations } from '../../../test-utils/axe';

afterEach(() => {
  // Restore focus to body after each test.
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
});

function createTabEvent(shiftKey: boolean): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey,
    bubbles: true,
    cancelable: true,
  });
}

describe('FocusScope', () => {
  it('renders children without trapping focus when trapped=false', () => {
    render(
      <FocusScope>
        <button data-testid="btn">click me</button>
      </FocusScope>
    );
    expect(screen.getByTestId('btn')).toBeInTheDocument();
  });

  it('auto-focuses the first tabbable element when trapped=true', () => {
    render(
      <FocusScope trapped>
        <button data-testid="first">first</button>
        <button data-testid="second">second</button>
      </FocusScope>
    );
    expect(document.activeElement).toBe(screen.getByTestId('first'));
  });

  it('does not auto-focus when autoFocus=false', () => {
    render(
      // eslint-disable-next-line jsx-a11y/no-autofocus -- testing the autoFocus prop of FocusScope (not a native HTML autofocus)
      <FocusScope trapped autoFocus={false}>
        <button data-testid="btn">btn</button>
      </FocusScope>
    );
    // Focus stays where it was (body or previous element), not on btn
    expect(document.activeElement).not.toBe(screen.getByTestId('btn'));
  });

  it('traps Tab: wraps from last to first', () => {
    render(
      <FocusScope trapped>
        <button data-testid="btn-1">1</button>
        <button data-testid="btn-2">2</button>
        <button data-testid="btn-3">3</button>
      </FocusScope>
    );

    screen.getByTestId('btn-3').focus();
    expect(document.activeElement).toBe(screen.getByTestId('btn-3'));

    act(() => {
      document.dispatchEvent(createTabEvent(false));
    });
    expect(document.activeElement).toBe(screen.getByTestId('btn-1'));
  });

  it('traps Shift+Tab: wraps from first to last', () => {
    render(
      <FocusScope trapped>
        <button data-testid="btn-1">1</button>
        <button data-testid="btn-2">2</button>
        <button data-testid="btn-3">3</button>
      </FocusScope>
    );

    screen.getByTestId('btn-1').focus();
    act(() => {
      document.dispatchEvent(createTabEvent(true));
    });
    expect(document.activeElement).toBe(screen.getByTestId('btn-3'));
  });

  it('uses the `as` prop to render a different element', () => {
    render(
      <FocusScope as="section" data-testid="scope">
        <button>btn</button>
      </FocusScope>
    );
    expect(screen.getByTestId('scope').tagName).toBe('SECTION');
  });

  it('accepts an initialFocusRef to set the initial focus target', () => {
    function Harness() {
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <FocusScope trapped initialFocusRef={ref}>
          <button data-testid="first">first</button>
          <button ref={ref} data-testid="second">second</button>
        </FocusScope>
      );
    }
    render(<Harness />);
    expect(document.activeElement).toBe(screen.getByTestId('second'));
  });
});

describe('FocusScope a11y (axe)', () => {
  it('has no detectable axe violations', async () => {
    const { container } = render(
      <FocusScope role="dialog" aria-label="Test dialog">
        <button>close</button>
      </FocusScope>
    );
    await expectNoA11yViolations(container);
  });
});
