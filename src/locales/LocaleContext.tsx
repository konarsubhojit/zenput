import React, { createContext, useContext, useMemo } from 'react';
import type { MessageCatalog, MessageKey, PartialMessageCatalog } from './types';
import { enUS } from './catalogs/en-US';
import { warnOnce } from '../utils/warnOnce';

// ---------------------------------------------------------------------------
// Intl formatter caches (module-level, memoised per locale + options hash)
// ---------------------------------------------------------------------------

const _dtfCache = new Map<string, Intl.DateTimeFormat>();
const _nfCache = new Map<string, Intl.NumberFormat>();
const _rtfCache = new Map<string, Intl.RelativeTimeFormat>();

/** Stable JSON string for cache keys — sorts object keys to avoid order-dependent misses. */
function _stableKey(options: object | null | undefined): string {
  if (options == null) return 'null';
  return JSON.stringify(
    Object.fromEntries(Object.entries(options as Record<string, unknown>).sort())
  );
}

function _cachedDTF(locale: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}::${_stableKey(options)}`;
  if (!_dtfCache.has(key)) _dtfCache.set(key, new Intl.DateTimeFormat(locale, options));
  return _dtfCache.get(key)!;
}

function _cachedNF(locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}::${_stableKey(options)}`;
  if (!_nfCache.has(key)) _nfCache.set(key, new Intl.NumberFormat(locale, options));
  return _nfCache.get(key)!;
}

function _cachedRTF(
  locale: string,
  options?: Intl.RelativeTimeFormatOptions
): Intl.RelativeTimeFormat {
  const key = `${locale}::${_stableKey(options)}`;
  if (!_rtfCache.has(key)) _rtfCache.set(key, new Intl.RelativeTimeFormat(locale, options));
  return _rtfCache.get(key)!;
}

// ---------------------------------------------------------------------------
// Interpolation helper  ({key} → value)
// ---------------------------------------------------------------------------

/**
 * Replaces `{key}` placeholders in a template string with values from `params`.
 *
 * The regex /\{(\w+)\}/g is intentionally simple and does not exhibit
 * catastrophic backtracking: `\w+` is a non-nested greedy quantifier on a
 * fixed-width character class, making it safe for all inputs. Templates are
 * always sourced from the internal message catalog, never from untrusted input.
 */
export function interpolate(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in params ? String(params[k]) : `{${k}}`
  );
}

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

export interface LocaleContextValue {
  /** BCP-47 locale tag (e.g. "en-US", "fr-FR"). */
  locale: string;
  /** Merged messages (provided overrides merged on top of en-US defaults). */
  messages: PartialMessageCatalog;
  /** First day of the week: 0 = Sunday … 6 = Saturday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** IANA time-zone name (e.g. "Europe/Paris"). */
  timeZone?: string;

  /** Format a date/time value using `Intl.DateTimeFormat`. */
  formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string;
  /** Format a number using `Intl.NumberFormat`. */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
  /** Format a monetary amount using `Intl.NumberFormat` with `style: "currency"`. */
  formatCurrency(value: number, currency: string, options?: Intl.NumberFormatOptions): string;
  /** Format a relative time (e.g. "2 days ago") using `Intl.RelativeTimeFormat`. */
  formatRelativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions
  ): string;
  /**
   * Translate a message key, optionally interpolating `{placeholder}` tokens.
   *
   * Fallback chain:
   *   1. `messages[key]` (consumer-provided overrides)
   *   2. `en-US` defaults
   *   3. The raw key string (with a `warnOnce` in dev)
   */
  t(key: MessageKey, params?: Record<string, string | number>): string;
}

// ---------------------------------------------------------------------------
// Factory — builds a LocaleContextValue for a given locale + messages pair
// ---------------------------------------------------------------------------

function buildContextValue(
  locale: string,
  messages: PartialMessageCatalog,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  timeZone?: string
): LocaleContextValue {
  function formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string {
    const opts: Intl.DateTimeFormatOptions = timeZone
      ? { timeZone, ...options }
      : (options ?? {});
    return _cachedDTF(locale, opts).format(date);
  }

  function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return _cachedNF(locale, options).format(value);
  }

  function formatCurrency(
    value: number,
    currency: string,
    options?: Intl.NumberFormatOptions
  ): string {
    return _cachedNF(locale, { style: 'currency', currency, ...options }).format(value);
  }

  function formatRelativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions
  ): string {
    return _cachedRTF(locale, options).format(value, unit);
  }

  function t(key: MessageKey, params?: Record<string, string | number>): string {
    // Prefer consumer-provided override, then en-US base, then key itself.
    const raw =
      (messages as Record<string, string | undefined>)[key] ??
      (enUS as Record<string, string | undefined>)[key];

    if (raw === undefined) {
      warnOnce(
        `locale:missing:${key}`,
        `[zenput/locales] Missing message key: "${key}". Falling back to key string.`
      );
      return interpolate(key, params);
    }

    return interpolate(raw, params);
  }

  return {
    locale,
    messages,
    weekStartsOn,
    timeZone,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    t,
  };
}

// ---------------------------------------------------------------------------
// Default context value (en-US, no provider required)
// ---------------------------------------------------------------------------

const DEFAULT_LOCALE_CONTEXT: LocaleContextValue = buildContextValue('en-US', enUS);

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const LocaleContext = createContext<LocaleContextValue>(DEFAULT_LOCALE_CONTEXT);

// ---------------------------------------------------------------------------
// LocaleProvider
// ---------------------------------------------------------------------------

export interface LocaleProviderProps {
  /**
   * BCP-47 locale tag used for `Intl` formatters (e.g. "fr-FR").
   * Defaults to "en-US".
   */
  locale?: string;
  /**
   * Message catalog overrides. Keys present here take precedence over the
   * built-in en-US defaults; missing keys fall back to en-US.
   */
  messages?: PartialMessageCatalog;
  /**
   * First day of the week: 0 = Sunday, 1 = Monday, … 6 = Saturday.
   * Passed through via `useLocale()` for calendar components.
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * IANA time-zone identifier (e.g. "Europe/Paris") applied as the default
   * `timeZone` option for `formatDate`.
   */
  timeZone?: string;
  children: React.ReactNode;
}

export function LocaleProvider({
  locale = 'en-US',
  messages = {},
  weekStartsOn,
  timeZone,
  children,
}: Readonly<LocaleProviderProps>): React.JSX.Element {
  const value = useMemo(
    () => buildContextValue(locale, messages, weekStartsOn, timeZone),
    [locale, messages, weekStartsOn, timeZone]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

// ---------------------------------------------------------------------------
// useLocale hook
// ---------------------------------------------------------------------------

/**
 * Returns the current locale context value.
 * Falls back to en-US defaults when called outside a `<LocaleProvider>`.
 */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
