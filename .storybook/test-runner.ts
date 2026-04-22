/**
 * Storybook test-runner configuration.
 *
 * Runs every story against a Playwright-driven browser and checks for
 * accessibility violations via axe. Invoked in CI by `npm run test:storybook`
 * after `npm run build-storybook` is served locally.
 */
import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

const AXE_BUSY_MESSAGE = 'Axe is already running';
const AXE_BUSY_MAX_RETRIES = 5;
const AXE_BUSY_RETRY_DELAY_MS = 200;

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // Honor per-story `a11y: { disable: true }` parameter so demo stories that
    // intentionally exercise unsupported color combinations (e.g. multi-theme
    // showcases) can opt out of axe checks.
    const storyContext = await getStoryContext(page, context);
    if (storyContext.parameters?.a11y?.disable) {
      return;
    }

    // The `@storybook/addon-a11y` preview also runs axe against each story
    // when it renders, which can race with this test-runner invocation.
    // Retry briefly if axe reports it is still busy from the previous run.
    for (let attempt = 0; attempt < AXE_BUSY_MAX_RETRIES; attempt++) {
      try {
        await checkA11y(page, '#storybook-root', {
          detailedReport: true,
          detailedReportOptions: { html: true },
        });
        return;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (!message.includes(AXE_BUSY_MESSAGE) || attempt === AXE_BUSY_MAX_RETRIES - 1) {
          throw err;
        }
        await page.waitForTimeout(AXE_BUSY_RETRY_DELAY_MS);
      }
    }
  },
};

export default config;
