import { useEffect, useRef } from 'react';

export interface UseFocusTrapOptions {
  /** Whether the focus trap is currently active. */
  active: boolean;
  /** Ref to the container element that focus should be trapped inside. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** If provided, focus this element when the trap activates. Defaults to the first tabbable element. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** If provided, restore focus to this element when the trap deactivates. Defaults to the element that had focus when the trap activated. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /**
   * When `true` (default), clicking outside the container does not break the
   * trap — if focus moves outside we re-focus the first tabbable element.
   * When `false`, focus is allowed to leave the container on outside clicks,
   * but Tab cycling is still enforced.
   */
  clickOutsideDeactivates?: boolean;
}

/** CSS selector that matches all potentially tabbable elements. */
const TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/** Returns all tabbable elements within `container` that are currently visible. */
function getTabbable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(
    (el) =>
      // Element is visible if it has an offsetParent (not `display: none` or detached)
      // OR if its computed visibility is not 'hidden'.
      el.offsetParent !== null ||
      window.getComputedStyle(el).visibility !== 'hidden'
  );
}

/**
 * Hand-rolled focus trap hook.
 *
 * - Traps focus inside `containerRef` while `active` is `true`.
 * - Tab / Shift+Tab cycle within the tabbable elements.
 * - Restores focus to the previously focused element on deactivation.
 * - No external dependencies (no focus-trap, focus-trap-react, @react-aria/focus).
 */
export function useFocusTrap({
  active,
  containerRef,
  initialFocusRef,
  returnFocusRef,
  clickOutsideDeactivates = true,
}: UseFocusTrapOptions): void {
  // Store the element that was focused before the trap activated.
  const savedFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    // SSR safety — don't touch document until effect runs.
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // 1. Save the currently focused element for restoration.
    savedFocusRef.current = document.activeElement;

    // 2. Move focus to the desired initial target.
    const tabbable = getTabbable(container);
    const initialTarget =
      initialFocusRef?.current ??
      tabbable[0] ??
      null;

    if (initialTarget) {
      initialTarget.focus();
    } else {
      // No tabbable children — focus the container itself.
      if (!container.hasAttribute('tabindex')) {
        container.setAttribute('tabindex', '-1');
      }
      container.focus();
    }

    // 3. Tab-key cycling handler.
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key !== 'Tab') return;

      const currentTabbable = getTabbable(container!);
      if (currentTabbable.length <= 1) return;

      const first = currentTabbable[0];
      const last = currentTabbable[currentTabbable.length - 1];
      const focused = document.activeElement;

      if (e.shiftKey) {
        if (focused === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (focused === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // 4. Focusin handler: if focus escapes the container, pull it back.
    function handleFocusIn(e: FocusEvent): void {
      if (clickOutsideDeactivates) return;
      const target = e.target as Node | null;
      if (container && !container.contains(target)) {
        const currentTabbable = getTabbable(container);
        const refocus = currentTabbable[0] ?? container;
        refocus.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    // On deactivation/unmount: remove listeners, restore focus to the saved element.
    const returnTarget = returnFocusRef?.current ?? null;
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);

      // Restore focus when the trap deactivates.
      const toRestore = returnTarget ?? savedFocusRef.current;
      if (
        toRestore &&
        toRestore instanceof HTMLElement &&
        document.contains(toRestore)
      ) {
        toRestore.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
