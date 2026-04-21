import { expect } from 'vitest';
import { axe } from 'vitest-axe';
import type { AxeCore } from 'vitest-axe';

/**
 * Run axe-core accessibility checks against a rendered container
 * and assert there are no violations. Use in component tests after `render()`.
 *
 * @example
 *   const { container } = render(<MyComponent />);
 *   await expectNoA11yViolations(container);
 */
export async function expectNoA11yViolations(
  container: Element,
  options?: AxeCore.RunOptions
): Promise<void> {
  const results = await axe(container, options);
  // Use the vitest-axe matcher registered in vitest.setup.ts.
  (expect(results) as unknown as { toHaveNoViolations(): void }).toHaveNoViolations();
}
