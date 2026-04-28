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

    const isForward =
      (orient === 'horizontal' && e.key === 'ArrowRight') ||
      (orient === 'vertical' && e.key === 'ArrowDown') ||
      (orient === 'both' && (e.key === 'ArrowRight' || e.key === 'ArrowDown'));
    const isBackward =
      (orient === 'horizontal' && e.key === 'ArrowLeft') ||
      (orient === 'vertical' && e.key === 'ArrowUp') ||
      (orient === 'both' && (e.key === 'ArrowLeft' || e.key === 'ArrowUp'));
    const isHome = e.key === 'Home';
    const isEnd = e.key === 'End';

    if (!isForward && !isBackward && !isHome && !isEnd) return;

    const enabled = currentItems.filter((v) => !disabled.includes(v));
    if (enabled.length === 0) return;

    const currentIdx = enabled.indexOf(current);
    let nextIdx: number | null = null;

    if (isForward) {
      if (currentIdx < enabled.length - 1) {
        nextIdx = currentIdx + 1;
      } else if (shouldLoop) {
        nextIdx = 0;
      }
    } else if (isBackward) {
      if (currentIdx > 0) {
        nextIdx = currentIdx - 1;
      } else if (shouldLoop) {
        nextIdx = enabled.length - 1;
      }
    } else if (isHome) {
      nextIdx = 0;
    } else if (isEnd) {
      nextIdx = enabled.length - 1;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      const nextValue = enabled[nextIdx];
      navigate(nextValue);

      // Focus the corresponding DOM element if a containerRef was provided.
      if (ref?.current) {
        const el = ref.current.querySelector<HTMLElement>(
          `[data-rti-value="${CSS.escape(nextValue)}"]`
        );
        el?.focus();
      }
    }
  }, []);

  return { getTabIndex, onKeyDown };
}
