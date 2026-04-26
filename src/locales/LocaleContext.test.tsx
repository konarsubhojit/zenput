import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  LocaleProvider,
  useLocale,
  interpolate,
} from './LocaleContext';
import type { PartialMessageCatalog } from './types';
import { enUS } from './catalogs/en-US';
import { frFR } from './catalogs/fr-FR';
import { deDE } from './catalogs/de-DE';
import { esES } from './catalogs/es-ES';
import { jaJP } from './catalogs/ja-JP';
import { arSA } from './catalogs/ar-SA';
import { heIL } from './catalogs/he-IL';
import { ptBR } from './catalogs/pt-BR';
import { zhCN } from './catalogs/zh-CN';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function TestConsumer({ onValue }: { onValue: (ctx: ReturnType<typeof useLocale>) => void }) {
  const ctx = useLocale();
  onValue(ctx);
  return null;
}

function renderWithLocale(
  props: { locale?: string; messages?: PartialMessageCatalog; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; timeZone?: string },
  onValue: (ctx: ReturnType<typeof useLocale>) => void
) {
  render(
    <LocaleProvider {...props}>
      <TestConsumer onValue={onValue} />
    </LocaleProvider>
  );
}

// ---------------------------------------------------------------------------
// interpolate
// ---------------------------------------------------------------------------

describe('interpolate', () => {
  it('returns the template unchanged when no params', () => {
    expect(interpolate('Hello world')).toBe('Hello world');
  });

  it('replaces single placeholder', () => {
    expect(interpolate('Page {n}', { n: 3 })).toBe('Page 3');
  });

  it('replaces multiple placeholders', () => {
    expect(interpolate('{start}–{end} of {total}', { start: 1, end: 10, total: 100 })).toBe(
      '1–10 of 100'
    );
  });

  it('leaves unknown placeholders unchanged', () => {
    expect(interpolate('{start}–{end}', { start: 1 })).toBe('1–{end}');
  });
});

// ---------------------------------------------------------------------------
// Default context (no provider)
// ---------------------------------------------------------------------------

describe('useLocale — no provider', () => {
  it('returns en-US locale', () => {
    let ctx!: ReturnType<typeof useLocale>;
    function Grabber() {
      ctx = useLocale();
      return null;
    }
    render(<Grabber />);
    expect(ctx.locale).toBe('en-US');
  });

  it('t() returns the en-US default for a known key', () => {
    let ctx!: ReturnType<typeof useLocale>;
    function Grabber() {
      ctx = useLocale();
      return null;
    }
    render(<Grabber />);
    expect(ctx.t('autoComplete.noOptions')).toBe(enUS['autoComplete.noOptions']);
  });
});

// ---------------------------------------------------------------------------
// LocaleProvider
// ---------------------------------------------------------------------------

describe('LocaleProvider', () => {
  it('exposes the provided locale tag', () => {
    let locale = '';
    renderWithLocale({ locale: 'fr-FR', messages: frFR }, (ctx) => {
      locale = ctx.locale;
    });
    expect(locale).toBe('fr-FR');
  });

  it('exposes weekStartsOn', () => {
    let wso: number | undefined;
    renderWithLocale({ locale: 'fr-FR', messages: frFR, weekStartsOn: 1 }, (ctx) => {
      wso = ctx.weekStartsOn;
    });
    expect(wso).toBe(1);
  });

  it('exposes timeZone', () => {
    let tz: string | undefined;
    renderWithLocale({ locale: 'fr-FR', messages: frFR, timeZone: 'Europe/Paris' }, (ctx) => {
      tz = ctx.timeZone;
    });
    expect(tz).toBe('Europe/Paris');
  });
});

// ---------------------------------------------------------------------------
// t() — fallback chain
// ---------------------------------------------------------------------------

describe('t() fallback chain', () => {
  it('prefers consumer-provided message over en-US default', () => {
    let result = '';
    renderWithLocale({ locale: 'fr-FR', messages: frFR }, (ctx) => {
      result = ctx.t('autoComplete.noOptions');
    });
    expect(result).toBe(frFR['autoComplete.noOptions']);
    expect(result).not.toBe(enUS['autoComplete.noOptions']);
  });

  it('falls back to en-US when a key is absent from the provided messages', () => {
    const partial: PartialMessageCatalog = {
      'autoComplete.noOptions': 'Custom',
      // 'dataTable.noData' is intentionally omitted
    };
    let result = '';
    renderWithLocale({ locale: 'fr-FR', messages: partial }, (ctx) => {
      result = ctx.t('dataTable.noData');
    });
    expect(result).toBe(enUS['dataTable.noData']);
  });

  it('interpolates params in the translated string', () => {
    let result = '';
    renderWithLocale({ locale: 'fr-FR', messages: frFR }, (ctx) => {
      result = ctx.t('dataTable.paginationRange', { start: 1, end: 10, total: 50 });
    });
    expect(result).toContain('1');
    expect(result).toContain('10');
    expect(result).toContain('50');
  });

  it('falls back to key string and warns for completely missing key', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let result = '';
    // Force a situation where both messages and enUS lack the key
    const partial: PartialMessageCatalog = {};
    renderWithLocale({ locale: 'en-US', messages: partial }, (ctx) => {
      // Cast to bypass TypeScript — simulate a typo / future key
      result = (ctx.t as (k: string) => string)('nonexistent.key.xyz' as never);
    });
    expect(result).toBe('nonexistent.key.xyz');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('nonexistent.key.xyz')
    );
    warnSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

describe('formatDate', () => {
  it('returns a non-empty string for a valid date', () => {
    let result = '';
    renderWithLocale({ locale: 'en-US', messages: enUS }, (ctx) => {
      result = ctx.formatDate(new Date('2024-06-15'));
    });
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats differently for fr-FR vs en-US', () => {
    let enResult = '';
    let frResult = '';
    renderWithLocale({ locale: 'en-US', messages: enUS }, (ctx) => {
      enResult = ctx.formatDate(new Date('2024-06-15'), { dateStyle: 'short' });
    });
    renderWithLocale({ locale: 'fr-FR', messages: frFR }, (ctx) => {
      frResult = ctx.formatDate(new Date('2024-06-15'), { dateStyle: 'short' });
    });
    // They should both be non-empty and differ in format
    expect(enResult.length).toBeGreaterThan(0);
    expect(frResult.length).toBeGreaterThan(0);
    expect(enResult).not.toBe(frResult);
  });
});

describe('formatNumber', () => {
  it('formats an integer in en-US', () => {
    let result = '';
    renderWithLocale({ locale: 'en-US', messages: enUS }, (ctx) => {
      result = ctx.formatNumber(1234567);
    });
    expect(result).toContain('1,234,567');
  });

  it('produces a non-empty result in de-DE (uses period thousands separator)', () => {
    let result = '';
    renderWithLocale({ locale: 'de-DE', messages: deDE }, (ctx) => {
      result = ctx.formatNumber(1234567);
    });
    expect(result.length).toBeGreaterThan(0);
    // German uses period as thousands separator
    expect(result).toContain('1.234.567');
  });
});

describe('formatCurrency', () => {
  it('formats USD in en-US', () => {
    let result = '';
    renderWithLocale({ locale: 'en-US', messages: enUS }, (ctx) => {
      result = ctx.formatCurrency(42.5, 'USD');
    });
    expect(result).toContain('42');
    expect(result).toMatch(/\$|USD/);
  });

  it('formats EUR in fr-FR', () => {
    let result = '';
    renderWithLocale({ locale: 'fr-FR', messages: frFR }, (ctx) => {
      result = ctx.formatCurrency(42.5, 'EUR');
    });
    expect(result).toContain('42');
    expect(result).toMatch(/€|EUR/);
  });
});

describe('formatRelativeTime', () => {
  it('formats relative time in en-US', () => {
    let result = '';
    renderWithLocale({ locale: 'en-US', messages: enUS }, (ctx) => {
      result = ctx.formatRelativeTime(-2, 'day');
    });
    // Intl.RelativeTimeFormat produces something like "2 days ago"
    expect(result).toContain('2');
    expect(result).toContain('day');
  });

  it('formats relative time in fr-FR differently from en-US', () => {
    let enResult = '';
    let frResult = '';
    renderWithLocale({ locale: 'en-US', messages: enUS }, (ctx) => {
      enResult = ctx.formatRelativeTime(-2, 'day');
    });
    renderWithLocale({ locale: 'fr-FR', messages: frFR }, (ctx) => {
      frResult = ctx.formatRelativeTime(-2, 'day');
    });
    expect(frResult.length).toBeGreaterThan(0);
    expect(frResult).not.toBe(enResult);
  });
});

// ---------------------------------------------------------------------------
// All built-in catalogs have every key defined
// ---------------------------------------------------------------------------

describe('catalog completeness', () => {
  const catalogEntries: [string, PartialMessageCatalog][] = [
    ['en-US', enUS],
    ['fr-FR', frFR],
    ['de-DE', deDE],
    ['es-ES', esES],
    ['ja-JP', jaJP],
    ['ar-SA', arSA],
    ['he-IL', heIL],
    ['pt-BR', ptBR],
    ['zh-CN', zhCN],
  ];

  const baseKeys = Object.keys(enUS) as Array<keyof typeof enUS>;

  catalogEntries.forEach(([name, catalog]) => {
    it(`${name} has all keys from en-US`, () => {
      baseKeys.forEach((key) => {
        expect(catalog).toHaveProperty(key);
        expect(typeof (catalog as Record<string, unknown>)[key]).toBe('string');
        expect((catalog as Record<string, string>)[key].length).toBeGreaterThan(0);
      });
    });
  });
});

// ---------------------------------------------------------------------------
// Component integration smoke tests
// ---------------------------------------------------------------------------

describe('AutoComplete with locale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows locale no-options message when no options match', async () => {
    const userEvent = (await import('@testing-library/user-event')).default;
    const { AutoComplete } = await import('../components/AutoComplete/AutoComplete');
    render(
      <LocaleProvider locale="fr-FR" messages={frFR}>
        <AutoComplete options={[]} label="Test" />
      </LocaleProvider>
    );
    await userEvent.click(screen.getByRole('combobox'));
    // The fr-FR "no options" message should appear
    expect(
      screen.getByText(frFR['autoComplete.noOptions'])
    ).toBeInTheDocument();
  });
});

describe('Pagination with locale', () => {
  it('uses locale aria-labels', async () => {
    const { Pagination } = await import('../components/Pagination/Pagination');
    render(
      <LocaleProvider locale="de-DE" messages={deDE}>
        <Pagination currentPage={2} totalCount={100} pageSize={10} onPageChange={() => {}} />
      </LocaleProvider>
    );
    expect(screen.getByRole('navigation', { name: deDE['pagination.navAriaLabel'] })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: deDE['pagination.previousPage'] })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: deDE['pagination.nextPage'] })).toBeInTheDocument();
  });
});
