import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { Alert } from './Alert';
import { LiveRegion } from '../../a11y/LiveRegion/LiveRegion';
import { expectNoA11yViolations } from '../../../test-utils/axe';

describe('Alert', () => {
  it('renders title and description', () => {
    render(<Alert title="Saved">Your changes have been saved.</Alert>);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
  });

  it('uses role="status" for non-error tones', () => {
    render(<Alert tone="info" title="Heads up" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses role="alert" for error tone by default', () => {
    render(<Alert tone="error" title="Oh no" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('honours explicit assertive override', () => {
    render(<Alert tone="info" assertive title="Important" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders the default icon for the tone', () => {
    const { container } = render(<Alert tone="success" title="Done" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('suppresses the icon when icon={null}', () => {
    const { container } = render(<Alert tone="success" title="Done" icon={null} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders a custom icon', () => {
    render(<Alert tone="info" title="Hi" icon={<svg data-testid="custom-icon" />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders the action slot', () => {
    render(
      <Alert tone="error" title="Failed" action={<button type="button">Retry</button>}>
        Something went wrong.
      </Alert>
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('shows a dismiss button when onDismiss is provided', async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Bye" onDismiss={onDismiss} />);
    const btn = screen.getByRole('button', { name: 'Dismiss' });
    await userEvent.click(btn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render a dismiss button when onDismiss is omitted', () => {
    render(<Alert title="Static" />);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
  });

  it('uses a localized dismiss label', () => {
    render(<Alert title="x" onDismiss={() => undefined} dismissLabel="Cerrar" />);
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  // ── New: status alias ───────────────────────────────────────────────────

  it('accepts status prop as an alias for tone', () => {
    render(<Alert status="error" title="Alias test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('status="info" renders role="status"', () => {
    render(<Alert status="info" title="Info via status" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('tone takes precedence over status when both are provided', () => {
    render(<Alert tone="info" status="error" title="Precedence" />);
    // tone="info" → non-assertive → role="status"
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // ── New: dismissible prop ───────────────────────────────────────────────

  it('shows a dismiss button when dismissible=true even without onDismiss', () => {
    render(<Alert title="Closeable" dismissible />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('calls onDismiss when dismissible=true and onDismiss is provided', async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Closeable" dismissible onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('hides dismiss button when dismissible=false even if onDismiss is supplied', () => {
    render(<Alert title="Hidden" dismissible={false} onDismiss={() => undefined} />);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
  });

  // ── New: Alert.Action compound component ───────────────────────────────

  it('extracts Alert.Action from children into the trailing action slot', () => {
    render(
      <Alert tone="error" title="Sync failed">
        3 orders failed.
        <Alert.Action>
          <button type="button">Retry</button>
        </Alert.Action>
      </Alert>
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.getByText('3 orders failed.')).toBeInTheDocument();
  });

  it('action prop takes precedence over Alert.Action child', () => {
    render(
      <Alert
        title="Precedence"
        action={<button type="button">Prop Action</button>}
      >
        <Alert.Action>
          <button type="button">Child Action</button>
        </Alert.Action>
      </Alert>
    );
    expect(screen.getByRole('button', { name: 'Prop Action' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Child Action' })).not.toBeInTheDocument();
  });

  it('Alert.Action displayName is "Alert.Action"', () => {
    expect(Alert.Action.displayName).toBe('Alert.Action');
  });

  // ── New: LiveRegion integration ─────────────────────────────────────────

  it('announces title via LiveRegion context on mount (polite)', async () => {
    vi.useFakeTimers();
    render(
      <LiveRegion>
        <Alert tone="info" title="File uploaded" />
      </LiveRegion>
    );
    act(() => { vi.runAllTimers(); });
    expect(screen.getByTestId('live-region-polite')).toHaveTextContent('File uploaded');
    vi.useRealTimers();
  });

  it('announces title via LiveRegion context assertively for error tone', async () => {
    vi.useFakeTimers();
    render(
      <LiveRegion>
        <Alert tone="error" title="Sync failed" />
      </LiveRegion>
    );
    act(() => { vi.runAllTimers(); });
    expect(screen.getByTestId('live-region-assertive')).toHaveTextContent('Sync failed');
    vi.useRealTimers();
  });

  it('works without a LiveRegion provider (falls back to inline aria-live)', () => {
    render(<Alert tone="warning" title="Low disk space" />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  // ── a11y ────────────────────────────────────────────────────────────────

  it('passes a11y checks (subtle info)', async () => {
    const { container } = render(
      <Alert tone="info" title="Heads up">
        Saved as draft.
      </Alert>
    );
    await expectNoA11yViolations(container);
  });

  it('passes a11y checks (error with action and dismiss)', async () => {
    const { container } = render(
      <Alert
        tone="error"
        title="Failed"
        action={<button type="button">Retry</button>}
        onDismiss={() => undefined}
      >
        Network unreachable.
      </Alert>
    );
    await expectNoA11yViolations(container);
  });

  it('passes a11y checks (status prop + Alert.Action child + dismissible)', async () => {
    const { container } = render(
      <Alert status="warning" title="3 orders failed to sync" dismissible onDismiss={() => undefined}>
        <Alert.Action>
          <button type="button">Retry</button>
        </Alert.Action>
      </Alert>
    );
    await expectNoA11yViolations(container);
  });
});
