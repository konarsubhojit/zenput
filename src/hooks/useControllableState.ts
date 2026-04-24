import { useCallback, useEffect, useRef, useState } from 'react';
import { warnOnce } from '../utils/warnOnce';

export interface UseControllableStateOptions<T> {
  /** Controlled value. When provided, the hook operates in controlled mode. */
  value?: T;
  /** Initial value for uncontrolled mode. */
  defaultValue?: T;
  /** Called whenever the value changes (in both controlled and uncontrolled modes). */
  onChange?: (next: T) => void;
  /** Component name used as the key for the one-time dev warning. */
  componentName?: string;
}

/**
 * Manages a piece of state that can be either controlled or uncontrolled.
 *
 * - Controlled: `value` is defined — the parent owns the state.
 * - Uncontrolled: `value` is `undefined` — the hook owns the state, seeded from `defaultValue`.
 *
 * The setter accepts a value **or an updater function** and is resilient to
 * stale closures under rapid successive calls (same technique as `useDisclosure`).
 */
export function useControllableState<T>(
  opts: UseControllableStateOptions<T>
): [T | undefined, (next: T | ((prev: T | undefined) => T | undefined)) => void] {
  const { value: controlledValue, defaultValue, onChange, componentName } = opts;

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(defaultValue);

  const value = isControlled ? controlledValue : uncontrolledValue;

  // Track whether the component was initially controlled so we can warn on
  // mode switches. Uses a ref so the initial value is captured on first render.
  const wasControlledRef = useRef(isControlled);

  // Warn once (dev only) if the consumer switches between controlled/uncontrolled.
  useEffect(() => {
    const wasControlled = wasControlledRef.current;
    if (wasControlled !== isControlled) {
      const name = componentName ?? 'useControllableState';
      const from = wasControlled ? 'controlled' : 'uncontrolled';
      const to = isControlled ? 'controlled' : 'uncontrolled';
      warnOnce(
        `${name}:mode-switch`,
        `[${name}] A component changed from ${from} to ${to}. ` +
          `This is likely caused by the \`value\` prop changing between undefined and a defined value. ` +
          `Decide between controlled and uncontrolled and stick with it.`
      );
      wasControlledRef.current = isControlled;
    }
  });

  // `pendingRef` tracks the most-recently resolved value so that rapid
  // successive functional updater calls compose correctly even in controlled
  // mode (where the prop hasn't re-rendered yet).
  const pendingRef = useRef<T | undefined>(value);
  useEffect(() => {
    pendingRef.current = value;
  }, [value]);

  const setValue = useCallback(
    (next: T | ((prev: T | undefined) => T | undefined)) => {
      if (isControlled) {
        const base = pendingRef.current;
        const resolved = typeof next === 'function' ? (next as (prev: T | undefined) => T | undefined)(base) : next;
        if (resolved === base) return;
        pendingRef.current = resolved;
        onChange?.(resolved as T);
        return;
      }
      setUncontrolledValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T | undefined) => T | undefined)(prev) : next;
        if (resolved !== prev) {
          onChange?.(resolved as T);
        }
        return resolved;
      });
    },
    [isControlled, onChange]
  );

  return [value, setValue];
}
