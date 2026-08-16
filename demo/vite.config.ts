import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { getColorModeScript } from '../src/context/getColorModeScript';
import { COLOR_MODE_STORAGE_KEY } from './src/colorMode';

// The demo imports Zenput directly from the repo source via an alias.
// This means the demo always renders the current in-repo version of the
// design system without requiring the library to be built first.

// Packages that must resolve from demo/node_modules, not from ../src's ancestor
// node_modules path. When Rolldown bundles ../src/** files it starts resolution
// from ../src and walks up that directory tree — it never enters demo/node_modules.
// Listing them here tells Vite to deduplicate to the copy it already resolved for
// the demo app itself, preventing the "failed to resolve import" hard error.
const DEDUPED_PEER_DEPS = ['react', 'react-dom', 'react/jsx-runtime'];

/**
 * Injects Zenput's anti-flash color-mode script into `<head>` so the correct
 * color scheme is applied before first paint. Doubles as a live demonstration
 * of the library's `getColorModeScript` export.
 */
function colorModeScriptPlugin(): Plugin {
  return {
    name: 'zenput-demo-color-mode-script',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          injectTo: 'head-prepend',
          children: getColorModeScript({
            storageKey: COLOR_MODE_STORAGE_KEY,
            defaultMode: 'system',
            detectHighContrast: true,
          }),
        },
      ];
    },
  };
}

export default defineConfig({
  // The gallery is served from the root of its own origin (Cloudflare Pages),
  // so assets are referenced from '/'.
  base: '/',
  plugins: [react(), colorModeScriptPlugin()],
  resolve: {
    alias: {
      zenput: path.resolve(__dirname, '../src'),
    },
    dedupe: DEDUPED_PEER_DEPS,
  },
  server: {
    port: 5173,
    open: true,
  },
});
