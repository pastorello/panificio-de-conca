// Translated slugs (BRIEF.md §4). Single source for pages, menus, language switch,
// hreflang and sitemap: add a page here and everything else follows.

export const locales = ['it', 'en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';
/** hreflang="x-default" points to English (BRIEF.md §4). */
export const xDefaultLocale: Locale = 'en';

export const routes = {
  home: { it: '', en: '', de: '' },
  story: { it: 'storia', en: 'our-story', de: 'geschichte' },
  tiella: { it: 'tiella-di-gaeta', en: 'tiella-di-gaeta', de: 'tiella-di-gaeta' },
  products: { it: 'prodotti', en: 'bread-and-pastries', de: 'brot-und-gebaeck' },
  orders: { it: 'ordini', en: 'orders', de: 'bestellen' },
  findus: { it: 'dove-siamo', en: 'find-us', de: 'anfahrt' },
  contact: { it: 'contatti', en: 'contact', de: 'kontakt' },
  legal: { it: 'note-legali', en: 'legal', de: 'impressum' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;
export const routeKeys = Object.keys(routes) as RouteKey[];

/** Desktop header: the home is the logo (DESIGN.md §5.1). */
export const headerNav: RouteKey[] = ['story', 'tiella', 'products', 'orders', 'findus', 'contact'];
/** NavSheet: seven entries, home first (DESIGN.md §5.1). */
export const sheetNav: RouteKey[] = ['home', ...headerNav];
/** Footer: the seven entries plus the legal page (DESIGN.md §5.1). */
export const footerNav: RouteKey[] = [...sheetNav, 'legal'];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Root-relative path with trailing slash: "/", "/storia/", "/en/our-story/". */
export function pathFor(key: RouteKey, locale: Locale): string {
  const prefix = locale === defaultLocale ? '' : `${locale}/`;
  const slug = routes[key][locale];
  return `/${prefix}${slug ? `${slug}/` : ''}`;
}

export function absoluteUrl(path: string, site: URL | string): string {
  return new URL(path, site).href;
}

export interface Alternate {
  hreflang: Locale | 'x-default';
  href: string;
}

/** The three language versions of a page plus x-default (English), absolute. */
export function alternatesFor(key: RouteKey, site: URL | string): Alternate[] {
  const list: Alternate[] = locales.map((locale) => ({
    hreflang: locale,
    href: absoluteUrl(pathFor(key, locale), site),
  }));
  list.push({ hreflang: 'x-default', href: absoluteUrl(pathFor(key, xDefaultLocale), site) });
  return list;
}

/** Same page in every language, for the language switch. */
export function languageLinks(key: RouteKey): { locale: Locale; href: string }[] {
  return locales.map((locale) => ({ locale, href: pathFor(key, locale) }));
}

/** Parameters for the catch-all page `src/pages/[...slug].astro`. */
export function staticPaths() {
  return routeKeys.flatMap((key) =>
    locales.map((locale) => {
      const path = pathFor(key, locale).replace(/^\/|\/$/g, '');
      return { params: { slug: path || undefined }, props: { routeKey: key, locale } };
    }),
  );
}

/** Finds the route behind an absolute URL, for the sitemap. */
export function routeForUrl(url: string, site: URL | string): RouteKey | undefined {
  const path = new URL(url, site).pathname;
  return routeKeys.find((key) => locales.some((locale) => pathFor(key, locale) === path));
}

/** `links` for @astrojs/sitemap's serialize(): the same alternates as the HTML. */
export function sitemapLinks(url: string, site: URL | string): { lang: string; url: string }[] {
  const key = routeForUrl(url, site);
  if (!key) return [];
  return alternatesFor(key, site).map(({ hreflang, href }) => ({ lang: hreflang, url: href }));
}
