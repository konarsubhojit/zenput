/**
 * Storybook test-runner configuration.
 *
 * Runs every story against a Playwright-driven browser and checks for
 * accessibility violations via axe. Invoked in CI by `npm run test:storybook`
 * after `npm run build-storybook` is served locally.
 */
import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
