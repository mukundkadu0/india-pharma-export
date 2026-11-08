// Internationalisation architecture. Only English is implemented and enabled today.
// A language appears in the switcher, in hreflang and in the sitemap ONLY when `enabled` is true,
// and it must not be set to true until every page has human-reviewed pharmaceutical and
// regulatory translations. See docs/DESIGN_SYSTEM.md ("Adding a language").
//
// URL scheme: English stays at the root (/products/...). Other languages live under a
// language prefix (/fr/products/..., /ar/products/...). No IP-based redirects: every language
// version is a normal crawlable URL, and visitors choose with the switcher.

export type Locale = 'en' | 'fr' | 'es' | 'ar' | 'pt' | 'ru';

interface LocaleInfo {
  label: string;       // shown in the language's own script
  dir: 'ltr' | 'rtl';
  hreflang: string;
  ogLocale: string;
  enabled: boolean;    // flip only when translations are complete and human-reviewed
}

export const locales: Record<Locale, LocaleInfo> = {
  en: { label: 'English', dir: 'ltr', hreflang: 'en', ogLocale: 'en_IN', enabled: true },
  fr: { label: 'Français', dir: 'ltr', hreflang: 'fr', ogLocale: 'fr_FR', enabled: false },
  es: { label: 'Español', dir: 'ltr', hreflang: 'es', ogLocale: 'es_ES', enabled: false },
  ar: { label: 'العربية', dir: 'rtl', hreflang: 'ar', ogLocale: 'ar_AE', enabled: false },
  pt: { label: 'Português', dir: 'ltr', hreflang: 'pt', ogLocale: 'pt_PT', enabled: false },
  ru: { label: 'Русский', dir: 'ltr', hreflang: 'ru', ogLocale: 'ru_RU', enabled: false },
};

export const defaultLocale: Locale = 'en';
export const enabledLocales = (Object.keys(locales) as Locale[]).filter((l) => locales[l].enabled);

/** Locale from a URL path such as /fr/products/ (English has no prefix). */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/')[1] as Locale;
  return seg && seg !== defaultLocale && enabledLocales.includes(seg) ? seg : defaultLocale;
}

/** Path with any language prefix removed. */
export function stripLocale(pathname: string): string {
  const l = localeFromPath(pathname);
  return l === defaultLocale ? pathname : pathname.replace(new RegExp(`^/${l}(?=/|$)`), '') || '/';
}

export function localePath(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  return locale === defaultLocale ? base : `/${locale}${base === '/' ? '/' : base}`;
}

/** hreflang alternates for a page. Empty until a second language is enabled. */
export function hreflangEntries(pathname: string, origin: string) {
  if (enabledLocales.length < 2) return [];
  const entries = enabledLocales.map((l) => ({ hreflang: locales[l].hreflang, href: new URL(localePath(pathname, l), origin).href }));
  entries.push({ hreflang: 'x-default', href: new URL(localePath(pathname, defaultLocale), origin).href });
  return entries;
}

export const formatDate = (d: Date | string, locale: Locale = defaultLocale) =>
  new Intl.DateTimeFormat(locales[locale].hreflang, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(d));
export const formatNumber = (n: number, locale: Locale = defaultLocale) => new Intl.NumberFormat(locales[locale].hreflang).format(n);
