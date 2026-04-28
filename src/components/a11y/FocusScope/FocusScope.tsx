import React, { useRef } from 'react';
import { useFocusTrap } from '../../../hooks/useFocusTrap';

export type FocusScopeProps = {
  children?: React.ReactNode;
  /**
   * When `true`, focus is trapped inside the scope (Tab / Shift+Tab cycle
   * within the contained tabbable elements). Default: `false`.
   */
  trapped?: boolean;
  /**
   * When `true`, the element that had focus before the scope became active
   * is restored when `trapped` switches back to `false`. Default: `true`.
   */
  restoreFocus?: boolean;
  /**
   * When `true` (default), the first tabbable element inside the scope (or
   * `initialFocusRef` if provided) receives focus automatically when `trapped`
   * becomes `true`. Set to `false` to suppress automatic focus movement.
   */
  autoFocus?: boolean;
  /**
   * When `true` (default), clicking outside the scope deactivates the
   * focus trap, allowing focus to move freely. When `false`, focus is
   * pulled back into the scope if it moves outside.
   */
  clickOutsideDeactivates?: boolean;
  /**
   * Ref to the element that should receive focus when the scope activates.
   * Only takes effect when `autoFocus` is `true` (the default).
   * When omitted, the first tabbable child receives focus.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /**
   * Ref to the element that focus is restored to when the scope deactivates.
   * Only takes effect when `restoreFocus` is `true` (the default).
   * When omitted, focus returns to the element that was active before the scope was trapped.
   */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /**
   * HTML element tag to render as the container. Defaults to `'div'`.
   * Only intrinsic HTML elements are accepted because a ref must be
   * attached to drive the focus trap — function components that don't
   * forward refs would silently break trapping.
   */
  as?: keyof React.JSX.IntrinsicElements;
} & Omit<React.HTMLAttributes<HTMLElement>, 'autoFocus'>;

/**
 * Declarative wrapper around `useFocusTrap`. Renders a container element
 * and manages focus trapping, auto-focus, and focus restoration.
 *
 * Used by `<Dialog>`, `<Drawer>`, and `<Menu>`.
 *
 * ```tsx
 * <FocusScope trapped restoreFocus autoFocus>
 *   <div role="dialog">…</div>
 * </FocusScope>
 * ```
 */
export function FocusScope({
  children,
  trapped = false,
  restoreFocus = true,
  autoFocus = true,
  clickOutsideDeactivates = true,
  initialFocusRef: externalInitialFocusRef,
  returnFocusRef: externalReturnFocusRef,
  as: Tag = 'div',
  ...rest
}: FocusScopeProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  // Only pass the external refs to useFocusTrap when the corresponding
  // boolean flag is enabled. useFocusTrap falls back to its own defaults
  // when the refs are undefined.
  const initialFocusRef = autoFocus ? externalInitialFocusRef : undefined;
  const returnFocusRef = restoreFocus ? externalReturnFocusRef : undefined;

  useFocusTrap({
    active: trapped,
    containerRef,
    initialFocusRef,
    returnFocusRef,
    clickOutsideDeactivates,
    autoFocus,
  });

  return (
    // @ts-expect-error — the `as` prop is constrained to intrinsic elements
    // (which all support ref forwarding), but TypeScript cannot narrow the
    // dynamic ref type here without per-element generics.
    <Tag ref={containerRef} {...rest}>
      {children}
    </Tag>
  );
}

FocusScope.displayName = 'FocusScope';
