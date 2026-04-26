import React, { useRef } from 'react';
import { useFocusTrap } from '../../../hooks/useFocusTrap';

export interface FocusScopeProps {
  children: React.ReactNode;
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
   * When `true`, the first tabbable element inside the scope is focused
   * automatically when `trapped` becomes `true`. Default: `true`.
   */
  autoFocus?: boolean;
  /**
   * When `true` (default), clicking outside the scope deactivates the
   * focus trap, allowing focus to move freely. When `false`, focus is
   * pulled back into the scope if it moves outside.
   */
  clickOutsideDeactivates?: boolean;
  /** Element ref to focus when the scope activates. Overrides `autoFocus`. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Element ref to restore focus to when the scope deactivates. Overrides `restoreFocus`. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** Rendered as a `<div>` by default. Override with any element type. */
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

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

  // Internal refs used when the consumer has not provided explicit refs.
  // useFocusTrap ignores undefined refs and falls back to its own logic.
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
    <Tag ref={containerRef} {...rest}>
      {children}
    </Tag>
  );
}

FocusScope.displayName = 'FocusScope';
