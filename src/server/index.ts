/**
 * `zenput/server` — SSR-safe server-side helpers for Zenput.
 *
 * This module has **no React imports** and is safe to import from
 * Next.js App Router Server Components, Remix loaders, or any other
 * server-side code without triggering "client-only" errors.
 *
 * Exports:
 *   - `getColorModeScript` — inline `<script>` to detect the user's
 *     preferred color scheme before first paint, preventing flash of
 *     wrong theme when using `ThemeProvider`.
 */

export type ColorMode = 'light' | 'dark' | 'highContrast';

export interface GetColorModeScriptOptions {
  /**
   * The attribute name written onto `<html>` by the injected script.
   * ThemeProvider reads `data-zp-theme` so the default matches.
   * @default 'data-zp-theme'
   */
  attribute?: string;
  /**
   * The storage key used to persist the user's manual selection.
   * @default 'zp-color-mode'
   */
  storageKey?: string;
  /**
   * Fallback color mode to use when no persisted value exists and
   * `prefers-color-scheme` media query is not supported.
   * @default 'light'
   */
  fallback?: ColorMode;
  /**
   * When `true`, the system's `prefers-color-scheme` value is respected
   * when no persisted preference exists.
   * @default true
   */
  respectSystemPreference?: boolean;
}

/**
 * Returns a string containing a small, synchronous inline `<script>` that
 * reads the user's stored color-mode preference (or system preference) and
 * writes the appropriate `data-zp-theme` attribute onto `<html>` before
 * first paint. Inject it into `<head>` as early as possible to avoid a
 * flash of wrong theme.
 *
 * ### Next.js App Router usage
 * ```tsx
 * // app/layout.tsx
 * import { getColorModeScript } from 'zenput/server';
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <head>
 *         <script
 *           dangerouslySetInnerHTML={{ __html: getColorModeScript() }}
 *         />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 *
 * The script is intentionally tiny (<350 bytes minified) and runs
 * synchronously so it blocks no rendering beyond its own execution.
 */
export function getColorModeScript(options: GetColorModeScriptOptions = {}): string {
  const {
    attribute = 'data-zp-theme',
    storageKey = 'zp-color-mode',
    fallback = 'light',
    respectSystemPreference = true,
  } = options;

  // The script is inlined as a template literal so it can reference the
  // options values (which are known at SSR time) without an extra network
  // request. Variable names are kept terse to minimize payload size.
  return `(function(){try{var s=localStorage.getItem(${JSON.stringify(storageKey)});if(s==='light'||s==='dark'||s==='highContrast'){document.documentElement.setAttribute(${JSON.stringify(attribute)},s);return;}}catch(e){}${
    respectSystemPreference
      ? `var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');var mode=m&&m.matches?'dark':${JSON.stringify(fallback)};`
      : `var mode=${JSON.stringify(fallback)};`
  }document.documentElement.setAttribute(${JSON.stringify(attribute)},mode);})();`;
}
