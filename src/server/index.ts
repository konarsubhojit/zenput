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
 * Valid HTML/data attribute names: begin with a letter, then alphanumeric,
 * hyphens, underscores, colons, or dots (covers `data-*`, `aria-*`, …).
 */
const ATTR_RE = /^[a-zA-Z][a-zA-Z0-9\-_:.]*$/;

/**
 * Valid storage keys: printable ASCII only, no characters that could
 * escape the generated JS string.
 */
const KEY_RE = /^[a-zA-Z0-9\-_.@/:]+$/;

/** Allowed fallback values — the full ColorMode union. */
const VALID_MODES: readonly ColorMode[] = ['light', 'dark', 'highContrast'];

/**
 * Validates and normalises option values so that none of the user-controlled
 * strings can escape the generated JS string literals.
 */
function sanitizeOptions(options: GetColorModeScriptOptions): Required<GetColorModeScriptOptions> {
  const attribute = options.attribute ?? 'data-zp-theme';
  const storageKey = options.storageKey ?? 'zp-color-mode';
  const fallback = options.fallback ?? 'light';
  const respectSystemPreference = options.respectSystemPreference ?? true;

  if (!ATTR_RE.test(attribute)) {
    throw new Error(
      `getColorModeScript: "attribute" must be a valid HTML attribute name; received: ${String(attribute)}`
    );
  }
  if (!KEY_RE.test(storageKey)) {
    throw new Error(
      `getColorModeScript: "storageKey" must contain only safe characters (alphanumeric, -, _, ., @, /, :); received: ${String(storageKey)}`
    );
  }
  if (!(VALID_MODES as readonly string[]).includes(fallback)) {
    throw new Error(
      `getColorModeScript: "fallback" must be one of ${VALID_MODES.join(', ')}; received: ${String(fallback)}`
    );
  }

  return { attribute, storageKey, fallback, respectSystemPreference };
}

/**
 * Returns a string containing a small, synchronous inline `<script>` that
 * reads the user's stored color-mode preference (or system preference) and
 * writes the appropriate `data-zp-theme` attribute onto `<html>` before
 * first paint. Inject it into `<head>` as early as possible to avoid a
 * flash of wrong theme.
 *
 * Input options are validated before being embedded in the generated script
 * to prevent code injection.
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
  // Validate and sanitize all user-supplied options before embedding them
  // in the generated JavaScript to prevent code injection.
  const { attribute, storageKey, fallback, respectSystemPreference } = sanitizeOptions(options);

  // After sanitization, attribute and storageKey match strict safe-character
  // regexes, so JSON.stringify produces safe string literals with no risk of
  // breaking out of the surrounding JS string context.
  const attrLiteral = JSON.stringify(attribute);
  const keyLiteral = JSON.stringify(storageKey);
  // fallback is validated against VALID_MODES (a closed enum of known-safe
  // string values); JSON.stringify is used for consistency with the other literals.
  const fallbackLiteral = JSON.stringify(fallback);

  const systemPart = respectSystemPreference
    ? `var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');var mode=m&&m.matches?'dark':${fallbackLiteral};`
    : `var mode=${fallbackLiteral};`;

  return (
    `(function(){` +
    `try{var s=localStorage.getItem(${keyLiteral});` +
    `if(s==='light'||s==='dark'||s==='highContrast'){document.documentElement.setAttribute(${attrLiteral},s);return;}}` +
    `catch(e){}` +
    `${systemPart}` +
    `document.documentElement.setAttribute(${attrLiteral},mode);` +
    `})();`
  );
}
