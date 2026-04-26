import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const basePlugins = ({ declaration, declarationDir }) => [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    rootDir: 'src',
    declaration,
    declarationDir: declaration ? declarationDir : undefined,
  }),
  postcss({ modules: true, extract: false }),
];

const external = ['react', 'react-dom', 'react-hook-form', '@hookform/resolvers/zod', 'zod'];

export default [
  // ---------------------------------------------------------------------------
  // Core entry – CJS
  // ---------------------------------------------------------------------------
  {
    input: 'src/index.ts',
    output: { file: 'dist/cjs/index.js', format: 'cjs', sourcemap: true },
    plugins: basePlugins({ declaration: true, declarationDir: 'dist/cjs/types' }),
    external,
  },
  // Core entry – ESM
  {
    input: 'src/index.ts',
    output: { file: 'dist/esm/index.js', format: 'esm', sourcemap: true },
    plugins: basePlugins({ declaration: false }),
    external,
  },
  // Core entry – DTS
  {
    input: 'dist/cjs/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  },

  // ---------------------------------------------------------------------------
  // forms subpath – CJS
  // ---------------------------------------------------------------------------
  {
    input: 'src/forms/index.ts',
    output: { file: 'dist/cjs/forms/index.js', format: 'cjs', sourcemap: true },
    plugins: basePlugins({ declaration: true, declarationDir: 'dist/cjs/forms/types' }),
    external,
  },
  // forms subpath – ESM
  {
    input: 'src/forms/index.ts',
    output: { file: 'dist/esm/forms/index.js', format: 'esm', sourcemap: true },
    plugins: basePlugins({ declaration: false }),
    external,
  },
  // forms subpath – DTS
  {
    input: 'dist/cjs/forms/types/forms/index.d.ts',
    output: [{ file: 'dist/forms/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/, 'react-hook-form', '@hookform/resolvers/zod', 'zod'],
  },

  // ---------------------------------------------------------------------------
  // locales subpath – CJS
  // ---------------------------------------------------------------------------
  {
    input: 'src/locales/index.ts',
    output: { file: 'dist/cjs/locales/index.js', format: 'cjs', sourcemap: true },
    plugins: basePlugins({ declaration: true, declarationDir: 'dist/cjs/locales/types' }),
    external,
  },
  // locales subpath – ESM
  {
    input: 'src/locales/index.ts',
    output: { file: 'dist/esm/locales/index.js', format: 'esm', sourcemap: true },
    plugins: basePlugins({ declaration: false }),
    external,
  },
  // locales subpath – DTS
  {
    input: 'dist/cjs/locales/types/locales/index.d.ts',
    output: [{ file: 'dist/locales/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/, 'react', 'react-dom'],
  },
];
