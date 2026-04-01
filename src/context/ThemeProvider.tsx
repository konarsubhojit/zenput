import React, { createContext, useContext, CSSProperties } from 'react';

export interface Theme {
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
}

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: {} });

interface ThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps): JSX.Element {
  const cssVars: Record<string, string> = {};

  if (theme.primaryColor) cssVars['--input-primary-color'] = theme.primaryColor;
  if (theme.errorColor) cssVars['--input-error-color'] = theme.errorColor;
  if (theme.successColor) cssVars['--input-success-color'] = theme.successColor;
  if (theme.warningColor) cssVars['--input-warning-color'] = theme.warningColor;
  if (theme.borderRadius) cssVars['--input-border-radius'] = theme.borderRadius;
  if (theme.fontFamily) cssVars['--input-font-family'] = theme.fontFamily;
  if (theme.fontSize) cssVars['--input-font-size'] = theme.fontSize;
  if (theme.borderColor) cssVars['--input-border-color'] = theme.borderColor;
  if (theme.bgColor) cssVars['--input-bg-color'] = theme.bgColor;
  if (theme.textColor) cssVars['--input-text-color'] = theme.textColor;
  if (theme.placeholderColor) cssVars['--input-placeholder-color'] = theme.placeholderColor;
  if (theme.focusRingColor) cssVars['--input-focus-ring-color'] = theme.focusRingColor;
  if (theme.disabledBg) cssVars['--input-disabled-bg'] = theme.disabledBg;
  if (theme.disabledText) cssVars['--input-disabled-text'] = theme.disabledText;

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div style={cssVars as CSSProperties}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
