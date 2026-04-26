/**
 * Semantic typography presets.
 *
 * Each preset is a flat style object referencing the underlying token CSS
 * variables. Components and consumers can apply these directly via the
 * `style` prop or via the generated `.zp-text-*` CSS utility classes
 * (see `src/styles/typography.css`).
 *
 * Generated CSS custom properties are NOT emitted for presets (they are
 * multi-property objects, not scalar values). Use the preset objects in JS
 * or the utility classes in CSS.
 */

export interface TypographyPreset {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export const typographyPresets = {
  'display-lg': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-5xl)',
    fontWeight: 'var(--zp-font-weight-bold)',
    lineHeight: 'var(--zp-line-height-tight)',
    letterSpacing: 'var(--zp-letter-spacing-tight)',
  },
  'display-md': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-4xl)',
    fontWeight: 'var(--zp-font-weight-bold)',
    lineHeight: 'var(--zp-line-height-tight)',
    letterSpacing: 'var(--zp-letter-spacing-tight)',
  },
  'heading-1': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-3xl)',
    fontWeight: 'var(--zp-font-weight-bold)',
    lineHeight: 'var(--zp-line-height-tight)',
    letterSpacing: 'var(--zp-letter-spacing-tight)',
  },
  'heading-2': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-2xl)',
    fontWeight: 'var(--zp-font-weight-semibold)',
    lineHeight: 'var(--zp-line-height-snug)',
    letterSpacing: 'var(--zp-letter-spacing-tight)',
  },
  'heading-3': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-xl)',
    fontWeight: 'var(--zp-font-weight-semibold)',
    lineHeight: 'var(--zp-line-height-snug)',
    letterSpacing: 'var(--zp-letter-spacing-normal)',
  },
  'heading-4': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-lg)',
    fontWeight: 'var(--zp-font-weight-semibold)',
    lineHeight: 'var(--zp-line-height-snug)',
    letterSpacing: 'var(--zp-letter-spacing-normal)',
  },
  'heading-5': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-md)',
    fontWeight: 'var(--zp-font-weight-semibold)',
    lineHeight: 'var(--zp-line-height-normal)',
    letterSpacing: 'var(--zp-letter-spacing-normal)',
  },
  'heading-6': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-sm)',
    fontWeight: 'var(--zp-font-weight-semibold)',
    lineHeight: 'var(--zp-line-height-normal)',
    letterSpacing: 'var(--zp-letter-spacing-wide)',
  },
  'body-lg': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-lg)',
    fontWeight: 'var(--zp-font-weight-regular)',
    lineHeight: 'var(--zp-line-height-relaxed)',
    letterSpacing: 'var(--zp-letter-spacing-normal)',
  },
  'body-md': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-md)',
    fontWeight: 'var(--zp-font-weight-regular)',
    lineHeight: 'var(--zp-line-height-normal)',
    letterSpacing: 'var(--zp-letter-spacing-normal)',
  },
  'body-sm': {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-sm)',
    fontWeight: 'var(--zp-font-weight-regular)',
    lineHeight: 'var(--zp-line-height-normal)',
    letterSpacing: 'var(--zp-letter-spacing-normal)',
  },
  caption: {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-xs)',
    fontWeight: 'var(--zp-font-weight-regular)',
    lineHeight: 'var(--zp-line-height-normal)',
    letterSpacing: 'var(--zp-letter-spacing-normal)',
  },
  overline: {
    fontFamily: 'var(--zp-font-family-sans)',
    fontSize: 'var(--zp-font-size-xs)',
    fontWeight: 'var(--zp-font-weight-semibold)',
    lineHeight: 'var(--zp-line-height-normal)',
    letterSpacing: 'var(--zp-letter-spacing-wider)',
  },
  code: {
    fontFamily: 'var(--zp-font-family-mono)',
    fontSize: 'var(--zp-font-size-sm)',
    fontWeight: 'var(--zp-font-weight-regular)',
    lineHeight: 'var(--zp-line-height-relaxed)',
    letterSpacing: 'var(--zp-letter-spacing-normal)',
  },
} as const satisfies Record<string, TypographyPreset>;

export type TypographyPresetName = keyof typeof typographyPresets;
