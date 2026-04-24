/**
 * Emits a `console.warn` for a given key exactly once per session (in
 * development). Subsequent calls with the same key are no-ops.
 *
 * Gated on `process.env.NODE_ENV !== 'production'` so the helper tree-shakes
 * to nothing in production bundles.
 */
const warned = new Set<string>();

export function warnOnce(key: string, message: string): void {
  if (process.env.NODE_ENV === 'production') return;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}
