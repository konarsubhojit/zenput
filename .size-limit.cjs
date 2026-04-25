// size-limit configuration for Zenput.
// Budgets are tracked in CI (both GitHub Actions and Azure Pipelines) and
// fail the build on regression. Update deliberately with a justifying note.
module.exports = [
  {
    // Limit raised from 50 KB to 54 KB to track the cumulative growth of the
    // navigation/overlay/Field/TokenBrowser surfaces. Current measured size
    // is ~52.1 KB gzipped; ~2 KB headroom is left to absorb minor follow-ups.
    name: 'ESM entry (dist/esm/index.js, gzip)',
    path: 'dist/esm/index.js',
    limit: '54 KB',
    gzip: true,
  },
  {
    name: 'CJS entry (dist/cjs/index.js, gzip)',
    path: 'dist/cjs/index.js',
    limit: '55 KB',
    gzip: true,
  },
  {
    // Single-component sample: import just TextInput and measure tree-shaken output.
    // NOTE: the library currently ships as a single bundled ESM entry which limits
    // tree-shaking effectiveness. The budget is set to the current size with ~10%
    // headroom; reduce as per-component entry points / subpath exports are added.
    // History:
    // - 42 KB → 44 KB: DataTable flagship upgrade (controlled state APIs,
    //   global search, column visibility, density, sticky, server-side mode,
    //   export CSV toolbar).
    // - 44 KB → 50 KB: cumulative growth from navigation primitives (Tabs,
    //   Accordion, Breadcrumbs), overlay primitives (Dialog, Drawer, Popover,
    //   Tooltip), Field composables, TokenBrowser, and density/component
    //   token expansion. Current measured size is ~48.1 KB gzipped.
    name: 'TextInput (tree-shaken, gzip)',
    path: 'dist/esm/index.js',
    import: '{ TextInput }',
    limit: '50 KB',
    gzip: true,
  },
];
