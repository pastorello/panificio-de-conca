// Checks a published site over HTTP (DESIGN.md §9.2 Fase 5, §9.3, §10.4), after Workers Builds:
//  - every page answers 200, with <html lang>, canonical and hreflang on the published address
//    (a build without SITE_URL would point them to localhost);
//  - preview: noindex on every page, robots.txt blocks everything, no sitemap;
//    live (--live): no noindex, robots.txt open with the sitemap, sitemap-index.xml answers;
//  - an unknown address answers 404 with the trilingual page; an address without the final slash
//    is redirected to the one with it;
//  - the security headers of public/_headers, long cache on /_astro/, the two fonts.
//   npm run check:site -- https://panificio-de-conca.luca-6ad.workers.dev/
//   npm run check:site -- https://panificiodeconca.it/ --live
import { locales, pathFor, routeKeys } from '../src/routes.ts';

const args = process.argv.slice(2);
const base = args.find((arg) => /^https?:\/\//.test(arg));
const live = args.includes('--live');
if (!base) {
  console.error('Usage: npm run check:site -- <published URL> [--live]');
  process.exit(2);
}
const site = new URL(base);
const results = [];
const check = (name, ok, detail = '') =>
  results.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);

const attr = (tag, name) => tag?.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'g')) ?? [];
const get = (path, options = {}) => fetch(new URL(path, site), { redirect: 'manual', ...options });

// Pages
const problems = [];
let home = '';
for (const key of routeKeys) {
  for (const locale of locales) {
    const path = pathFor(key, locale);
    const response = await get(path);
    if (response.status !== 200) {
      problems.push(`${path}: ${response.status}`);
      continue;
    }
    const html = await response.text();
    if (path === '/') home = html;
    const head = html.slice(0, html.indexOf('</head>'));
    const self = new URL(path, site).href;
    const lang = attr(tags(html, 'html')[0], 'lang');
    if (lang !== locale) problems.push(`${path}: lang="${lang}"`);
    const canonical = attr(
      tags(head, 'link').find((tag) => attr(tag, 'rel') === 'canonical'),
      'href',
    );
    if (canonical !== self) problems.push(`${path}: canonical ${canonical}`);
    const foreign = tags(head, 'link')
      .filter((tag) => attr(tag, 'hreflang'))
      .map((tag) => attr(tag, 'href'))
      .filter((href) => new URL(href).origin !== site.origin);
    if (foreign.length) problems.push(`${path}: hreflang fuori dal sito ${foreign[0]}`);
    const robots = attr(
      tags(head, 'meta').find((tag) => attr(tag, 'name') === 'robots'),
      'content',
    );
    const noindex =
      /noindex/.test(robots ?? '') || /noindex/.test(response.headers.get('x-robots-tag') ?? '');
    if (!live && !noindex) problems.push(`${path}: senza noindex`);
    if (live && noindex) problems.push(`${path}: noindex in live`);
  }
}
check(
  `24 pagine: 200, lang, canonical e hreflang su ${site.origin}, ${live ? 'senza noindex' : 'noindex'}`,
  !problems.length,
  problems.join('\n       '),
);

// JSON-LD of the home on the published address
const jsonLd = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
const bakery = jsonLd ? JSON.parse(jsonLd) : {};
check(
  'JSON-LD Bakery della Home sull’indirizzo pubblicato',
  bakery['@type'] === 'Bakery' && bakery.url === new URL('/', site).href,
  `url ${bakery.url}`,
);

// robots.txt and sitemap
const robots = await (await get('/robots.txt')).text();
const sitemap = await get('/sitemap-index.xml');
if (live) {
  check(
    'robots.txt aperto con la sitemap',
    !/^Disallow: \/\s*$/m.test(robots) &&
      robots.includes(`Sitemap: ${new URL('/sitemap-index.xml', site).href}`),
    robots.trim().replace(/\n/g, ' | '),
  );
  check('sitemap-index.xml risponde', sitemap.status === 200, String(sitemap.status));
} else {
  check(
    'robots.txt blocca tutto',
    /^Disallow: \/\s*$/m.test(robots),
    robots.trim().replace(/\n/g, ' | '),
  );
  check('nessuna sitemap in anteprima', sitemap.status === 404, String(sitemap.status));
}

// 404 and trailing slash
const missing = await get('/pagina-che-non-esiste/');
const notFound = await missing.text();
check(
  'indirizzo inesistente: 404 con la pagina trilingue',
  missing.status === 404 &&
    ['/', '/en/', '/de/'].every((href) => notFound.includes(`href="${href}"`)),
  String(missing.status),
);
const slash = await get(pathFor('story', 'it').replace(/\/$/, ''));
check(
  'indirizzo senza barra finale reindirizzato',
  [301, 302, 307, 308].includes(slash.status) &&
    new URL(slash.headers.get('location') ?? '', site).pathname === pathFor('story', 'it'),
  `${slash.status} ${slash.headers.get('location')}`,
);

// Headers, cache, fonts
const headers = (await get('/')).headers;
const required = [
  'strict-transport-security',
  'content-security-policy',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
];
const absent = required.filter((name) => !headers.get(name));
check(
  'intestazioni di sicurezza di public/_headers',
  !absent.length,
  `mancano ${absent.join(', ')}`,
);
const asset = home.match(/"(\/_astro\/[^"]+\.(?:js|avif|webp))"/)?.[1];
const cache = asset ? ((await get(asset)).headers.get('cache-control') ?? '') : '';
check('cache lunga sui file di /_astro/', /immutable/.test(cache), `${asset} ${cache}`);
const fonts = await Promise.all([600, 700].map((weight) => get(`/fonts/fraunces-${weight}.woff2`)));
check(
  'font Fraunces 600 e 700',
  fonts.every((font) => font.status === 200 && font.headers.get('content-type') === 'font/woff2'),
  fonts.map((font) => `${font.status} ${font.headers.get('content-type')}`).join(', '),
);

console.log(`check-site · ${site.origin} · ${live ? 'live' : 'anteprima'}`);
console.log(results.join('\n'));
if (results.some((line) => line.startsWith('FAIL'))) process.exit(1);
