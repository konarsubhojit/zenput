'use client';
import React, { useContext, useEffect } from 'react';
import { classNames } from '../../../utils';
import { LiveRegionContext } from '../../a11y/LiveRegion/LiveRegion';
import type { AlertActionProps, AlertProps, AlertTone } from './Alert.types';
import styles from './Alert.module.css';

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <circle cx="10" cy="10" r="8" />
      <line x1="10" y1="9" x2="10" y2="14" strokeLinecap="round" />
      <circle cx="10" cy="6" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <circle cx="10" cy="10" r="8" />
      <polyline points="6.5 10.5 9 13 13.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <path d="M10 2.5L18.5 17.5H1.5L10 2.5Z" strokeLinejoin="round" />
      <line x1="10" y1="8" x2="10" y2="12" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <circle cx="10" cy="10" r="8" />
      <line x1="7" y1="7" x2="13" y2="13" strokeLinecap="round" />
      <line x1="13" y1="7" x2="7" y2="13" strokeLinecap="round" />
    </svg>
  );
}

function NeutralIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <circle cx="10" cy="10" r="8" />
    </svg>
  );
}

const DEFAULT_ICONS: Record<AlertTone, React.ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
  neutral: <NeutralIcon />,
};

function DismissIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
      width="14"
      height="14"
    >
      <line x1="4" y1="4" x2="12" y2="12" strokeLinecap="round" />
      <line x1="12" y1="4" x2="4" y2="12" strokeLinecap="round" />
    </svg>
  );
}

function resolveIcon(icon: AlertProps['icon'], tone: AlertTone): React.ReactNode {
  // `??` would treat `null` the same as `undefined`. We deliberately allow
  // callers to pass `null` to suppress the default icon.
  if (icon === undefined) return DEFAULT_ICONS[tone];
  return icon;
}

// ---------------------------------------------------------------------------
// Alert.Action
// ---------------------------------------------------------------------------

/**
 * Compound sub-component for the Alert's trailing action slot.
 *
 * Place it as a **child** of `<Alert>` and it will be automatically moved to
 * the trailing action position:
 *
 * ```tsx
 * <Alert status="error" title="Sync failed" dismissible onDismiss={handleDismiss}>
 *   <Alert.Action>
 *     <button type="button" onClick={handleRetry}>Retry</button>
 *   </Alert.Action>
 * </Alert>
 * ```
 *
 * Alternatively, keep using the `action` prop directly for backward compatibility.
 */
export function AlertAction({ children }: Readonly<AlertActionProps>): React.ReactElement {
  return <>{children}</>;
}

AlertAction.displayName = 'Alert.Action';
/** @internal Used for reliable compound-component detection regardless of minification. */
AlertAction._isAlertAction = true as const;

/**
 * Persistent inline banner for page-level feedback (errors, warnings, info,
 * success). Unlike `Toast` (which auto-dismisses) `Alert` stays visible until
 * the parent removes it or the user clicks the optional dismiss button.
 *
 * Use `tone` (or its alias `status`) for semantic meaning, `variant` for
 * visual emphasis, and the `action` slot — or `<Alert.Action>` as a child —
 * for inline CTAs like "Retry".
 *
 * When mounted inside a `<LiveRegion>` provider the alert text is announced
 * through the provider's hidden live-region; otherwise it falls back to
 * inline `role`/`aria-live` attributes.
 */
export function Alert({
  tone,
  status,
  variant = 'subtle',
  title,
  children,
  icon,
  action,
  dismissible,
  onDismiss,
  dismissLabel = 'Dismiss',
  assertive,
  className,
  style,
}: Readonly<AlertProps>): React.ReactElement {
  // `status` is an alias for `tone`; `tone` takes precedence if both are given.
  const resolvedTone: AlertTone = tone ?? status ?? 'info';
  const isAssertive = assertive ?? resolvedTone === 'error';
  const role = isAssertive ? 'alert' : 'status';
  const ariaLive = isAssertive ? 'assertive' : 'polite';

  const resolvedIcon = resolveIcon(icon, resolvedTone);

  // ── Extract Alert.Action from children ─────────────────────────────────
  // If the caller places an <Alert.Action> inside children, move it to the
  // trailing action slot and keep only the remaining nodes as description.
  let resolvedAction = action;
  const descriptionNodes: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type as typeof AlertAction)._isAlertAction === true
    ) {
      // `action` prop takes precedence over a child Alert.Action
      if (resolvedAction === undefined) {
        resolvedAction = (child as React.ReactElement<AlertActionProps>).props.children;
      }
    } else {
      descriptionNodes.push(child);
    }
  });

  const descriptionContent = descriptionNodes.length > 0 ? descriptionNodes : null;
  // Show the dismiss button when dismissible is explicitly true, or when it is
  // not explicitly false and onDismiss is supplied (backward-compatible default).
  const showDismiss = dismissible === true || (dismissible !== false && !!onDismiss);

  // ── Optional LiveRegion announcement ───────────────────────────────────
  // When inside a <LiveRegion> provider, push the title text through it so
  // apps that centralise announcements benefit. The inline role/aria-live
  // below acts as the fallback for standalone usage.
  const announce = useContext(LiveRegionContext);

  useEffect(() => {
    if (!announce) return;
    const titleText = typeof title === 'string' ? title : '';
    if (!titleText) return;
    announce(titleText, { politeness: isAssertive ? 'assertive' : 'polite' });
    // Intentionally run only on mount / when title changes; not on every render.
  }, [announce, isAssertive, title]);

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={classNames(
        styles.alert,
        styles[`tone-${resolvedTone}`],
        styles[`variant-${variant}`],
        className
      )}
      style={style}
    >
      {resolvedIcon ? <span className={styles.icon}>{resolvedIcon}</span> : null}
      <div className={styles.body}>
        {title ? <span className={styles.title}>{title}</span> : null}
        {descriptionContent ? <div className={styles.description}>{descriptionContent}</div> : null}
      </div>
      {resolvedAction ? <span className={styles.action}>{resolvedAction}</span> : null}
      {showDismiss ? (
        <button
          type="button"
          className={styles.dismiss}
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <DismissIcon />
        </button>
      ) : null}
    </div>
  );
}

Alert.displayName = 'Alert';

// Attach Action as a compound sub-component
Alert.Action = AlertAction;
