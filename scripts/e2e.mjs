// Behaviour checks on the built site in dist/ (run `npm run build` first): no console errors,
// NavSheet (open, Esc, ✕, tap outside, focus kept and returned), skip link, fallbacks without
// JavaScript, the Indicazioni link on iOS/iPadOS and elsewhere (DESIGN.md §7, decision 6), focus ring.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  let f = join('dist', decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try {
    if ((await stat(f)).isDirectory()) f = join(f, 'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(f)] ?? 'application/octet-stream' });
    res.end(await readFile(f));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const results = [];
const check = (name, ok, detail = '') =>
  results.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);

// console errors on a few pages
const pages = ['/', '/de/', '/en/find-us/', '/404.html'];
if (await stat('dist/componenti').catch(() => null)) pages.push('/componenti/');
for (const path of pages) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('requestfailed', (r) => errors.push('failed ' + r.url()));
  await page.goto(origin + path, { waitUntil: 'networkidle' });
  check(`no console errors on ${path}`, errors.length === 0, errors.join(' | '));
  await page.close();
}

// NavSheet: open, Esc, focus back; click outside on tablet; skip link first
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(origin + '/storia/');
await page.keyboard.press('Tab');
check(
  'skip link is the first focusable element',
  (await page.evaluate(() => document.activeElement?.className)) === 'dc-skip',
);
await page.click('[data-navsheet-open]');
check(
  'Menu opens the dialog',
  await page.evaluate(() => document.querySelector('[data-navsheet]').open),
);
check('URL unchanged (no jump to #menu)', !page.url().includes('#menu'));
check(
  'focus inside the dialog',
  await page.evaluate(() =>
    document.querySelector('[data-navsheet]').contains(document.activeElement),
  ),
);
await page.keyboard.press('Escape');
check('Esc closes', !(await page.evaluate(() => document.querySelector('[data-navsheet]').open)));
check(
  'focus back on Menu',
  await page.evaluate(() => document.activeElement?.hasAttribute('data-navsheet-open')),
);
await page.click('[data-navsheet-open]');
await page.click('[data-navsheet-close]');
check('✕ closes', !(await page.evaluate(() => document.querySelector('[data-navsheet]').open)));
check(
  'current page marked in sheet',
  (await page.locator('.dc-navsheet__list a[aria-current="page"]').textContent()).trim() ===
    'La storia',
);
await page.setViewportSize({ width: 768, height: 1024 });
await page.click('[data-navsheet-open]');
await page.mouse.click(100, 500);
check(
  'tap outside closes (768 px)',
  !(await page.evaluate(() => document.querySelector('[data-navsheet]').open)),
);
// Tab cycles inside the modal
await page.click('[data-navsheet-open]');
let escaped = false;
for (let i = 0; i < 20; i++) {
  await page.keyboard.press('Tab');
  if (
    !(await page.evaluate(
      () =>
        document.querySelector('[data-navsheet]').contains(document.activeElement) ||
        document.activeElement === document.body,
    ))
  )
    escaped = true;
}
check('Tab stays in the dialog', !escaped);
await page.close();

// Without JS the Menu link goes to #menu
const ctx = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 390, height: 844 },
});
const p2 = await ctx.newPage();
await p2.goto(origin + '/storia/');
await p2.click('[data-navsheet-open]');
check('no JS: Menu goes to #menu', p2.url().endsWith('#menu'));
check('no JS: no today row', (await p2.locator('.dc-hours__today').count()) === 0);
await ctx.close();

// Directions on iOS → Apple Maps
const ios = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  viewport: { width: 390, height: 844 },
});
const p3 = await ios.newPage();
await p3.goto(origin + '/', { waitUntil: 'networkidle' });
const hrefs = await p3.$$eval('a[data-apple-href]', (as) => as.map((a) => a.href));
check(
  'iPhone: Indicazioni → Apple Maps',
  hrefs.length > 0 && hrefs.every((h) => h.startsWith('https://maps.apple.com/')),
  hrefs[0],
);
await ios.close();
const p4 = await browser.newPage();
await p4.goto(origin + '/', { waitUntil: 'networkidle' });
const hrefs2 = await p4.$$eval('a[data-apple-href]', (as) => as.map((a) => a.href));
check(
  'elsewhere: Indicazioni → Google Maps',
  hrefs2.every((h) => h.startsWith('https://www.google.com/maps/')),
);
const ipad = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  hasTouch: true,
  isMobile: false,
});
const p5 = await ipad.newPage();
// A real iPad reports 5 touch points; Playwright's touch emulation reports 1.
await p5.addInitScript(() =>
  Object.defineProperty(Navigator.prototype, 'maxTouchPoints', { get: () => 5 }),
);
await p5.goto(origin + '/', { waitUntil: 'networkidle' });
const hrefs3 = await p5.$$eval('a[data-apple-href]', (as) => as.map((a) => a.href));
check(
  'iPad (reports a Mac with touch): Apple Maps',
  hrefs3.every((h) => h.startsWith('https://maps.apple.com/')),
);
await ipad.close();
// focus ring visible on keyboard focus of a primary button
await p4.setViewportSize({ width: 390, height: 844 });
const ring = await p4.evaluate(() => {
  const a = document.querySelector('.dc-ctabar .dc-btn--primary');
  a.focus({ focusVisible: true });
  const s = getComputedStyle(a);
  return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`;
});
check('focus ring 3px ink on primary', ring.startsWith('solid 3px'), ring);
await browser.close();
server.close();
console.log(results.join('\n'));
if (results.some((line) => line.startsWith('FAIL'))) process.exit(1);
