import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// The demo imports Zenput directly from the repo source via an alias.
// This means the demo always renders the current in-repo version of the
// design system without requiring the library to be built first.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      zenput: path.resolve(__dirname, '../src'),
    },
    // Force Vite/Rolldown to always resolve react from demo's own node_modules.
    // Without this, Rolldown fails when bundling ../src/** files that import
    // 'react' — it cannot walk up past the repo root into demo/node_modules.
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  server: {
    port: 5173,
    open: true,
  },
});
