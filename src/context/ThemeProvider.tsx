import React, { createContext, useContext, useMemo, CSSProperties } from 'react';
import {
  buildCssVariables,
  semanticByMode,
  CSS_VAR_PREFIX,
  SemanticColors,
  ThemeMode,
} from '../tokens';

/**
 * Theme override shape.
 *
 * Back-compatible keys (primaryColor, errorColor, …) from Zenput 1.x are
 * preserved and continue to emit the original `--input-*` CSS variables
 * consumed by the form-input components.
 *
 * Additional properties (`mode`, `semantic`, `cssVars`) opt into the
 * full design-system token surface (`--zp-*` CSS variables).
 */
export interface Theme {
  // ---- Legacy 1.x overrides (still supported) ----
  primaryColor?: string;
  errorColor?: string;
  successColor?: string;
  warningColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  fontSize?: string;
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
  placeholderColor?: string;
  focusRingColor?: string;
  disabledBg?: string;
  disabledText?: string;

  // ---- Design-system overrides ----
  /** Theme mode. Default: `'light'`. */
  mode?: ThemeMode;
  /** Partial overrides on top of the mode's semantic palette. */
  semantic?: Partial<SemanticColors>;
  /**
   * Arbitrary extra CSS custom properties to merge in (e.g. custom
   * per-brand variables). Keys should include their leading `--`.
   */
  cssVars?: Record<string, string>;
}

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  semantic: SemanticColors;
  cssVars: Record<string, string>;
}

const defaultMode: ThemeMode = 'light';
const defaultSemantic = semanticByMode[defaultMode];
const defaultCssVars = buildCssVariables(defaultSemantic);

const ThemeContext = createContext<ThemeContextValue>({
  theme: {},
  mode: defaultMode,
  semantic: defaultSemantic,
  cssVars: defaultCssVars,
});

/**
 * Create a resolved theme object. Accepts partial overrides and falls
 * back to the mode's default semantic palette.
 */
export function createTheme(theme: Theme = {}): {
  mode: ThemeMode;
  semantic: SemanticColors;
  cssVars: Record<string, string>;
} {
  const mode = theme.mode ?? defaultMode;
  const semantic: SemanticColors = {
    ...semanticByMode[mode],
    ...(theme.semantic ?? {}),
  };
  const cssVars: Record<string, string> = {
    ...buildCssVariables(semantic),
    ...(theme.cssVars ?? {}),
  };
  return { mode, semantic, cssVars };
}

/**
 * Map legacy (1.x) theme fields onto the original `--input-*` CSS
 * variables so existing form inputs keep working unchanged.
 */
function legacyCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  if (theme.primaryColor) vars['--input-primary-color'] = theme.primaryColor;
  if (theme.errorColor) vars['--input-error-color'] = theme.errorColor;
  if (theme.successColor) vars['--input-success-color'] = theme.successColor;
  if (theme.warningColor) vars['--input-warning-color'] = theme.warningColor;
  if (theme.borderRadius) vars['--input-border-radius'] = theme.borderRadius;
  if (theme.fontFamily) vars['--input-font-family'] = theme.fontFamily;
  if (theme.fontSize) vars['--input-font-size'] = theme.fontSize;
  if (theme.borderColor) vars['--input-border-color'] = theme.borderColor;
  if (theme.bgColor) vars['--input-bg-color'] = theme.bgColor;
  if (theme.textColor) vars['--input-text-color'] = theme.textColor;
  if (theme.placeholderColor) vars['--input-placeholder-color'] = theme.placeholderColor;
  if (theme.focusRingColor) vars['--input-focus-ring-color'] = theme.focusRingColor;
  if (theme.disabledBg) vars['--input-disabled-bg'] = theme.disabledBg;
  if (theme.disabledText) vars['--input-disabled-text'] = theme.disabledText;
  return vars;
}

interface ThemeProviderProps {
  theme?: Theme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme = {}, children }: ThemeProviderProps): JSX.Element {
  const { mode, semantic, cssVars } = useMemo(() => createTheme(theme), [theme]);
  const legacy = useMemo(() => legacyCssVars(theme), [theme]);

  const mergedVars = useMemo(
    () => ({ ...cssVars, ...legacy }),
    [cssVars, legacy]
  );

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ theme, mode, semantic, cssVars: mergedVars }),
    [theme, mode, semantic, mergedVars]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div data-zp-theme={mode} style={mergedVars as CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/**
 * Resolve a token reference to its CSS `var(...)` expression.
 *
 * Examples:
 *   useToken('color-brand')             -> 'var(--zp-color-brand)'
 *   useToken('space-4')                 -> 'var(--zp-space-4)'
 *   useToken('color-brand', '#0000ff')  -> 'var(--zp-color-brand, #0000ff)'
 */
export function useToken(name: string, fallback?: string): string {
  // Context is intentionally not read: CSS variables are scoped via the
  // ThemeProvider wrapper element, and `var(...)` just references them.
  // The hook exists for ergonomics and future extensibility.
  return fallback
    ? `var(${CSS_VAR_PREFIX}-${name}, ${fallback})`
    : `var(${CSS_VAR_PREFIX}-${name})`;
}
