// Full-page Playwright screenshots of the built site at 390 × 844 and 1440 × 900, in .shots/
// (CLAUDE.md, Comandi). Serves dist/ itself, so run `npm run build` first.
//   npm run shots                     every page in every language
//   npm run shots -- /storia/ /en/    only these paths
//   npm run shots -- --menu /         also the open NavSheet at 390 px
// At 390 px it also saves the first screen only (-screen.png), with the fixed CtaBar in place.
import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';
import { locales, pathFor, routeKeys } from '../src/routes.ts';

const DIST = 'dist';
const OUT = '.shots';
const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '1440', width: 1440, height: 900 },
];
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
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

const args = process.argv.slice(2);
const withMenu = args.includes('--menu');
const requested = args.filter((arg) => arg.startsWith('/'));
const paths = requested.length
  ? requested
  : [...routeKeys.flatMap((key) => locales.map((locale) => pathFor(key, locale))), '/404.html'];

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(DIST, path);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(await readFile(join(DIST, '404.html')).catch(() => 'Not found'));
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
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
    const page = await context.newPage();
    for (const path of paths) {
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const file = join(OUT, `${slug(path)}-${viewport.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
      if (viewport.width < 1024) {
        // What a phone shows before scrolling, with the CtaBar where it really sits.
        const fold = join(OUT, `${slug(path)}-${viewport.name}-screen.png`);
        await page.screenshot({ path: fold });
        console.log(fold);
      }
      if (withMenu && viewport.width < 1024) {
        await page.click('[data-navsheet-open]');
        const menu = join(OUT, `${slug(path)}-${viewport.name}-menu.png`);
        await page.screenshot({ path: menu });
        console.log(menu);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
