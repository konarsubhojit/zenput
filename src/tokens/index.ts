/**
 * Design-token entry point.
 *
 * Re-exports the raw token objects (colors, typography, spacing,
 * radii, shadows, motion, zIndex, breakpoints) and the helper that
 * converts a resolved token set into a flat `Record<string, string>`
 * of CSS custom properties consumed by the `ThemeProvider`.
 */
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radii';
export * from './shadows';
export * from './motion';
export * from './zIndex';
export * from './breakpoints';

import {
  SemanticColors,
  lightSemantic,
  darkSemantic,
  highContrastSemantic,
  palette,
} from './colors';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
} from './typography';
import { spacing } from './spacing';
import { radii } from './radii';
import { shadows, borderWidths } from './shadows';
import { durations, easings } from './motion';
import { zIndex } from './zIndex';
import { breakpoints } from './breakpoints';

export type ThemeMode = 'light' | 'dark' | 'highContrast';

/** CSS custom-property prefix used for all emitted tokens. */
export const CSS_VAR_PREFIX = '--zp';

export const semanticByMode: Record<ThemeMode, SemanticColors> = {
  light: lightSemantic,
  dark: darkSemantic,
  highContrast: highContrastSemantic,
};

function kebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Build the flat CSS-variable map for a given semantic palette and
 * the static token categories. Output keys are already prefixed with
 * {@link CSS_VAR_PREFIX}.
 */
export function buildCssVariables(
  semantic: SemanticColors
): Record<string, string> {
  const vars: Record<string, string> = {};

  // Palette (useful for custom brand colors).
  for (const [ramp, scale] of Object.entries(palette)) {
    for (const [step, value] of Object.entries(scale)) {
      vars[`${CSS_VAR_PREFIX}-color-${ramp}-${step}`] = value;
    }
  }

  // Semantic colors.
  for (const [key, value] of Object.entries(semantic)) {
    vars[`${CSS_VAR_PREFIX}-color-${kebab(key)}`] = value;
  }

  // Typography.
  for (const [key, value] of Object.entries(fontFamilies)) {
    vars[`${CSS_VAR_PREFIX}-font-family-${key}`] = value;
  }
  for (const [key, value] of Object.entries(fontSizes)) {
    vars[`${CSS_VAR_PREFIX}-font-size-${key}`] = value;
  }
  for (const [key, value] of Object.entries(fontWeights)) {
    vars[`${CSS_VAR_PREFIX}-font-weight-${key}`] = String(value);
  }
  for (const [key, value] of Object.entries(lineHeights)) {
    vars[`${CSS_VAR_PREFIX}-line-height-${key}`] = String(value);
  }
  for (const [key, value] of Object.entries(letterSpacings)) {
    vars[`${CSS_VAR_PREFIX}-letter-spacing-${key}`] = value;
  }

  // Spacing / radii / borders / shadows / motion / zIndex / breakpoints.
  for (const [key, value] of Object.entries(spacing)) {
    vars[`${CSS_VAR_PREFIX}-space-${key}`] = value;
  }
  for (const [key, value] of Object.entries(radii)) {
    vars[`${CSS_VAR_PREFIX}-radius-${key}`] = value;
  }
  for (const [key, value] of Object.entries(borderWidths)) {
    vars[`${CSS_VAR_PREFIX}-border-width-${key}`] = value;
  }
  for (const [key, value] of Object.entries(shadows)) {
    vars[`${CSS_VAR_PREFIX}-shadow-${key}`] = value;
  }
  for (const [key, value] of Object.entries(durations)) {
    vars[`${CSS_VAR_PREFIX}-duration-${key}`] = value;
  }
  for (const [key, value] of Object.entries(easings)) {
    vars[`${CSS_VAR_PREFIX}-easing-${key}`] = value;
  }
  for (const [key, value] of Object.entries(zIndex)) {
    vars[`${CSS_VAR_PREFIX}-z-${key}`] = String(value);
  }
  for (const [key, value] of Object.entries(breakpoints)) {
    vars[`${CSS_VAR_PREFIX}-breakpoint-${key}`] = value;
  }

  return vars;
}

/**
 * Helper to reference a CSS variable by semantic key (typed).
 * Example: `cssVar('color-brand')` -> `var(--zp-color-brand)`.
 */
export function cssVar(name: string, fallback?: string): string {
  return fallback
    ? `var(${CSS_VAR_PREFIX}-${name}, ${fallback})`
    : `var(${CSS_VAR_PREFIX}-${name})`;
}
