// Global ambient type augmentation for Vitest + vitest-axe.
// Placed under src/ so the root tsconfig.json (`include: ["src"]`) picks it up
// and `tsc --noEmit` sees the augmented matcher types. Without this file the
// `toHaveNoViolations` matcher is not known to TypeScript even though it is
// registered at runtime in vitest.setup.ts.
import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
  interface Assertion<T = unknown> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

export {};
