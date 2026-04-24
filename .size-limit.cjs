// size-limit configuration for Zenput.
// Budgets are tracked in CI (both GitHub Actions and Azure Pipelines) and
// fail the build on regression. Update deliberately with a justifying note.
module.exports = [
  {
    name: 'ESM entry (dist/esm/index.js, gzip)',
    path: 'dist/esm/index.js',
    limit: '50 KB',
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
    // Limit raised from 42 KB to 44 KB to account for the DataTable flagship
    // upgrade (controlled state APIs, global search, column visibility,
    // density, sticky, server-side mode, export CSV toolbar).
    name: 'TextInput (tree-shaken, gzip)',
    path: 'dist/esm/index.js',
    import: '{ TextInput }',
    limit: '44 KB',
    gzip: true,
  },
];
