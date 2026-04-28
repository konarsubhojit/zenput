import type { Ref } from 'react';

/**
 * Assigns a DOM node to a forwarded React ref, handling both callback
 * refs and `RefObject`s. Narrows the type so `.current` is only written
 * when `forwardedRef` is actually a ref object.
 */
export function assignRef<T>(forwardedRef: Ref<T> | undefined, node: T | null): void {
  if (typeof forwardedRef === 'function') {
    forwardedRef(node);
  } else if (forwardedRef && 'current' in forwardedRef) {
    (forwardedRef as React.RefObject<T | null>).current = node;
  }
}
