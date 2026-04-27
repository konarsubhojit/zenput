import React from 'react';

type AnyProps = Record<string, unknown>;

/**
 * Merges `slotProps` with `childProps`:
 * - `className` values are concatenated (slot first, then child).
 * - `style` objects are merged (child properties win on conflicts).
 * - Matching event handlers are composed: the child handler fires first,
 *   then the slot handler.
 * - All other props: child value wins.
 */
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps };

  for (const key of Object.keys(childProps)) {
    const slotVal = slotProps[key];
    const childVal = childProps[key];

    if (key === 'className') {
      merged[key] = [slotVal, childVal].filter(Boolean).join(' ') || undefined;
    } else if (key === 'style') {
      merged[key] = {
        ...(slotVal as React.CSSProperties),
        ...(childVal as React.CSSProperties),
      };
    } else if (
      key.startsWith('on') &&
      typeof slotVal === 'function' &&
      typeof childVal === 'function'
    ) {
      merged[key] = (...args: unknown[]) => {
        (childVal as (...a: unknown[]) => void)(...args);
        (slotVal as (...a: unknown[]) => void)(...args);
      };
    } else {
      merged[key] = childVal;
    }
  }

  return merged;
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null): void {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref != null && 'current' in ref) {
    (ref as React.MutableRefObject<T | null>).current = node;
  }
}

export type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

/**
 * Renders no element of its own — instead it clones its single React element
 * child and merges all props (className, style, event handlers, ref, etc.)
 * onto it.
 *
 * Used to implement the `asChild` pattern:
 * ```tsx
 * <Button asChild>
 *   <NextLink href="/x">Go</NextLink>
 * </Button>
 * ```
 */
export const Slot = React.forwardRef<Element, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef
) {
  if (!React.isValidElement(children)) {
    return null;
  }

  // In React 19+ `ref` is a regular prop; in React <19 it lives on `element.ref`.
  // We read it from props first (React 19) and fall back to the legacy location.
  const childProps = children.props as AnyProps;
  const childRef =
    (childProps.ref as React.Ref<Element> | undefined) ??
    ((children as unknown as { ref?: React.Ref<Element> }).ref as React.Ref<Element> | undefined);

  const merged = mergeProps(slotProps as AnyProps, childProps);

  // Merge the forwarded ref with any existing ref on the child.
  if (forwardedRef || childRef) {
    merged.ref = (node: Element | null) => {
      assignRef(forwardedRef, node);
      assignRef(childRef, node);
    };
  }

  return React.cloneElement(children, merged);
});

Slot.displayName = 'Slot';
