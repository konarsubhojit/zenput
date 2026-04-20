import { useCallback, useRef, useState } from 'react';

/** Value accepted by `setOpen`: either a boolean or an updater function. */
export type SetOpen = (next: boolean | ((prev: boolean) => boolean)) => void;

export interface UseDisclosureOptions {
  /** Initial open state (uncontrolled). Default: `false`. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
}

export interface UseDisclosureReturn {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setOpen: SetOpen;
}

/**
 * Generic open/close state hook for overlays (Modal, Drawer, Menu, ...).
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) usage.
 *
 * `setOpen` accepts either a boolean or an updater function
 * (`prev => next`) and is resilient to stale closures, which makes
 * `onToggle` safe under rapid or concurrent updates.
 */
export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
  const { defaultOpen = false, open: controlledOpen, onOpenChange } = options;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? (controlledOpen as boolean) : uncontrolledOpen;

  // Track the latest `open` so updater-form calls in controlled mode can
  // resolve against the current value without a stale closure.
  const openRef = useRef(open);
  openRef.current = open;

  const setOpen = useCallback<SetOpen>(
    (next) => {
      if (isControlled) {
        const resolved =
          typeof next === 'function' ? next(openRef.current) : next;
        onOpenChange?.(resolved);
        return;
      }
      setUncontrolledOpen((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        if (resolved !== prev) {
          onOpenChange?.(resolved);
        }
        return resolved;
      });
    },
    [isControlled, onOpenChange]
  );

  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onToggle = useCallback(() => setOpen((prev) => !prev), [setOpen]);

  return { open, onOpen, onClose, onToggle, setOpen };
}
