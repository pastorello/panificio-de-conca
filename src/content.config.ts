// Typed content collections (BRIEF.md §3). Texts are copied verbatim from BRIEF.md §8,
// [[placeholders]] included: in preview they render as <mark class="todo">, in live they fail the build.
import { defineCollection, z, type SchemaContext } from 'astro:content';
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
      closed_now: z.string().includes('{next}'),
      closed_today: z.string().includes('{next}'),
      closed_sunday: z.string(),
      next_today: z.string().includes('{time}'),
      next_tomorrow: z.string().includes('{time}'),
      next_day: z.string().includes('{day}').includes('{time}'),
      closed: z.string(),
      today: z.string(),
      special: z.string(),
      table_caption: z.string(),
    }),
    visit: z.object({ title: z.string(), address: z.string(), full_hours: z.string() }),
    /** Link labels of MapLinks (brief §8.8: «Apple Karten» in German). */
    maps: z.object({ google: z.string(), apple: z.string() }),
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
      // Holiday periods: hours by weekday and/or by date win over the week; "pending" holds
      // the [[placeholder]] while the owner has not confirmed them (src/lib/hours.ts).
      special: z.array(
        z
          .object({
            id: z.string(),
            from: z.string().date(),
            to: z.string().date(),
            weekly: z
              .object({ mon: day, tue: day, wed: day, thu: day, fri: day, sat: day, sun: day })
              .partial()
              .optional(),
            dates: z.record(z.string().date(), day).optional(),
            pending: placeholder.optional(),
          })
          .refine((special) => special.from <= special.to, 'from must not be after to'),
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
      /** «Foto 13 — maritozzi con la panna, 4:3»: the brief's photo list (§9), while the shot is missing. */
      placeholder: z.string().optional(),
      link: z.literal('tiella').optional(),
    }),
});

// La storia, one file per language (BRIEF.md §8.4): title, timeline and sources box.
const story = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/story' }),
  schema: ({ image }) =>
    z.object({
      _review: z.string().optional(),
      title: z.string(),
      subtitle: z.string(),
      items: z.array(
        z.object({
          year: z.string(),
          text: z.string(),
          image: image().optional(),
          alt: z.string().optional(),
          /** «Foto 22 — pergamena del centenario, 3:2», while the shot of the brief's list is missing. */
          placeholder: z.string().optional(),
          caption: z.string().optional(),
          /** Period photo, already black and white in the file. */
          vintage: z.boolean().default(false),
        }),
      ),
      sources: z.object({
        label: z.string(),
        items: z.array(
          z.object({ href: z.string().url(), text: z.string(), note: z.string().optional() }),
        ),
      }),
    }),
});

type ImageHelper = SchemaContext['image'];

/**
 * A photo of the page: the file with its alt text in the page's language or, while the shot of the
 * brief's list (§9) does not exist, the placeholder with its number («Foto 9 — pane senza lievito»).
 */
const photo = (image: ImageHelper) =>
  z
    .object({
      image: image().optional(),
      alt: z.string().optional(),
      placeholder: z.string().optional(),
      caption: z.string().optional(),
    })
    .refine((p) => (p.image ? Boolean(p.alt) : Boolean(p.placeholder)), {
      message: 'a photo needs image and alt, or a placeholder',
    });

/** A card of the counter outside the products collection (the six of the Home). */
const card = (image: ImageHelper) =>
  z.object({
    name: z.string(),
    line: z.string(),
    image: image().optional(),
    alt: z.string().optional(),
    placeholder: z.string().optional(),
    /** Only the tiella card leads to its page. */
    link: z.literal('tiella').optional(),
  });

const pageBase = { _review: z.string().optional(), title: z.string() };
/** An H2 section of the brief: title and one or more paragraphs. */
const section = z.object({ title: z.string(), text: z.array(z.string()).min(1) });

// Copy of each page, one file per page and language: pages/{it,en,de}/<page>.json (BRIEF.md §8).
// `page` names the template, so that every file is checked against the shape of its page.
const pages = defineCollection({
  loader: glob({ pattern: '*/*.json', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.discriminatedUnion('page', [
      z.object({
        page: z.literal('home'),
        ...pageBase,
        subtitle: z.string(),
        hero: z.object({ image: image(), imageDesktop: image(), alt: z.string() }),
        counter: z.object({
          title: z.string(),
          items: z.array(card(image)).length(6),
          more: z.string(),
        }),
        story: z.object({
          title: z.string(),
          text: z.string(),
          photo: photo(image),
          more: z.string(),
        }),
        order: z.object({ title: z.string(), text: z.string(), more: z.string() }),
      }),
      z.object({
        page: z.literal('tiella'),
        ...pageBase,
        subtitle: z.string(),
        /** Label of the call button in the CTA row (brief §8.5: «Chiama per prenotare»). */
        call: z.string(),
        photo: photo(image),
        what: section,
        fillings: z.object({
          title: z.string(),
          items: z.array(card(image)),
          /** The fillings still to be confirmed: a [[placeholder]] in a card of its own. */
          more: z.string().optional(),
          note: z.string(),
        }),
        when: section,
        takeaway: section,
        /** Booking rule at the end, under the CtaBar line as title (mockup mobile-tiella). */
        rule: z.string(),
      }),
      z.object({
        page: z.literal('products'),
        ...pageBase,
        subtitle: z.string(),
        /** aria-label of the category links. */
        categoriesLabel: z.string(),
        categories: z.object({
          pane: z.string(),
          salato: z.string(),
          colazione: z.string(),
          biscotti: z.string(),
          dolci: z.string(),
          feste: z.string(),
        }),
        /** Link to Ordini under the booking rule, which is the first section of Ordini. */
        more: z.string(),
      }),
      z.object({
        page: z.literal('orders'),
        ...pageBase,
        subtitle: z.string(),
        /** The booking rule, an OrderRule with the call button (DESIGN.md §5.4). */
        fresh: section,
        what: section,
        holidays: section.extend({
          /** The holiday price list in public/listini/: a [[placeholder]] until the file exists. */
          priceList: z.object({ label: z.string(), href: z.string() }),
        }),
        business: section,
        boats: section,
        shipping: section,
      }),
      z.object({
        page: z.literal('findus'),
        ...pageBase,
        photo: photo(image),
        /** Address line of the brief §8.8, followed by the two map links. */
        address: z.string(),
        modes: z
          .array(
            z.object({
              icon: z.enum(['car', 'train-front', 'footprints', 'sailboat']),
              title: z.string(),
              text: z.string(),
            }),
          )
          .length(4),
        /** Photo 24 of the brief, the seafront with the base, at the end of the page. */
        view: photo(image),
      }),
      z.object({
        page: z.literal('contact'),
        ...pageBase,
        /** Headings of DESIGN.md §5.8: weekly hours with holiday hours, address, social. */
        hours: z.object({ title: z.string() }),
        address: z.object({ title: z.string(), text: z.string(), more: z.string() }),
        social: z.object({ title: z.string(), note: z.string(), email: z.string() }),
      }),
      z.object({
        page: z.literal('legal'),
        ...pageBase,
        /** Labels of the company data; the values come from business.json. */
        company: z.object({
          name: z.string(),
          office: z.string(),
          vat: z.string(),
          rea: z.string(),
          phone: z.string(),
          email: z.string(),
        }),
        privacy: section,
      }),
      // The 404 page has one block per language: its file in each language gives that block.
      z.object({ page: z.literal('404'), ...pageBase, home: z.string() }),
    ]),
});

export const collections = { site, business, products, story, pages };
