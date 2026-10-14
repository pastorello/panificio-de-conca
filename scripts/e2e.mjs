// Checks on the built site in dist/ (run `npm run build` first), in groups:
//   behaviour  no console errors, NavSheet (open, Esc, ✕, tap outside, focus kept and returned), skip
//              link, fallbacks without JavaScript, the Indicazioni link on iOS/iPadOS and elsewhere
//              (DESIGN.md §7, decision 6), focus ring
//   layout     long strings at 360–1440 px and zoom 200 %: no cut labels, no sideways scrolling
//              (scripts/e2e/layout.mjs)
//   a11y       axe WCAG 2.1 AA and contrast of hover/active states (scripts/e2e/a11y.mjs)
//   keyboard   tab order = visual order, visible focus ring, targets ≥ 44 px (scripts/e2e/keyboard.mjs)
//   print      Contatti and Dove siamo printed without the CtaBar (scripts/e2e/print.mjs)
//   npm run test:e2e                     every group
//   npm run test:e2e -- --only=layout,a11y
import { stat } from 'node:fs/promises';
import { chromium } from 'playwright';
import { serveDist } from './lib/dist.mjs';
import * as a11y from './e2e/a11y.mjs';
import * as keyboard from './e2e/keyboard.mjs';
import * as layout from './e2e/layout.mjs';
import * as print from './e2e/print.mjs';

const only = process.argv
  .find((arg) => arg.startsWith('--only='))
  ?.slice(7)
  .split(',');
const { origin, close } = await serveDist();
const browser = await chromium.launch();
const results = [];
const notes = [];
const check = (name, ok, detail = '') =>
  results.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
const note = (text) => notes.push(`note ${text}`);

async function behaviour() {
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
  await p2.goto(origin + '/contatti/');
  check('no JS: no today row', (await p2.locator('.dc-hours__today').count()) === 0);
  await ctx.close();
  const p6 = await browser.newPage();
  await p6.goto(origin + '/contatti/', { waitUntil: 'networkidle' });
  check('today row in the hours table', (await p6.locator('.dc-hours__today').count()) === 1);
  // Category links of Pane e prodotti are anchors to sections of the same page, in every language.
  for (const path of ['/prodotti/', '/en/bread-and-pastries/', '/de/brot-und-gebaeck/']) {
    await p6.goto(origin + path);
    const missing = await p6.$$eval('a.dc-cat', (links) =>
      links.map((a) => a.getAttribute('href')).filter((href) => !document.querySelector(href)),
    );
    check(`category anchors on ${path}`, missing.length === 0, missing.join(' '));
  }
  await p6.close();

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
}

const groups = {
  behaviour,
  layout: layout.run,
  a11y: a11y.run,
  keyboard: keyboard.run,
  print: print.run,
};
try {
  for (const [name, run] of Object.entries(groups)) {
    if (only && !only.includes(name)) continue;
    const start = Date.now();
    await run({ browser, origin, check, note });
    console.log(`· ${name} (${((Date.now() - start) / 1000).toFixed(1)} s)`);
  }
} finally {
  await browser.close();
  await close();
}
console.log(results.join('\n'));
if (notes.length) console.log('\n' + notes.join('\n'));
if (results.some((line) => line.startsWith('FAIL'))) process.exit(1);
