import { describe, it, expect } from 'vitest';
import { extendTheme, createThemePreset } from './extendTheme';
import { Theme } from '../context/ThemeProvider';

describe('extendTheme', () => {
  it('should merge two themes with primitive properties', () => {
    const base: Theme = {
      mode: 'light',
      primaryColor: '#0000ff',
    };

    const override: Partial<Theme> = {
      primaryColor: '#ff0000',
      errorColor: '#cc0000',
    };

    const result = extendTheme(base, override);

    expect(result.mode).toBe('light');
    expect(result.primaryColor).toBe('#ff0000');
    expect(result.errorColor).toBe('#cc0000');
  });

  it('should deep merge semantic colors', () => {
    const base: Theme = {
      mode: 'light',
      semantic: {
        brand: '#0000ff',
        brandHover: '#0000cc',
      } as never,
    };

    const override: Partial<Theme> = {
      semantic: {
        brand: '#ff0000',
        danger: '#cc0000',
      } as never,
    };

    const result = extendTheme(base, override);

    expect(result.semantic?.brand).toBe('#ff0000');
    expect(result.semantic?.brandHover).toBe('#0000cc');
    expect(result.semantic?.danger).toBe('#cc0000');
  });

  it('should deep merge component tokens', () => {
    const base: Theme = {
      components: {
        button: {
          borderRadius: '4px',
          paddingSm: '8px',
        },
      },
    };

    const override: Partial<Theme> = {
      components: {
        button: {
          borderRadius: '8px',
        },
        input: {
          borderRadius: '6px',
        },
      },
    };

    const result = extendTheme(base, override);

    expect(result.components?.button?.borderRadius).toBe('8px');
    expect(result.components?.button?.paddingSm).toBe('8px');
    expect(result.components?.input?.borderRadius).toBe('6px');
  });

  it('should merge CSS variables', () => {
    const base: Theme = {
      cssVars: {
        '--custom-1': 'value1',
        '--custom-2': 'value2',
      },
    };

    const override: Partial<Theme> = {
      cssVars: {
        '--custom-2': 'overridden',
        '--custom-3': 'value3',
      },
    };

    const result = extendTheme(base, override);

    expect(result.cssVars?.['--custom-1']).toBe('value1');
    expect(result.cssVars?.['--custom-2']).toBe('overridden');
    expect(result.cssVars?.['--custom-3']).toBe('value3');
  });

  it('should handle multiple overrides in sequence', () => {
    const base: Theme = {
      mode: 'light',
      primaryColor: '#0000ff',
    };

    const override1: Partial<Theme> = {
      primaryColor: '#ff0000',
    };

    const override2: Partial<Theme> = {
      errorColor: '#cc0000',
      density: 'compact',
    };

    const result = extendTheme(base, override1, override2);

    expect(result.mode).toBe('light');
    expect(result.primaryColor).toBe('#ff0000');
    expect(result.errorColor).toBe('#cc0000');
    expect(result.density).toBe('compact');
  });

  it('should handle empty base theme', () => {
    const base: Theme = {};
    const override: Partial<Theme> = {
      mode: 'dark',
      primaryColor: '#ff0000',
    };

    const result = extendTheme(base, override);

    expect(result.mode).toBe('dark');
    expect(result.primaryColor).toBe('#ff0000');
  });

  it('should handle empty override', () => {
    const base: Theme = {
      mode: 'light',
      primaryColor: '#0000ff',
    };
    const override: Partial<Theme> = {};

    const result = extendTheme(base, override);

    expect(result.mode).toBe('light');
    expect(result.primaryColor).toBe('#0000ff');
  });
});

describe('createThemePreset', () => {
  it('should create a reusable theme preset', () => {
    const preset = createThemePreset({
      mode: 'highContrast',
      semantic: {
        focusRing: '#ffff00',
      } as never,
    });

    expect(preset.mode).toBe('highContrast');
    expect(preset.semantic?.focusRing).toBe('#ffff00');
  });

  it('should be composable with extendTheme', () => {
    const base: Theme = {
      mode: 'light',
      primaryColor: '#0000ff',
    };

    const highContrastPreset = createThemePreset({
      mode: 'highContrast',
      semantic: {
        focusRing: '#ffff00',
      } as never,
    });

    const result = extendTheme(base, highContrastPreset);

    expect(result.mode).toBe('highContrast');
    expect(result.primaryColor).toBe('#0000ff');
    expect(result.semantic?.focusRing).toBe('#ffff00');
  });
});
