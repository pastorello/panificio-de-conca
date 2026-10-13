// Side-by-side comparison of the built site with the mockups (CLAUDE.md, Verifiche): the mockup
// board on the left, the page on the right, cut into slices in .shots/compare/. Both are rendered
// here, in the same Chromium, at 390 and 1440 px: the PNGs in design/mockups/ come from a browser
// that does not hyphenate Italian, and the HTML boards are the reference (design/HANDOFF.md §1).
// The clock is fixed at the mockups' time (Tuesday 10:00 in Rome), so OpenNow says the same thing.
// Serves dist/ itself, so run `npm run build` first.
//   npm run compare                         every page that has a board
//   npm run compare -- /storia/ /de/        only these paths
//   npm run compare -- --at=2026-10-18T10:00 /contatti/   another time in Rome
// English pages are compared with the Italian boards (there are no English ones): layout only.
import { createServer } from 'node:http';
import { mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { locales, pathFor } from '../src/routes.ts';

const DIST = 'dist';
const BOARDS = join('design', 'mockups', 'html');
const OUT = join('.shots', 'compare');
const GAP = 16;
const VIEWPORTS = [
  { name: '390', width: 390, height: 844, slice: 1000, board: 'mobile' },
  { name: '1440', width: 1440, height: 900, slice: 900, board: 'desktop' },
];
/** Board name per route, as in design/HANDOFF.md §3. Desktop A is the chosen Home. */
const BOARD_NAMES = {
  home: { mobile: 'home', desktop: 'home-a' },
  tiella: { mobile: 'tiella', desktop: 'tiella' },
  products: { mobile: 'prodotti', desktop: 'prodotti' },
  story: { mobile: 'storia', desktop: 'storia' },
  orders: { mobile: 'ordini' },
  findus: { mobile: 'dove-siamo', desktop: 'dove-siamo' },
  contact: { mobile: 'contatti' },
  legal: { mobile: 'note-legali' },
};
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const exists = (path) =>
  stat(path).then(
    () => true,
    () => false,
  );

/** Mockup boards of a site path: the German board when there is one, else the Italian one. */
async function boardsFor(path) {
  if (path === '/404.html') return { mobile: 'mobile-404.html' };
  for (const [key, names] of Object.entries(BOARD_NAMES)) {
    const locale = locales.find((code) => pathFor(key, code) === path);
    if (!locale) continue;
    const boards = {};
    for (const [kind, name] of Object.entries(names)) {
      const localized = `${kind}-${name}-${locale}.html`;
      boards[kind] =
        locale !== 'it' && (await exists(join(BOARDS, localized)))
          ? localized
          : `${kind}-${name}.html`;
    }
    return boards;
  }
  return {};
}

/** "2026-10-13T10:00" read as Rome time (summer or winter offset of that date). */
function romeInstant(local) {
  const guess = new Date(`${local}Z`);
  const rome = new Date(guess.toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const utc = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }));
  return new Date(guess.getTime() - (rome.getTime() - utc.getTime()));
}

/** Full-page screenshot after scrolling through, so that lazy images are loaded. */
async function shoot(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += page.viewportSize().height / 2) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState('networkidle');
  return page.screenshot({ fullPage: true });
}

/** Mockup | site, cut into slices of the same height; magenta where one of the two has ended. */
async function slices(left, right, width, slice, prefix) {
  const [l, r] = await Promise.all([sharp(left).metadata(), sharp(right).metadata()]);
  // Slices of an earlier, longer run would look current: remove them first.
  const name = prefix.slice(OUT.length + 1);
  for (const old of await readdir(OUT)) {
    if (old.startsWith(`${name}-`)) await rm(join(OUT, old));
  }
  const files = [];
  for (let top = 0, i = 0; top < Math.max(l.height, r.height); top += slice, i++) {
    const parts = [];
    for (const [image, meta, x] of [
      [left, l, 0],
      [right, r, width + GAP],
    ]) {
      if (top >= meta.height) continue;
      const height = Math.min(slice, meta.height - top);
      const input = await sharp(image).extract({ left: 0, top, width, height }).toBuffer();
      parts.push({ input, left: x, top: 0 });
    }
    const file = `${prefix}-${String(i).padStart(2, '0')}.png`;
    await sharp({
      create: { width: width * 2 + GAP, height: slice, channels: 3, background: '#ff00ff' },
    })
      .composite(parts)
      .png()
      .toFile(file);
    files.push(file);
  }
  return { mockup: l.height, site: r.height, files };
}

const args = process.argv.slice(2);
const at = args.find((arg) => arg.startsWith('--at='))?.slice(5) ?? '2026-10-13T10:00';
const requested = args.filter((arg) => arg.startsWith('/'));
const paths = requested.length
  ? requested
  : [
      ...Object.keys(BOARD_NAMES).flatMap((key) => locales.map((locale) => pathFor(key, locale))),
      '/404.html',
    ];

const server = createServer(async (req, res) => {
  let file = join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

const slug = (path) => path.replace(/^\/|\/$/g, '').replace(/[/.]/g, '_') || 'home';
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      timezoneId: 'Europe/Rome',
    });
    await context.clock.setFixedTime(romeInstant(at));
    const page = await context.newPage();
    for (const path of paths) {
      const board = (await boardsFor(path))[viewport.board];
      if (!board) {
        if (requested.length) console.log(`${path} ${viewport.name}: no ${viewport.board} board`);
        continue;
      }
      const mockup = await shoot(page, pathToFileURL(resolve(BOARDS, board)).href);
      const site = await shoot(page, origin + path);
      const prefix = join(OUT, `${slug(path)}-${viewport.name}`);
      const result = await slices(mockup, site, viewport.width, viewport.slice, prefix);
      console.log(
        `${path} ${viewport.name} · ${board} ${result.mockup} px · site ${result.site} px · ` +
          `${result.files.length} slices ${prefix}-*.png`,
      );
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
