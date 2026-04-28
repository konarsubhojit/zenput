import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { LiveRegion, useAnnounce } from './LiveRegion';
import { expectNoA11yViolations } from '../../../test-utils/axe';

// ---------------------------------------------------------------------------
// Helper consumer component
// ---------------------------------------------------------------------------

function Announcer({ message, politeness }: { message: string; politeness?: 'polite' | 'assertive' }) {
  const announce = useAnnounce();
  return (
    <button
      onClick={() => announce(message, politeness ? { politeness } : undefined)}
    >
      announce
    </button>
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe('LiveRegion', () => {
  it('renders polite and assertive live regions', () => {
    render(<LiveRegion />);
    expect(screen.getByTestId('live-region-polite')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByTestId('live-region-assertive')).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders children', () => {
    render(<LiveRegion><span data-testid="child">hello</span></LiveRegion>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('updates polite region when announce() is called', () => {
    render(
      <LiveRegion>
        <Announcer message="3 results found" />
      </LiveRegion>
    );
    act(() => {
      screen.getByRole('button').click();
    });
    expect(screen.getByTestId('live-region-polite')).toHaveTextContent('3 results found');
  });

  it('updates assertive region for assertive announcements', () => {
    render(
      <LiveRegion>
        <Announcer message="Form saved" politeness="assertive" />
      </LiveRegion>
    );
    act(() => {
      screen.getByRole('button').click();
    });
    expect(screen.getByTestId('live-region-assertive')).toHaveTextContent('Form saved');
    expect(screen.getByTestId('live-region-polite')).toHaveTextContent('');
  });

  it('debounces re-announcement of identical messages', () => {
    vi.useFakeTimers();
    render(
      <LiveRegion>
        <Announcer message="same message" />
      </LiveRegion>
    );
    const btn = screen.getByRole('button');

    // First click
    act(() => { btn.click(); });
    expect(screen.getByTestId('live-region-polite')).toHaveTextContent('same message');

    // Second click with same message — region should be cleared first
    act(() => { btn.click(); });
    expect(screen.getByTestId('live-region-polite')).toHaveTextContent('');

    // After debounce timer, message is re-set
    act(() => { vi.runAllTimers(); });
    expect(screen.getByTestId('live-region-polite')).toHaveTextContent('same message');
  });
});

describe('useAnnounce', () => {
  it('throws when used outside <LiveRegion>', () => {
    // Suppress the React error boundary console.error noise in tests
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(<Announcer message="oops" />);
    }).toThrow('useAnnounce must be called inside a <LiveRegion>.');
    spy.mockRestore();
  });
});

describe('LiveRegion a11y (axe)', () => {
  it('has no detectable axe violations', async () => {
    const { container } = render(<LiveRegion><p>content</p></LiveRegion>);
    await expectNoA11yViolations(container);
  });
});
