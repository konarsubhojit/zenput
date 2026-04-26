import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LiveRegionPoliteness = 'polite' | 'assertive';

export interface AnnounceOptions {
  /** `'polite'` waits for idle; `'assertive'` interrupts immediately. Default: `'polite'`. */
  politeness?: LiveRegionPoliteness;
}

type AnnounceFunction = (message: string, options?: AnnounceOptions) => void;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const LiveRegionContext = createContext<AnnounceFunction | null>(null);

// ---------------------------------------------------------------------------
// Internal region state
// ---------------------------------------------------------------------------

const DEBOUNCE_MS = 150;

interface RegionState {
  polite: string;
  assertive: string;
}

// ---------------------------------------------------------------------------
// LiveRegion
// ---------------------------------------------------------------------------

export interface LiveRegionProps {
  children?: React.ReactNode;
}

/**
 * Mounts one hidden live-region pair (`aria-live="polite"` and
 * `aria-live="assertive"`) and exposes an `announce()` function via
 * context for any descendant that calls `useAnnounce()`.
 *
 * Mount **once** near the root of your app:
 *
 * ```tsx
 * <LiveRegion>
 *   <App />
 * </LiveRegion>
 * ```
 *
 * Then anywhere inside:
 * ```tsx
 * const announce = useAnnounce();
 * announce('3 results found');
 * announce('Form saved', { politeness: 'assertive' });
 * ```
 */
export function LiveRegion({ children }: LiveRegionProps): React.ReactElement {
  const [regions, setRegions] = useState<RegionState>({ polite: '', assertive: '' });

  // Track the last message per politeness to support debounced re-announcement
  // of identical messages (clear then re-set so screen readers re-read).
  const lastMessageRef = useRef<Record<LiveRegionPoliteness, string>>({
    polite: '',
    assertive: '',
  });
  const debounceRef = useRef<Record<LiveRegionPoliteness, ReturnType<typeof setTimeout> | null>>({
    polite: null,
    assertive: null,
  });

  const announce = useCallback<AnnounceFunction>((message, options) => {
    const politeness: LiveRegionPoliteness = options?.politeness ?? 'polite';

    // Clear any pending debounce for this politeness level.
    const pending = debounceRef.current[politeness];
    if (pending !== null) {
      clearTimeout(pending);
    }

    const isSameMessage = lastMessageRef.current[politeness] === message;

    const applyMessage = (): void => {
      lastMessageRef.current[politeness] = message;
      setRegions((prev) => ({ ...prev, [politeness]: message }));
    };

    if (isSameMessage) {
      // Clear first so the screen reader sees a change, then re-set.
      setRegions((prev) => ({ ...prev, [politeness]: '' }));
      debounceRef.current[politeness] = setTimeout(applyMessage, DEBOUNCE_MS);
    } else {
      applyMessage();
    }
  }, []);

  // Clean up pending timeouts on unmount.
  useEffect(() => {
    const refs = debounceRef.current;
    return () => {
      if (refs.polite !== null) clearTimeout(refs.polite);
      if (refs.assertive !== null) clearTimeout(refs.assertive);
    };
  }, []);

  return (
    <LiveRegionContext.Provider value={announce}>
      {children}
      {/* Visually-hidden live regions */}
      <span
        aria-live="polite"
        aria-atomic="true"
        style={visuallyHiddenStyle}
        data-testid="live-region-polite"
      >
        {regions.polite}
      </span>
      <span
        aria-live="assertive"
        aria-atomic="true"
        style={visuallyHiddenStyle}
        data-testid="live-region-assertive"
      >
        {regions.assertive}
      </span>
    </LiveRegionContext.Provider>
  );
}

LiveRegion.displayName = 'LiveRegion';

// ---------------------------------------------------------------------------
// useAnnounce
// ---------------------------------------------------------------------------

/**
 * Returns the `announce` function provided by the nearest `<LiveRegion>`.
 * Throws if called outside a `<LiveRegion>`.
 */
export function useAnnounce(): AnnounceFunction {
  const ctx = useContext(LiveRegionContext);
  if (!ctx) {
    throw new Error('useAnnounce must be called inside a <LiveRegion>.');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const visuallyHiddenStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};
