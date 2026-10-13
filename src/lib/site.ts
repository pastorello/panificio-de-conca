// Loads the interface strings and the business data once per build.
import { getEntry, type CollectionEntry } from 'astro:content';
import type { Locale, RouteKey } from '../routes';
import { hasPlaceholder } from './text';

export type Strings = CollectionEntry<'site'>['data'];
export type Business = CollectionEntry<'business'>['data'];

export async function getStrings(locale: Locale): Promise<Strings> {
  const entry = await getEntry('site', locale);
  if (!entry) throw new Error(`Missing src/content/site/${locale}.json`);
  return entry.data;
}

export async function getBusiness(): Promise<Business> {
  const entry = await getEntry('business', 'business');
  if (!entry) throw new Error('Missing src/content/business.json');
  return entry.data;
}

/** "0771 460651" in Italian, "+39 0771 460651" in English and German (DESIGN.md §7, decision 12). */
export function displayPhone(business: Business, locale: Locale): string {
  return locale === 'it' ? business.phone.national : business.phone.international;
}

export function telHref(business: Business): string {
  return `tel:${business.phone.e164}`;
}

/** Map links (BRIEF.md §5, DESIGN.md §7 decision 6): Google is the universal default. */
export function mapUrls(business: Business): { google: string; apple: string } {
  const { latitude, longitude } = business.geo;
  const { googlePlaceId, googleQuery, appleQuery } = business.maps;
  const q = (value: string) => encodeURIComponent(value).replace(/%20/g, '+');
  const ll = `${latitude},${longitude}`;
  const google = hasPlaceholder(googlePlaceId)
    ? `https://www.google.com/maps/search/?api=1&query=${q(googleQuery)}`
    : `https://www.google.com/maps/search/?api=1&query=${ll}&query_place_id=${q(googlePlaceId)}`;
  const apple = `https://maps.apple.com/?q=${q(appleQuery)}&ll=${ll}`;
  return { google, apple };
}

/** Menu label of a page: the nav.* strings, plus footer.legal for the legal page. */
export function navLabel(t: Strings, key: RouteKey): string {
  return key === 'legal' ? t.footer.legal : t.nav[key];
}
