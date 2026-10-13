// JSON-LD "Bakery" for the three homes and the three "Dove siamo" pages (BRIEF.md §6),
// generated from business.json. No aggregateRating, no menu, nothing without data.
import { weekdays, type Weekday } from './hours';
import type { Business } from './site';

const dayNames: Record<Weekday, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

/** Images cited by the JSON-LD: fixed names in public/img/ (BRIEF.md §6). */
export const jsonLdImages = ['/img/banco.jpg'];

export function bakeryJsonLd(business: Business, site: URL | string): Record<string, unknown> {
  const root = new URL('/', site).href;
  const { address, geo, hours, social } = business;

  // Days with the same schedule share one entry per time range, as in the brief's example.
  const groups = new Map<string, Weekday[]>();
  for (const day of weekdays) {
    if (hours.weekly[day].length === 0) continue;
    const key = JSON.stringify(hours.weekly[day]);
    groups.set(key, [...(groups.get(key) ?? []), day]);
  }
  const openingHoursSpecification = [...groups].flatMap(([key, days]) =>
    (JSON.parse(key) as [string, string][]).map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days.length === 1 ? dayNames[days[0]] : days.map((day) => dayNames[day]),
      opens,
      closes,
    })),
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': `${root}#bakery`,
    name: business.name,
    alternateName: business.alternateName,
    description: business.description,
    url: root,
    telephone: business.phone.e164,
    priceRange: business.priceRange,
    foundingDate: business.foundingDate,
    image: jsonLdImages.map((path) => new URL(path, site).href),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.street} ${address.number}`,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: geo.latitude, longitude: geo.longitude },
    openingHoursSpecification,
    paymentAccepted: business.paymentAccepted,
    currenciesAccepted: business.currenciesAccepted,
    sameAs: [social.facebook, social.instagram, social.googleMaps, social.tripadvisor],
  };
}
