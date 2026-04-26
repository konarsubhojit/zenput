import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Portal } from '../../Portal';
import { classNames } from '../../../utils';
import styles from './Toast.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastStatus = 'info' | 'success' | 'warning' | 'error' | 'loading';

export type ToastPlacement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Toast title (required). */
  title: string;
  /** Optional longer description. */
  description?: string;
  /** Visual/semantic status. Default: `'info'`. */
  status?: ToastStatus;
  /**
   * Auto-dismiss duration in ms. Pass `null` to make the toast persistent.
   * Default: the `duration` prop on `<ToastProvider>`.
   */
  duration?: number | null;
  /** Optional CTA button rendered inside the toast. */
  action?: ToastAction;
  /** Called when the toast is dismissed. */
  onClose?: () => void;
  /** Custom icon; overrides the default status icon. */
  icon?: React.ReactNode;
}

interface ToastItem {
  id: string;
  status: ToastStatus;
  title: string;
  description?: string;
  duration: number | null;
  action?: ToastAction;
  onClose?: () => void;
  icon?: React.ReactNode;
  /** Whether the toast is in its exit animation phase. */
  exiting: boolean;
  /**
   * Tracks whether `onClose` has already been invoked for this toast.
   * Guarantees the callback runs at most once across all dismissal paths
   * (close button, Escape, swipe, auto-timer, programmatic `dismiss()`,
   * and `max`-overflow eviction).
   */
  closed: boolean;
}

export interface ToastHandle {
  /** Show a new toast and return its id. */
  show: (options: ToastOptions) => string;
  /**
   * Track a promise: shows a loading toast, then success/error.
   * Returns the original promise so callers can await it.
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) => Promise<T>;
  /** Dismiss a specific toast by id, or all toasts when called without args. */
  dismiss: (id?: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastHandle | null>(null);

// ---------------------------------------------------------------------------
// Singleton handle — allows use outside the React tree
// ---------------------------------------------------------------------------

let _singletonHandle: ToastHandle | null = null;

/** Access the toast handle outside of React (e.g. in utility functions). */
export function getToastHandle(): ToastHandle | null {
  return _singletonHandle;
}

// Delay (ms) between dismissing the loading toast and showing the
// success/error toast in `promise()`. Gives the exit animation time
// to start before the new toast enters, preventing a visual jump.
const PROMISE_TRANSITION_DELAY_MS = 100;

// ---------------------------------------------------------------------------
// Default status icons
// ---------------------------------------------------------------------------

function DefaultIcon({ status }: { status: ToastStatus }): React.ReactElement {
  switch (status) {
    case 'success':
      return (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
          <path
            d="M4.5 8.5L6.5 10.5L11.5 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'error':
      return (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
          <path
            d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'warning':
      return (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1.5L14.5 13.5H1.5L8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M8 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
        </svg>
      );
    case 'loading':
      return (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.spinIcon}
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="25 13"
          />
        </svg>
      );
    default:
      return (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
          <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="4.5" r="0.75" fill="currentColor" />
        </svg>
      );
  }
}

interface ToastItemComponentProps {
  toast: ToastItem;
  onDismiss: () => void;
  onExited: () => void;
}

function ToastItemComponent({
  toast,
  onDismiss,
  onExited,
}: ToastItemComponentProps): React.ReactElement {
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerStartRef = useRef<number | null>(null);
  const remainingRef = useRef<number | null>(toast.duration);

  // Keep a stable ref to onDismiss so timer callbacks don't go stale.
  // The provider's `dismiss()` is itself idempotent (guarded by the toast's
  // `closed` flag), so we can call it freely from racing handlers.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  const clearTimer = useCallback(() => {
    if (timerIdRef.current != null) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    const remaining = remainingRef.current;
    if (remaining == null || remaining <= 0) return;
    clearTimer();
    timerStartRef.current = Date.now();
    timerIdRef.current = setTimeout(() => {
      onDismissRef.current();
    }, remaining);
  }, [clearTimer]);

  const pauseTimer = useCallback(() => {
    if (timerIdRef.current == null) return;
    clearTimer();
    if (timerStartRef.current != null && remainingRef.current != null) {
      const elapsed = Date.now() - timerStartRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
    timerStartRef.current = null;
  }, [clearTimer]);

  // Start timer once on mount
  useEffect(() => {
    if (toast.duration == null) return;
    startTimer();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Touch swipe state
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (toast.duration != null) pauseTimer();
  }, [toast.duration, pauseTimer]);

  const handleMouseLeave = useCallback(() => {
    if (toast.duration != null) startTimer();
  }, [toast.duration, startTimer]);

  const handleFocus = useCallback(() => {
    if (toast.duration != null) pauseTimer();
  }, [toast.duration, pauseTimer]);

  const handleBlur = useCallback(() => {
    if (toast.duration != null) startTimer();
  }, [toast.duration, startTimer]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        safeDismiss();
      }
    },
    [safeDismiss]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setIsSwiping(false);
    setSwipeOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      setIsSwiping(true);
      setSwipeOffset(dx);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isSwiping && Math.abs(swipeOffset) > 80) {
      safeDismiss();
    } else {
      setSwipeOffset(0);
      setIsSwiping(false);
    }
    touchStartRef.current = null;
  }, [isSwiping, swipeOffset, safeDismiss]);

  // When exit animation completes, notify parent to remove from state
  const handleAnimationEnd = useCallback(
    (e: React.AnimationEvent) => {
      if (e.animationName && e.animationName.includes('toast-exit')) {
        onExited();
      }
    },
    [onExited]
  );

  const isError = toast.status === 'error';
  const ariaRole = isError ? 'alert' : 'status';
  const ariaLive = isError ? 'assertive' : 'polite';

  return (
    <div
      role={ariaRole}
      aria-live={ariaLive}
      aria-atomic="true"
      className={classNames(
        styles.toast,
        styles[`status-${toast.status}`],
        toast.exiting && styles.toastExiting
      )}
      style={
        isSwiping
          ? {
              transform: `translateX(${swipeOffset}px)`,
              transition: 'none',
              opacity: Math.max(0, 1 - Math.abs(swipeOffset) / 200),
            }
          : undefined
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className={styles.icon}>
        {toast.icon != null ? toast.icon : <DefaultIcon status={toast.status} />}
      </span>
      <div className={styles.body}>
        <span className={styles.title}>{toast.title}</span>
        {toast.description && <span className={styles.description}>{toast.description}</span>}
        {toast.action && (
          <button type="button" className={styles.actionButton} onClick={toast.action.onClick}>
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        className={styles.closeButton}
        onClick={safeDismiss}
        aria-label="Dismiss notification"
      >
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L11 11M11 1L1 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ToastProvider
// ---------------------------------------------------------------------------

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Where toasts appear on screen. Default: `'bottom-right'`. */
  placement?: ToastPlacement;
  /** Maximum number of toasts to show at once. Default: `5`. */
  max?: number;
  /**
   * Default auto-dismiss duration in ms.
   * Individual toasts can override this. Default: `5000`.
   */
  duration?: number;
  /** Gap between stacked toasts. Default: uses CSS gap token. */
  gap?: string | number;
  /** Additional styles applied to the toast container element. */
  containerStyle?: React.CSSProperties;
}

export function ToastProvider({
  children,
  placement = 'bottom-right',
  max = 5,
  duration: defaultDuration = 5000,
  gap,
  containerStyle,
}: ToastProviderProps): React.ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounterRef = useRef(0);

  const show = useCallback(
    (options: ToastOptions): string => {
      idCounterRef.current += 1;
      const id = `toast-${idCounterRef.current}`;
      const item: ToastItem = {
        id,
        status: options.status ?? 'info',
        title: options.title,
        description: options.description,
        duration: options.duration !== undefined ? options.duration : defaultDuration,
        action: options.action,
        onClose: options.onClose,
        icon: options.icon,
        exiting: false,
      };
      setToasts((prev) => {
        const next = [...prev, item];
        return max > 0 ? next.slice(-max) : next;
      });
      return id;
    },
    [defaultDuration, max]
  );

  const dismiss = useCallback((id?: string) => {
    if (id == null) {
      setToasts((prev) => prev.map((t) => ({ ...t, exiting: true })));
    } else {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const promise = useCallback(
    <T,>(
      p: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: unknown) => string);
      }
    ): Promise<T> => {
      const id = show({ title: messages.loading, status: 'loading', duration: null });
      return p.then(
        (data) => {
          const title =
            typeof messages.success === 'function' ? messages.success(data) : messages.success;
          dismiss(id);
          setTimeout(() => show({ title, status: 'success' }), PROMISE_TRANSITION_DELAY_MS);
          return data;
        },
        (err: unknown) => {
          const title =
            typeof messages.error === 'function' ? messages.error(err) : messages.error;
          dismiss(id);
          setTimeout(() => show({ title, status: 'error' }), PROMISE_TRANSITION_DELAY_MS);
          throw err;
        }
      );
    },
    [show, dismiss]
  );

  const handle = useMemo<ToastHandle>(() => ({ show, dismiss, promise }), [show, dismiss, promise]);

  // Register singleton handle
  useEffect(() => {
    _singletonHandle = handle;
    return () => {
      _singletonHandle = null;
    };
  }, [handle]);

  const isBottom = placement.startsWith('bottom');
  const gapStyle =
    gap !== undefined ? { gap: typeof gap === 'number' ? `${gap}px` : gap } : undefined;

  return (
    <ToastContext.Provider value={handle}>
      {children}
      <Portal>
        <div
          className={classNames(styles.container, styles[`placement-${placement}`])}
          style={{ ...gapStyle, ...containerStyle }}
          aria-label="Notifications"
        >
          {(isBottom ? [...toasts].reverse() : toasts).map((toast) => (
            <ToastItemComponent
              key={toast.id}
              toast={toast}
              onDismiss={() => {
                toast.onClose?.();
                dismiss(toast.id);
              }}
              onExited={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// useToast
// ---------------------------------------------------------------------------

/**
 * Returns a stable handle to show, dismiss, and track toasts.
 * Must be used inside a `<ToastProvider>`.
 */
export function useToast(): ToastHandle {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>.');
  }
  return ctx;
}
