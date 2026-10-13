// Full-page Playwright screenshots of the built site at 390 × 844 and 1440 × 900, in .shots/
// (CLAUDE.md, Comandi). Serves dist/ itself, so run `npm run build` first.
//   npm run shots                     every page in every language
//   npm run shots -- /storia/ /en/    only these paths
//   npm run shots -- --menu /         also the open NavSheet at 390 px
//   npm run shots -- /componenti/     the component gallery (build with SITE_GALLERY=true)
//   npm run shots -- --nojs /         with JavaScript disabled, to check the fallbacks (-nojs.png)
// Elements with data-force="hover|focus-visible|active" get that pseudo-class forced through the
// Chrome DevTools Protocol, so the gallery shows the real :hover, :focus-visible and :active.
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
const noJs = args.includes('--nojs');
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

/**
 * Scrolls through the page so that loading="lazy" images are in the full-page screenshot.
 * Waits from Node: with JavaScript disabled, timers inside the page never fire.
 */
async function loadLazyImages(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = page.viewportSize().height / 2;
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(100);
}

async function forceStates(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
    nodeId: root.nodeId,
    selector: '[data-force]',
  });
  for (const nodeId of nodeIds) {
    const { attributes } = await cdp.send('DOM.getAttributes', { nodeId });
    const state = attributes[attributes.indexOf('data-force') + 1];
    const forced = state === 'focus-visible' ? ['focus', 'focus-visible'] : [state];
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: forced });
  }
  return cdp;
}

const slug = (path) => path.replace(/^\/|\/$/g, '').replace(/[/.]/g, '_') || 'home';
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      timezoneId: 'Europe/Rome',
      javaScriptEnabled: !noJs,
    });
    const page = await context.newPage();
    for (const path of paths) {
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      if (!noJs) await page.evaluate(() => document.fonts.ready);
      await loadLazyImages(page);
      await forceStates(page);
      const suffix = noJs ? '-nojs' : '';
      const file = join(OUT, `${slug(path)}-${viewport.name}${suffix}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
      if (viewport.width < 1024) {
        // What a phone shows before scrolling, with the CtaBar where it really sits.
        const fold = join(OUT, `${slug(path)}-${viewport.name}${suffix}-screen.png`);
        await page.screenshot({ path: fold });
        console.log(fold);
      }
      if (withMenu && !noJs && viewport.width < 1024) {
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
