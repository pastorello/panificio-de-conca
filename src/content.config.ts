// Typed content collections (BRIEF.md §3). Texts are copied verbatim from BRIEF.md §8,
// [[placeholders]] included: in preview they render as <mark class="todo">, in live they fail the build.
import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

/** A value still waiting for the owner's data, e.g. "[[CIVICO]]". */
const placeholder = z.string().regex(/^\[\[[\s\S]+\]\]$/, 'expected a [[placeholder]]');
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'expected HH:MM');
const range = z.tuple([time, time]);
const day = z.array(range);

const pageMeta = z.object({ title: z.string().min(1), description: z.string() });

const site = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/site' }),
  schema: z.object({
    _review: z.string().optional(),
    nav: z.object({
      home: z.string(),
      story: z.string(),
      tiella: z.string(),
      products: z.string(),
      orders: z.string(),
      findus: z.string(),
      contact: z.string(),
    }),
    cta: z.object({
      call: z.string(),
      rule: z.string().includes('{time}'),
      /** Line of the CtaBar and of the CTA row: from the mockups, chosen over cta.rule. */
      day_before: z.string(),
      sold_out: z.string(),
      directions: z.string(),
    }),
    hours: z.object({
      open_today: z.string().includes('{ranges}'),
      closed_today: z.string().includes('{next}'),
      closed_sunday: z.string(),
      special: z.string(),
    }),
    visit: z.object({ title: z.string(), address: z.string(), full_hours: z.string() }),
    footer: z.object({ legal: z.string(), since: z.string() }),
    lang: z.object({ switch: z.string() }),
    season: z.object({
      christmas: z.string(),
      easter: z.string(),
      carnival: z.string(),
      order: z.string(),
    }),
    price: z.object({ from: z.string() }),
    meta: z.object({
      home: pageMeta,
      story: pageMeta,
      tiella: pageMeta,
      products: pageMeta,
      orders: pageMeta,
      findus: pageMeta,
      contact: pageMeta,
      legal: pageMeta,
      notFound: pageMeta,
    }),
    ui: z.object({
      skip: z.string(),
      menu: z.string(),
      menu_close: z.string(),
      nav_label: z.string(),
      footer_nav_label: z.string(),
      call: z.string().includes('{phone}'),
      preview_notice: z.string(),
      vat: z.string(),
      rea: z.string(),
    }),
  }),
});

const business = defineCollection({
  loader: file('src/content/business.json', {
    parser: (text) => [{ id: 'business', ...JSON.parse(text) }],
  }),
  schema: z.object({
    _todo: z.array(z.string()),
    name: z.string(),
    alternateName: z.string(),
    legalName: z.string(),
    vatId: z.string(),
    rea: z.string(),
    foundingDate: z.string(),
    description: z.string(),
    phone: z.object({ e164: z.string(), national: z.string(), international: z.string() }),
    email: z.string(),
    pec: z.string(),
    address: z.object({
      street: z.string(),
      number: z.string(),
      postalCode: z.string(),
      locality: z.string(),
      region: z.string(),
      country: z.string(),
    }),
    geo: z.object({ latitude: z.number(), longitude: z.number() }),
    maps: z.object({ googlePlaceId: z.string(), googleQuery: z.string(), appleQuery: z.string() }),
    hours: z.object({
      timeZone: z.literal('Europe/Rome'),
      weekly: z.object({ mon: day, tue: day, wed: day, thu: day, fri: day, sat: day, sun: day }),
      special: z.array(
        z.object({
          id: z.string(),
          from: z.string().date(),
          to: z.string().date(),
          ranges: z.union([placeholder, z.record(z.string().date(), day)]),
        }),
      ),
    }),
    orderCutoff: z.string(),
    orderNotice: z.string(),
    yeastFreeDay: z.string(),
    priceRange: z.string(),
    paymentAccepted: z.string(),
    currenciesAccepted: z.string(),
    social: z.object({
      facebook: z.string(),
      instagram: z.string(),
      googleMaps: z.string(),
      tripadvisor: z.string(),
    }),
  }),
});

// One card per product and language: products/{it,en,de}/<slug>.md (BRIEF.md §8.6).
const products = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      line: z.string(),
      category: z.enum(['pane', 'salato', 'colazione', 'biscotti', 'dolci', 'feste']),
      season: z.enum(['christmas', 'easter', 'carnival', 'order']).optional(),
      price: z.union([z.number(), placeholder]).optional(),
      order_notice: z.boolean().default(false),
      order: z.number(),
      image: image().optional(),
      alt: z.string().optional(),
      link: z.literal('tiella').optional(),
    }),
});

// Timeline of the story page, one file per language (BRIEF.md §8.4).
const story = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/story' }),
  schema: ({ image }) =>
    z.object({
      items: z.array(
        z.object({
          year: z.string(),
          text: z.string(),
          image: image().optional(),
          alt: z.string().optional(),
          caption: z.string().optional(),
        }),
      ),
    }),
});

export const collections = { site, business, products, story };
