import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIsomorphicLayoutEffect } from '../internal/useIsomorphicLayoutEffect';
import { classNames } from '../../../utils';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { Portal } from '../../Portal';
import { assignRef } from '../internal/assignRef';
import { MenuContext } from '../Menu/Menu';
import styles from './ContextMenu.module.css';

interface ContextMenuContextValue {
  anchorPoint: { x: number; y: number } | null;
  setAnchorPoint: (pt: { x: number; y: number } | null) => void;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(null);

function getMenuItems(container: HTMLElement): HTMLElement[] {
  const all = container.querySelectorAll<HTMLElement>(
    '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]'
  );
  return Array.from(all).filter(
    (el) => el.getAttribute('aria-disabled') !== 'true' && !el.hasAttribute('data-disabled')
  );
}

export interface ContextMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function ContextMenu({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
}: ContextMenuProps): React.ReactElement {
  const { open, setOpen } = useDisclosure({ open: controlledOpen, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useId();
  const [anchorPoint, setAnchorPoint] = useState<{ x: number; y: number } | null>(null);

  const setOpenBool = useCallback((next: boolean) => setOpen(next), [setOpen]);
  const setTriggerNode = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  const menuCtxValue = useMemo(
    () => ({ open, setOpen: setOpenBool, triggerRef, setTriggerNode, contentId }),
    [open, setOpenBool, setTriggerNode, contentId]
  );

  const ctxValue = useMemo(
    () => ({ anchorPoint, setAnchorPoint }),
    [anchorPoint]
  );

  return (
    <MenuContext.Provider value={menuCtxValue}>
      <ContextMenuContext.Provider value={ctxValue}>
        {children}
      </ContextMenuContext.Provider>
    </MenuContext.Provider>
  );
}

export interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger({ onContextMenu, children, ...rest }, forwardedRef) {
    const menuCtx = useContext(MenuContext);
    const ctxCtx = useContext(ContextMenuContext);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        menuCtx?.setTriggerNode(node);
        assignRef(forwardedRef, node);
      },
      [menuCtx, forwardedRef]
    );

    const handleContextMenu = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        onContextMenu?.(e);
        ctxCtx?.setAnchorPoint({ x: e.clientX, y: e.clientY });
        menuCtx?.setOpen(true);
      },
      [onContextMenu, ctxCtx, menuCtx]
    );

    return (
      <div ref={mergedRef} onContextMenu={handleContextMenu} {...rest}>
        {children}
      </div>
    );
  }
);

export interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  'aria-label'?: string;
  children: React.ReactNode;
}

export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent({ className, children, ...rest }, forwardedRef) {
    const menuCtx = useContext(MenuContext);
    const ctxCtx = useContext(ContextMenuContext);

    if (!menuCtx) throw new Error('<ContextMenuContent> must be used inside <ContextMenu>.');
    if (!ctxCtx) throw new Error('<ContextMenuContent> must be used inside <ContextMenu>.');

    const { open, setOpen, contentId } = menuCtx;
    const { anchorPoint } = ctxCtx;

    const contentElRef = useRef<HTMLDivElement | null>(null);
    const typeAheadBuffer = useRef('');
    const typeAheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        contentElRef.current = node;
        assignRef(forwardedRef, node);
      },
      [forwardedRef]
    );

    const [clampedCoords, setClampedCoords] = useState<{ x: number; y: number } | null>(null);

    useIsomorphicLayoutEffect(() => {
      if (!open || !anchorPoint) {
        setClampedCoords(null);
        return;
      }
      const updateCoords = (): void => {
        const el = contentElRef.current;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
        const w = el ? el.offsetWidth : 180;
        const h = el ? el.offsetHeight : 0;
        setClampedCoords({
          x: Math.max(4, Math.min(anchorPoint.x, vw - w - 4)),
          y: Math.max(4, Math.min(anchorPoint.y, vh - h - 4)),
        });
      };
      updateCoords();
      window.addEventListener('resize', updateCoords);
      return () => {
        window.removeEventListener('resize', updateCoords);
      };
    }, [open, anchorPoint]);

    useEffect(() => {
      if (!open) return;
      const rafId = requestAnimationFrame(() => {
        const el = contentElRef.current;
        if (!el) return;
        const items = getMenuItems(el);
        if (items.length > 0) items[0].focus();
      });
      return () => cancelAnimationFrame(rafId);
    }, [open]);

    useEffect(() => {
      if (!open) return;
      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as Node;
        const content = contentElRef.current;
        if (content && !content.contains(target)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('touchstart', handleMouseDown as EventListener);
      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('touchstart', handleMouseDown as EventListener);
      };
    }, [open, setOpen]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const el = contentElRef.current;
        if (!el) return;
        const items = getMenuItems(el);
        const focused = document.activeElement as HTMLElement | null;
        const currentIndex = focused ? items.indexOf(focused) : -1;

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault();
            const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            items[next]?.focus();
            break;
          }
          case 'ArrowUp': {
            e.preventDefault();
            const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            items[prev]?.focus();
            break;
          }
          case 'Home': {
            e.preventDefault();
            items[0]?.focus();
            break;
          }
          case 'End': {
            e.preventDefault();
            items[items.length - 1]?.focus();
            break;
          }
          case 'Enter':
          case ' ': {
            e.preventDefault();
            if (focused && items.includes(focused)) {
              focused.click();
            }
            break;
          }
          case 'Tab': {
            e.preventDefault();
            setOpen(false);
            break;
          }
          case 'Escape': {
            e.preventDefault();
            setOpen(false);
            break;
          }
          default: {
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              typeAheadBuffer.current += e.key.toLowerCase();
              if (typeAheadTimer.current) clearTimeout(typeAheadTimer.current);
              typeAheadTimer.current = setTimeout(() => {
                typeAheadBuffer.current = '';
              }, 500);
              const match = items.find((item) =>
                (item.textContent ?? '').trim().toLowerCase().startsWith(typeAheadBuffer.current)
              );
              match?.focus();
            }
          }
        }
      },
      [setOpen]
    );

    if (!open) return null;

    return (
      <Portal>
        <div
          ref={mergedRef}
          role="menu"
          id={contentId}
          tabIndex={-1}
          style={{
            position: 'fixed',
            top: clampedCoords?.y ?? anchorPoint?.y ?? -9999,
            left: clampedCoords?.x ?? anchorPoint?.x ?? -9999,
            visibility: clampedCoords ? 'visible' : 'hidden',
          }}
          className={classNames(styles.content, className)}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </div>
      </Portal>
    );
  }
);
