// Checks on the built site in dist/ (CLAUDE.md, Verifiche). Runs after `astro build`.
// - every page: canonical absolute with trailing slash, hreflang it/en/de + x-default (English),
//   reciprocal between the three versions, <html lang> matching the URL
// - JSON-LD Bakery valid on the homes and the "Dove siamo" pages
// - internal links point to files that exist; no inline executable scripts (CSP)
// - preview: noindex everywhere, robots.txt blocks all, no sitemap
// - live: no [[ in dist/, nothing noindex, robots.txt open, sitemap present, business._todo empty
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { loadEnv } from 'vite';
import { locales, pathFor, routeKeys, xDefaultLocale } from '../src/routes.ts';

const DIST = 'dist';
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const phase = env.SITE_PHASE || 'preview';
const site = env.SITE_URL || 'http://localhost:4321';
/** Every page has exactly one H1 (CLAUDE.md, Accessibilità). */
const H1_REQUIRED = true;

const errors = [];
const warnings = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return files.flat();
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'g')) ?? [];

/** URL path served for a file in dist/: dist/en/our-story/index.html → /en/our-story/ */
function urlPath(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  return '/' + rel.replace(/index\.html$/, '');
}

const files = await walk(DIST);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const pages = new Map();
for (const file of htmlFiles) pages.set(urlPath(file), await readFile(file, 'utf8'));

// Every route in every language must exist.
const expected = routeKeys.flatMap((key) => locales.map((locale) => pathFor(key, locale)));
for (const path of expected) {
  if (!pages.has(path)) fail(path, 'page missing from dist/');
}
const jsonLdPaths = new Set(
  ['home', 'findus'].flatMap((key) => locales.map((locale) => pathFor(key, locale))),
);

const placeholderCounts = [];

/** The component gallery exists only in builds with SITE_GALLERY=true, never online. */
const GALLERY = '/componenti/';
if (pages.has(GALLERY)) {
  if (phase === 'live') fail(GALLERY, 'component gallery in a live build (unset SITE_GALLERY)');
  pages.delete(GALLERY);
}

for (const [path, html] of pages) {
  const isNotFound = path === '/404.html';
  const head = html.slice(0, html.indexOf('</head>'));

  // lang
  const lang = attr(tags(html, 'html')[0] ?? '', 'lang');
  const expectedLang = isNotFound ? 'it' : (locales.find((l) => path.startsWith(`/${l}/`)) ?? 'it');
  if (lang !== expectedLang) fail(path, `<html lang="${lang}">, expected "${expectedLang}"`);

  // one H1
  const h1 = (html.match(/<h1\b/g) ?? []).length;
  if (h1 !== 1) (H1_REQUIRED ? errors : warnings).push(`${path}: ${h1} <h1> (expected 1)`);

  // robots
  const robots = tags(head, 'meta').find((tag) => attr(tag, 'name') === 'robots');
  const noindex = robots ? /noindex/.test(attr(robots, 'content') ?? '') : false;
  if (phase === 'preview' && !noindex) fail(path, 'missing noindex in preview');
  if (phase === 'live' && noindex && !isNotFound) fail(path, 'noindex in live');

  // inline executable scripts would break the CSP (script-src 'self')
  for (const tag of tags(html, 'script')) {
    if (!attr(tag, 'src') && attr(tag, 'type') !== 'application/ld+json') {
      fail(path, 'inline <script> (not allowed by the Content-Security-Policy)');
    }
  }

  // internal links and assets
  for (const tag of [...tags(html, 'a'), ...tags(html, 'link'), ...tags(html, 'img')]) {
    const ref = attr(tag, 'href') ?? attr(tag, 'src');
    if (!ref || !ref.startsWith('/') || ref.startsWith('//')) continue;
    const target = ref.split('#')[0].split('?')[0];
    const file = target.endsWith('/') ? join(DIST, target, 'index.html') : join(DIST, target);
    if (!(await exists(file))) fail(path, `broken internal link ${ref}`);
  }

  // placeholders
  const count = (html.match(/\[\[/g) ?? []).length;
  if (count) placeholderCounts.push([path, count]);

  if (isNotFound) continue;

  // canonical
  const canonicals = tags(head, 'link').filter((tag) => attr(tag, 'rel') === 'canonical');
  const self = new URL(path, site).href;
  if (canonicals.length !== 1) fail(path, `${canonicals.length} canonical links`);
  else if (attr(canonicals[0], 'href') !== self) {
    fail(path, `canonical ${attr(canonicals[0], 'href')} ≠ ${self}`);
  }

  // hreflang: the three languages, itself among them, x-default to English, reciprocal
  const alternates = new Map(
    tags(head, 'link')
      .filter((tag) => attr(tag, 'rel') === 'alternate' && attr(tag, 'hreflang'))
      .map((tag) => [attr(tag, 'hreflang'), attr(tag, 'href')]),
  );
  for (const code of [...locales, 'x-default']) {
    const href = alternates.get(code);
    if (!href) {
      fail(path, `missing hreflang="${code}"`);
      continue;
    }
    if (!href.startsWith('http') || !href.endsWith('/'))
      fail(path, `hreflang ${code} not absolute`);
  }
  if (alternates.get(expectedLang) !== self)
    fail(path, 'hreflang does not include the page itself');
  if (alternates.get('x-default') !== alternates.get(xDefaultLocale)) {
    fail(path, 'x-default does not point to the English version');
  }
  for (const code of locales) {
    const href = alternates.get(code);
    if (!href) continue;
    const other = pages.get(new URL(href).pathname);
    if (!other) {
      fail(path, `hreflang ${code} → ${href} not in dist/`);
      continue;
    }
    const back = tags(other.slice(0, other.indexOf('</head>')), 'link').some(
      (tag) => attr(tag, 'hreflang') === expectedLang && attr(tag, 'href') === self,
    );
    if (!back) fail(path, `hreflang ${code} → ${href} does not link back`);
  }

  // JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (jsonLdPaths.has(path)) {
    if (blocks.length !== 1) fail(path, `${blocks.length} JSON-LD blocks, expected 1`);
    else await checkBakery(path, blocks[0][1]);
  }
}

async function checkBakery(path, source) {
  let data;
  try {
    data = JSON.parse(source);
  } catch (error) {
    fail(path, `JSON-LD is not valid JSON: ${error.message}`);
    return;
  }
  const must = (condition, message) => condition || fail(path, `JSON-LD: ${message}`);
  must(data['@context'] === 'https://schema.org', '@context must be https://schema.org');
  must(data['@type'] === 'Bakery', '@type must be Bakery');
  for (const key of [
    '@id',
    'name',
    'url',
    'telephone',
    'address',
    'geo',
    'openingHoursSpecification',
  ]) {
    must(data[key] !== undefined, `missing ${key}`);
  }
  must(
    !('aggregateRating' in data) && !('menu' in data),
    'aggregateRating and menu are not allowed',
  );
  must(/^\+\d{8,15}$/.test(data.telephone ?? ''), 'telephone must be in E.164');
  must(data.url === new URL('/', site).href, 'url must be the site root');
  const address = data.address ?? {};
  must(address['@type'] === 'PostalAddress', 'address must be a PostalAddress');
  for (const key of ['streetAddress', 'addressLocality', 'postalCode', 'addressCountry']) {
    must(typeof address[key] === 'string' && address[key], `address.${key} missing`);
  }
  must(
    typeof data.geo?.latitude === 'number' && typeof data.geo?.longitude === 'number',
    'geo needs numeric latitude and longitude',
  );
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const spec of data.openingHoursSpecification ?? []) {
    const list = [spec.dayOfWeek].flat();
    must(spec['@type'] === 'OpeningHoursSpecification', 'openingHoursSpecification @type');
    must(list.length > 0 && list.every((day) => days.includes(day)), 'dayOfWeek must be day names');
    must(/^\d\d:\d\d$/.test(spec.opens) && /^\d\d:\d\d$/.test(spec.closes), 'opens/closes HH:MM');
  }
  for (const image of [data.image ?? []].flat()) {
    const url = new URL(image);
    must(url.origin === new URL(site).origin, `image ${image} must be on the site`);
    must(await exists(join(DIST, url.pathname)), `image ${image} not in dist/`);
  }
  if (phase === 'live') {
    for (const link of data.sameAs ?? []) {
      must(URL.canParse(link) && link.startsWith('https://'), `sameAs ${link} is not a URL`);
    }
  }
}

// robots.txt and sitemap
const robots = await readFile(join(DIST, 'robots.txt'), 'utf8').catch(() => '');
const hasSitemap = files.some((file) => /sitemap.*\.xml$/.test(file));
if (phase === 'preview') {
  if (!/Disallow:\s*\/\s*$/m.test(robots))
    fail('robots.txt', 'must contain "Disallow: /" in preview');
  if (hasSitemap) fail('sitemap', 'no sitemap in preview');
} else {
  if (/Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'blocks everything in live');
  if (!hasSitemap) fail('sitemap', 'sitemap-index.xml missing in live');
  // No placeholder anywhere in the output, and nothing left on the business to-do list.
  for (const file of files.filter((f) => /\.(html|xml|txt|json|webmanifest)$/.test(f))) {
    if ((await readFile(file, 'utf8')).includes('[[')) fail(relative(DIST, file), 'contains [[');
  }
  const business = JSON.parse(await readFile('src/content/business.json', 'utf8'));
  for (const item of business._todo ?? []) fail('business.json', `to do: ${item}`);
}

// Report
const total = placeholderCounts.reduce((sum, [, count]) => sum + count, 0);
console.log(`\nverify-dist · SITE_PHASE=${phase} · ${pages.size} pages`);
if (total) {
  console.log(`placeholders [[…]]: ${total} in ${placeholderCounts.length} pages`);
  for (const [path, count] of placeholderCounts.sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${String(count).padStart(3)}  ${path}`);
  }
}
for (const warning of warnings) console.warn(`warning  ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`error    ${error}`);
  console.error(`\n${errors.length} error(s)`);
  process.exit(1);
}
console.log('ok');
