import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import { toHaveNoViolations } from 'vitest-axe/matchers';
import type { AxeMatchers } from 'vitest-axe/matchers';

// Extend Vitest's expect with axe matchers for accessibility assertions.
expect.extend({ toHaveNoViolations });

declare module 'vitest' {
  // Augment Vitest's Assertion types with axe matchers.
  interface Assertion<T = unknown> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
