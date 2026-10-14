// DESIGN.md §3 principles 1–5 and the checklist §10.1, measured on the built pages (§2 B4–B6 were
// never run on the mockups):
//  - fold: at 390 × 660, the visible height of an iPhone with Safari's bars, the H1, the subtitle
//    and, on Home, Contatti and Dove siamo, OpenNow end above the CtaBar; without JavaScript, and
//    with it at the times that give OpenNow each of its texts (open, closed, Sunday, each period
//    of special hours in business.json). On Dove siamo without JavaScript the static line of the
//    week may end under the fold (design/HANDOFF.md §5): there it is only reported;
//  - «Chiama e prenota» visible without scrolling and the booking sentence on every page, at 390
//    and 1440 px;
//  - one hand: in the top third of the phone screen no target besides the header (logo,
//    telephone, Menu) and the telephone number; the 404, whose content is the three links home,
//    is the exception (design/HANDOFF.md §5);
//  - the first thing under the header is the H1 or a photo; no text lies over a photo;
//  - Home has six product cards and Prodotti the six categories of BRIEF.md §8.6; the language
//    switch is in the desktop header, the NavSheet and the footer; no form, embedded map,
//    carousel, banner or «order online»; every missing photo shows its number from BRIEF.md §9.
import { readFile } from 'node:fs/promises';
import { locales, pathFor } from '../../src/routes.ts';
import { allPaths, localeOf, romeInstant } from '../lib/dist.mjs';

const PHONE = { width: 390, height: 660 };
const DESKTOP = { width: 1440, height: 900 };
/** Pages whose opening carries OpenNow (DESIGN.md §3 principle 2). */
const OPEN_NOW = ['home', 'contact', 'findus'].flatMap((key) =>
  locales.map((locale) => pathFor(key, locale)),
);
/** Dove siamo: without JavaScript OpenNow may end under the fold (design/HANDOFF.md §5). */
const FIND_US = locales.map((locale) => pathFor('findus', locale));
const HOMES = locales.map((locale) => pathFor('home', locale));
const PRODUCTS = locales.map((locale) => pathFor('products', locale));
/** The 404: its links home are the page itself (design/HANDOFF.md §5). */
const NOT_FOUND = ['/404.html'];
const ORDER_ONLINE =
  /ordina(?:re)? online|order online|online (?:bestellen|shop)|carrello|add to cart|warenkorb/i;

/** In the page: where the opening ends, against the top of the CtaBar. */
function foldState() {
  const shown = (el) =>
    el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
  const bottom = (el) => (shown(el) ? Math.round(el.getBoundingClientRect().bottom) : null);
  const bar = [...document.querySelectorAll('.dc-ctabar')].find(shown);
  const h1 = document.querySelector('main h1');
  const next = h1?.nextElementSibling;
  return {
    bar: bar ? Math.round(bar.getBoundingClientRect().top) : null,
    barBottom: bottom(bar),
    h1: bottom(h1),
    subtitle: next?.matches('p:not(.dc-opennow)') ? bottom(next) : null,
    // The opening's OpenNow comes first; the VisitBlock at the end of the page has another.
    openNow: bottom(document.querySelector('main .dc-opennow')),
  };
}

/** In the page: the measurable rules of DESIGN.md §3 and §10.1 that do not depend on the clock. */
function pageState({ call, rule }) {
  const clean = (text) => text.replace(/[­⁠]/g, '').replace(/\s+/g, ' ').trim();
  const shown = (el) => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
  const inView = (r) =>
    r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth;
  const label = (el) => `«${clean(el.textContent).slice(0, 40)}»`;

  const calls = [...document.querySelectorAll('a.dc-btn--primary[href^="tel:"]')].filter(
    (el) => shown(el) && inView(el.getBoundingClientRect()),
  );
  const rules = [...document.querySelectorAll('.dc-ctabar__rule, .dc-ctarow__rule')].filter(
    (el) => shown(el) && clean(el.textContent) === rule,
  );

  // Targets in the top third of the screen, outside the header; the telephone number may be there.
  const third = innerHeight / 3;
  const high = [...document.querySelectorAll('a[href], button, summary')]
    .filter((el) => shown(el) && !el.closest('.dc-header, dialog, .dc-skip, .dc-ctabar'))
    .filter((el) => !el.getAttribute('href')?.startsWith('tel:'))
    .filter((el) => el.getBoundingClientRect().top < third)
    .map(label);

  // The first thing under the header, by position: H1 or photo.
  const main = document.querySelector('main');
  let first = null;
  for (const el of main.querySelectorAll('*')) {
    if (!shown(el)) continue;
    const isImage = el.matches('img, .dc-figure__placeholder');
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.data.trim());
    if (!isImage && !hasText) continue;
    const top = el.getBoundingClientRect().top;
    if (!first || top < first.top - 0.5) first = { el, top };
  }
  const firstOk =
    first && (first.el.closest('h1') || first.el.matches('img, .dc-figure__placeholder'));

  // Text over a photo: any line box of a text node crossing an image.
  const images = [...document.querySelectorAll('img')]
    .filter(shown)
    .map((img) => img.getBoundingClientRect());
  const over = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    // The fixed CtaBar passes over the photos when the page scrolls: that is not layout.
    if (!node.data.trim() || !shown(parent) || parent.closest('.dc-skip, .dc-sr, .dc-ctabar'))
      continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const line of range.getClientRects()) {
      const hit = images.some(
        (r) =>
          Math.min(line.right, r.right) - Math.max(line.left, r.left) > 1 &&
          Math.min(line.bottom, r.bottom) - Math.max(line.top, r.top) > 1,
      );
      if (hit) {
        over.push(`«${clean(node.data).slice(0, 30)}»`);
        break;
      }
    }
  }

  // Missing photos: the number of the brief's list in the box.
  const unnumbered = [
    ...document.querySelectorAll('.dc-figure__placeholder, .dc-card__placeholder'),
  ]
    .filter((el) => !/\b(?:Foto|Photo) \d+\b/.test(el.textContent))
    .map(label);

  // Only the CtaBar is pinned to the screen: no banner.
  const pinned = [...document.querySelectorAll('body *')]
    .filter((el) => ['fixed', 'sticky'].includes(getComputedStyle(el).position) && shown(el))
    .filter((el) => !el.closest('.dc-ctabar, dialog'))
    .map((el) => el.className || el.tagName);

  return {
    call: calls.map(label),
    callLabel: calls.some((el) => clean(el.textContent) === call),
    rule: rules.length,
    high,
    first: first ? `${first.el.tagName.toLowerCase()} ${label(first.el)}` : 'niente',
    firstOk: Boolean(firstOk),
    over,
    unnumbered,
    pinned,
    forbidden: [
      ...[...document.querySelectorAll('form, iframe, embed, object')].map((el) => el.tagName),
      ...[...document.querySelectorAll('[aria-roledescription]')].map((el) =>
        el.getAttribute('aria-roledescription'),
      ),
      ...[...document.querySelectorAll('body *')]
        .filter((el) => getComputedStyle(el).scrollSnapType !== 'none')
        .map(() => 'scroll-snap (carosello)'),
    ],
    text: clean(document.body.innerText),
    cards: document.querySelectorAll('main .dc-card').length,
    categories: document.querySelectorAll('main .dc-cat').length,
    lang: {
      header: [...document.querySelectorAll('.dc-header .dc-lang')].some(shown),
      sheet: Boolean(document.querySelector('[data-navsheet] .dc-lang')),
      footer: [...document.querySelectorAll('.dc-footer .dc-lang')].some(shown),
    },
  };
}

/** Times in Rome that give OpenNow each of its texts, special hours from business.json included. */
async function openNowTimes() {
  const business = JSON.parse(await readFile('src/content/business.json', 'utf8'));
  const special = (business.special_hours ?? []).map((period) => `${period.from}T10:00`);
  return [
    { at: '2026-10-13T10:00', label: 'martedì, aperto' },
    { at: '2026-10-13T14:00', label: 'martedì, chiuso fino alle 16:30' },
    { at: '2026-10-18T10:00', label: 'domenica' },
    ...special.map((at) => ({ at, label: `orari delle feste (${at.slice(0, 10)})` })),
  ];
}

export async function run({ browser, origin, check, note }) {
  const strings = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => [
        locale,
        JSON.parse(await readFile(`src/content/site/${locale}.json`, 'utf8')).cta,
      ]),
    ),
  );

  // Fold, without JavaScript and with it at each OpenNow text.
  const runs = [{ label: 'senza JavaScript', js: false, paths: allPaths }];
  for (const time of await openNowTimes()) {
    runs.push({
      label: time.label,
      js: true,
      at: time.at,
      paths: time.at === '2026-10-13T10:00' ? allPaths : OPEN_NOW,
    });
  }
  const fold = [];
  const lowest = [];
  for (const { label, js, at, paths } of runs) {
    const context = await browser.newContext({
      viewport: PHONE,
      timezoneId: 'Europe/Rome',
      javaScriptEnabled: js,
    });
    if (at) await context.clock.setFixedTime(romeInstant(at));
    const page = await context.newPage();
    for (const path of paths) {
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(foldState);
      const where = `${path} (${label})`;
      const limit = state.bar ?? PHONE.height;
      if (state.bar === null || state.barBottom > PHONE.height)
        fold.push(`${where}: CtaBar fuori dallo schermo`);
      for (const part of ['h1', 'subtitle']) {
        if (state[part] !== null && state[part] > limit)
          fold.push(`${where}: ${part} finisce a ${state[part]} px, la CtaBar comincia a ${limit}`);
      }
      if (!OPEN_NOW.includes(path)) continue;
      if (state.openNow === null) {
        fold.push(`${where}: manca OpenNow`);
        continue;
      }
      const room = limit - state.openNow;
      if (!js && FIND_US.includes(path)) {
        if (room < 0)
          note(`piega: OpenNow finisce ${-room} px sotto la CtaBar, ${where} (accettato)`);
        continue;
      }
      if (room < 0)
        fold.push(`${where}: OpenNow finisce a ${state.openNow} px, la CtaBar comincia a ${limit}`);
      lowest.push({ where, room });
    }
    await context.close();
  }
  check(
    'piega a 390 × 660: H1, sottotitolo e OpenNow (Home, Contatti, Dove siamo) sopra la CtaBar, con e senza JavaScript (25 pagine)',
    !fold.length,
    fold.join('\n       '),
  );
  const tight = lowest.sort((a, b) => a.room - b.room)[0];
  if (tight)
    note(`piega: il margine più stretto sopra la CtaBar è ${tight.room} px, ${tight.where}`);

  // Everything else, at 390 × 660 and 1440 × 900.
  const problems = {
    call: [],
    rule: [],
    high: [],
    first: [],
    over: [],
    numbers: [],
    banner: [],
    forbidden: [],
    counts: [],
    lang: [],
  };
  for (const viewport of [PHONE, DESKTOP]) {
    const phone = viewport === PHONE;
    const context = await browser.newContext({ viewport, timezoneId: 'Europe/Rome' });
    await context.clock.setFixedTime(romeInstant('2026-10-13T10:00'));
    const page = await context.newPage();
    for (const path of allPaths) {
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const t = strings[localeOf(path)];
      const state = await page.evaluate(pageState, { call: t.call, rule: t.day_before });
      const where = `${path} (${viewport.width} px)`;
      if (!state.call.length)
        problems.call.push(`${where}: nessun bottone di chiamata visibile senza scorrere`);
      if (!state.rule) problems.rule.push(`${where}: manca «${t.day_before}»`);
      if (phone && state.high.length && !NOT_FOUND.includes(path))
        problems.high.push(`${where}: ${state.high.join(', ')}`);
      if (!state.firstOk) problems.first.push(`${where}: prima viene ${state.first}`);
      if (state.over.length) problems.over.push(`${where}: ${state.over.join(', ')}`);
      if (state.unnumbered.length)
        problems.numbers.push(`${where}: ${state.unnumbered.join(', ')}`);
      if (state.pinned.length) problems.banner.push(`${where}: ${state.pinned.join(', ')}`);
      if (state.forbidden.length)
        problems.forbidden.push(`${where}: ${[...new Set(state.forbidden)].join(', ')}`);
      if (ORDER_ONLINE.test(state.text))
        problems.forbidden.push(`${where}: «${state.text.match(ORDER_ONLINE)[0]}»`);
      if (HOMES.includes(path) && state.cards !== 6)
        problems.counts.push(`${where}: ${state.cards} card`);
      if (PRODUCTS.includes(path) && state.categories !== 6)
        problems.counts.push(`${where}: ${state.categories} categorie`);
      const missing = Object.entries(state.lang)
        .filter(([place, found]) => !found && (place !== 'header' || !phone))
        .map(([place]) => place);
      if (missing.length) problems.lang.push(`${where}: manca in ${missing.join(', ')}`);
    }
    await context.close();
  }
  const pages = `${allPaths.length} pagine, 390 e 1440 px`;
  const report = (name, list) => check(`${name} (${pages})`, !list.length, list.join('\n       '));
  report('bottone di chiamata visibile senza scorrere', problems.call);
  report('regola della prenotazione in ogni pagina', problems.rule);
  report('nel terzo alto del telefono solo header e numero di telefono', problems.high);
  report('sotto l’header prima l’H1 o una foto', problems.first);
  report('nessun testo sopra le foto', problems.over);
  report('ogni foto mancante porta il suo numero del brief §9', problems.numbers);
  report('nessun banner fisso oltre alla CtaBar', problems.banner);
  report('niente moduli, mappe incorporate, caroselli, «ordina online»', problems.forbidden);
  report('sei card in Home, sei categorie in Prodotti', problems.counts);
  report('selettore lingua in header (desktop), NavSheet e footer', problems.lang);
}
