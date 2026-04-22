import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import { toHaveNoViolations } from 'vitest-axe/matchers';

// Extend Vitest's expect with axe matchers for accessibility assertions.
// Matcher type augmentation lives in src/test-utils/vitest-axe.d.ts so that
// `tsc --noEmit` (which only compiles src/) picks it up.
expect.extend({ toHaveNoViolations });
