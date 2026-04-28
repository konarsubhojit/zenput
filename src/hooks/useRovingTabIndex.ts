import { useCallback, useLayoutEffect, useRef } from 'react';

export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

export interface UseRovingTabIndexOptions {
  /** Ordered list of item identifiers (values/ids) in DOM order. */
  items: string[];
  /** The currently active item. */
  activeItem: string;
  /** Navigation axis. Default: `'horizontal'`. */
  orientation?: RovingOrientation;
  /** Called with the next item when focus should move. */
  onNavigate: (item: string) => void;
  /** Whether focus wraps from last to first and vice-versa. Default: `true`. */
  loop?: boolean;
  /** Array of items that are currently disabled (skipped during navigation). */
  disabledItems?: string[];
  /**
   * Optional ref to the container element. When provided, the hook also
   * focuses the matching DOM element after `onNavigate` is called.
   * Elements must have a `data-rti-value` attribute equal to their item string.
   */
  containerRef?: React.RefObject<HTMLElement | null>;
}

export interface UseRovingTabIndexResult {
  /**
   * Returns `0` for the active item, `-1` for all others.
   * Spread onto each item: `<button tabIndex={getTabIndex(value)} />`.
   */
  getTabIndex: (item: string) => 0 | -1;
  /**
   * `onKeyDown` handler to attach to the container (or each item).
   * Handles ArrowLeft/Right/Up/Down/Home/End per the orientation setting.
   */
  onKeyDown: (e: React.KeyboardEvent) => void;
}

// ---------------------------------------------------------------------------
// Internal helpers (defined outside the hook to keep the hook body small)
// ---------------------------------------------------------------------------

/** Returns whether `key` is a forward-navigation key for `orient`. */
function isForwardKey(key: string, orient: RovingOrientation): boolean {
  return (
    (orient === 'horizontal' && key === 'ArrowRight') ||
    (orient === 'vertical' && key === 'ArrowDown') ||
    (orient === 'both' && (key === 'ArrowRight' || key === 'ArrowDown'))
  );
}

/** Returns whether `key` is a backward-navigation key for `orient`. */
function isBackwardKey(key: string, orient: RovingOrientation): boolean {
  return (
    (orient === 'horizontal' && key === 'ArrowLeft') ||
    (orient === 'vertical' && key === 'ArrowUp') ||
    (orient === 'both' && (key === 'ArrowLeft' || key === 'ArrowUp'))
  );
}

/**
 * Computes the next index given direction flags.
 * Returns `null` when no movement should occur.
 */
function getNextIndex(
  forward: boolean,
  backward: boolean,
  home: boolean,
  end: boolean,
  current: number,
  length: number,
  loop: boolean
): number | null {
  if (forward) {
    if (current < length - 1) return current + 1;
    if (loop) return 0;
  } else if (backward) {
    if (current > 0) return current - 1;
    if (loop) return length - 1;
  } else if (home) {
    return 0;
  } else if (end) {
    return length - 1;
  }
  return null;
}

/** Focuses the DOM element inside `container` matching `[data-rti-value="value"]`. */
function focusDomItem(
  container: HTMLElement | null | undefined,
  value: string
): void {
  if (!container) return;
  const el = container.querySelector<HTMLElement>(
    `[data-rti-value="${CSS.escape(value)}"]`
  );
  el?.focus();
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Generic roving-tabindex hook for keyboard-navigable lists and grids.
 *
 * WAI-ARIA pattern: only the active item is in the tab sequence (tabIndex 0);
 * all others are removed (tabIndex -1). Arrow keys move focus within the group.
 *
 * @example
 * ```tsx
 * const { getTabIndex, onKeyDown } = useRovingTabIndex({
 *   items: ['a', 'b', 'c'],
 *   activeItem: selected,
 *   onNavigate: setSelected,
 * });
 *
 * return (
 *   <div role="group" onKeyDown={onKeyDown}>
 *     {items.map(id => (
 *       <button
 *         key={id}
 *         tabIndex={getTabIndex(id)}
 *         data-rti-value={id}
 *         onClick={() => setSelected(id)}
 *       >
 *         {id}
 *       </button>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useRovingTabIndex({
  items,
  activeItem,
  orientation = 'horizontal',
  onNavigate,
  loop = true,
  disabledItems = [],
  containerRef,
}: UseRovingTabIndexOptions): UseRovingTabIndexResult {
  // Keep a stable ref to avoid re-creating onKeyDown on every render.
  // Updated via useLayoutEffect so it runs after render but before user interactions.
  const stateRef = useRef({ items, activeItem, onNavigate, loop, disabledItems, containerRef, orientation });
  useLayoutEffect(() => {
    stateRef.current = { items, activeItem, onNavigate, loop, disabledItems, containerRef, orientation };
  }, [items, activeItem, onNavigate, loop, disabledItems, containerRef, orientation]);

  const getTabIndex = useCallback(
    (item: string): 0 | -1 => (item === activeItem ? 0 : -1),
    [activeItem]
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent): void => {
    // All mutable options are read from stateRef so the handler function
    // identity stays stable (empty dep array) while always using the latest
    // values without re-attaching event listeners on each render.
    const { items: currentItems, activeItem: current, onNavigate: navigate, loop: shouldLoop, disabledItems: disabled, containerRef: ref, orientation: orient } = stateRef.current;

    const forward = isForwardKey(e.key, orient);
    const backward = isBackwardKey(e.key, orient);
    const home = e.key === 'Home';
    const end = e.key === 'End';

    if (!forward && !backward && !home && !end) return;

    const enabled = currentItems.filter((v) => !disabled.includes(v));
    if (enabled.length === 0) return;

    const currentIdx = enabled.indexOf(current);
    const nextIdx = getNextIndex(forward, backward, home, end, currentIdx, enabled.length, shouldLoop);

    if (nextIdx !== null) {
      e.preventDefault();
      const nextValue = enabled[nextIdx];
      navigate(nextValue);
      focusDomItem(ref?.current, nextValue);
    }
  }, []);

  return { getTabIndex, onKeyDown };
}
