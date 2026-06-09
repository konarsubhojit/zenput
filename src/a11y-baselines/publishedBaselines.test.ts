import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const baselinesPath = resolve(repoRoot, 'a11y/core-components.json');
const packageJsonPath = resolve(repoRoot, 'package.json');
const EXPECTED_CORE_COMPONENT_COUNT = 18;

describe('published a11y baselines', () => {
  it('defines baseline fixtures for all core input components', () => {
    const baselines = JSON.parse(readFileSync(baselinesPath, 'utf8'));

    expect(baselines).toHaveLength(EXPECTED_CORE_COMPONENT_COUNT);
    expect(new Set(baselines.map((baseline: { slug: string }) => baseline.slug)).size).toBe(
      EXPECTED_CORE_COMPONENT_COUNT
    );

    for (const baseline of baselines) {
      expect(baseline.guarantee.expectedViolations).toEqual([]);
      expect(existsSync(resolve(repoRoot, baseline.fixture.source))).toBe(true);
    }
  });

  it('exports per-component a11y baseline artifacts', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    expect(packageJson.exports['./a11y']).toBe('./dist/a11y/index.json');
    expect(packageJson.exports['./a11y/*']).toBe('./dist/a11y/*.json');
  });
});
