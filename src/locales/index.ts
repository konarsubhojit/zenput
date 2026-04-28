/**
 * zenput/locales — i18n sub-path
 *
 * Provides `LocaleProvider`, `useLocale`, Intl formatters, and built-in
 * message catalogs.  Each catalog is a separate module so tree-shaking
 * removes unused locales from your bundle.
 *
 * @example
 * ```tsx
 * import { LocaleProvider, useLocale, frFR } from 'zenput/locales';
 *
 * <LocaleProvider locale="fr-FR" messages={frFR}>
 *   <App />
 * </LocaleProvider>
 * ```
 */

// Core API
export { LocaleProvider, useLocale, interpolate } from './LocaleContext';
export type { LocaleContextValue, LocaleProviderProps } from './LocaleContext';

// Types
export type { MessageCatalog, MessageKey, PartialMessageCatalog } from './types';

// Built-in catalogs (tree-shakeable — each is its own module)
export { enUS } from './catalogs/en-US';
export { frFR } from './catalogs/fr-FR';
export { deDE } from './catalogs/de-DE';
export { esES } from './catalogs/es-ES';
export { jaJP } from './catalogs/ja-JP';
export { arSA } from './catalogs/ar-SA';
export { heIL } from './catalogs/he-IL';
export { ptBR } from './catalogs/pt-BR';
export { zhCN } from './catalogs/zh-CN';
