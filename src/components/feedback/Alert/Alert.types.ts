import React from 'react';

export type AlertTone = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type AlertVariant = 'subtle' | 'solid' | 'outline';

export interface AlertActionProps {
  children: React.ReactNode;
}

export interface AlertProps {
  /**
   * Semantic tone. Defaults to 'info'.
   * Alias: `status` (either prop is accepted).
   */
  tone?: AlertTone;
  /**
   * Alias for `tone`. Accepted for parity with other status-bearing components
   * (e.g. `<ProgressBar status="error" />`).
   */
  status?: AlertTone;
  /** Visual variant. Defaults to 'subtle'. */
  variant?: AlertVariant;
  /** Optional bold title rendered above the description. */
  title?: React.ReactNode;
  /** Description / body content. May include `<Alert.Action>` as a child. */
  children?: React.ReactNode;
  /** Optional leading icon. When omitted a tone-appropriate default icon is rendered. Pass `null` to suppress. */
  icon?: React.ReactNode | null;
  /** Action slot rendered at the trailing end (e.g. Retry button). Takes precedence over an `<Alert.Action>` child. */
  action?: React.ReactNode;
  /**
   * When `true`, renders a close button. `onDismiss` is called when the
   * user clicks it. The component does not unmount itself — the parent
   * controls visibility.
   *
   * Shorthand: omitting `dismissible` but supplying `onDismiss` also shows
   * the button (backwards-compatible).
   */
  dismissible?: boolean;
  /**
   * Callback invoked when the dismiss button is clicked.
   * The component does not unmount itself — the parent controls visibility.
   */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Defaults to 'Dismiss'. */
  dismissLabel?: string;
  /**
   * When true, uses `role="alert"` (assertive) instead of `role="status"` (polite).
   * Defaults to `true` for `error` tone and `false` otherwise.
   */
  assertive?: boolean;
  /** Additional CSS class applied to the root element. */
  className?: string;
  /** Additional inline style applied to the root element. */
  style?: React.CSSProperties;
}
