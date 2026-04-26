import type { ColorMode, Theme } from './ThemeProvider';

export interface GetColorModeScriptOptions {
  /**
   * The localStorage/sessionStorage key used by the ThemeProvider.
   * Must match the `storageKey` prop passed to `<ThemeProvider>`.
   */
  storageKey: string;
  /**
   * The mode to use when no stored value is found and the OS preference
   * is not `dark`. Default: `'light'`.
   */
  defaultMode?: Theme['mode'];
  /**
   * Which storage type to read from. Default: `'localStorage'`.
   */
  storage?: 'localStorage' | 'sessionStorage';
}

/**
 * Returns an inline `<script>` string that should be injected into the
 * document `<head>` **before** the app hydrates (e.g. via Next.js App
 * Router's `generateMetadata` + `Script` or a `_document.tsx` script tag).
 *
 * The script reads the persisted mode from storage and the OS preference,
 * then sets `data-zp-theme` on `<html>` so CSS variables are already
 * correct at first paint — preventing a flash of the wrong colour scheme.
 *
 * ### Next.js App Router example (`app/layout.tsx`)
 *
 * ```tsx
 * import Script from 'next/script';
 * import { getColorModeScript } from 'zenput';
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <head>
 *         <Script
 *           id="zp-color-mode"
 *           strategy="beforeInteractive"
 *           dangerouslySetInnerHTML={{
 *             __html: getColorModeScript({ storageKey: 'theme', defaultMode: 'system' }),
 *           }}
 *         />
 *       </head>
 *       <body>
 *         <ThemeProvider theme={{ mode: 'system' }} storageKey="theme">
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function getColorModeScript({
  storageKey,
  defaultMode = 'light',
  storage = 'localStorage',
}: GetColorModeScriptOptions): string {
  const validModes: ColorMode[] = ['light', 'dark', 'highContrast', 'system'];
  const validModesJson = JSON.stringify(validModes);

  return `(function(){
  var validModes=${validModesJson};
  var stored;
  try { stored = window.${storage} && window.${storage}.getItem(${JSON.stringify(storageKey)}); } catch(e){}
  var mode = (stored && validModes.indexOf(stored) !== -1) ? stored : ${JSON.stringify(defaultMode)};
  var resolved = mode;
  if (mode === 'system') {
    try {
      resolved = window.matchMedia('(prefers-contrast: more)').matches
        ? 'highContrast'
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    } catch(e) { resolved = 'light'; }
  }
  try { document.documentElement.setAttribute('data-zp-theme', resolved); } catch(e){}
})();`;
}
