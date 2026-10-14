// Keyboard and focus (DESIGN.md §3 principles 3 and 10, §6.5, §10.3–10.4). Tabbing through every
// page in every language at 390 and 1440 px, and through the open menu at 390 px:
//  - every link and button is reached, once, and nothing else;
//  - the order follows the page as seen: never back up within the same column, never leftwards
//    within the same row (the fixed CtaBar, outside the flow, comes last);
//  - each stop shows the focus ring: outline ≥ 2 px, contrast ≥ 3:1 with the background around
//    it, not cut off by a container;
//  - each target is at least 44 × 44 px, except links inside a sentence or wrapping like one
//    (WCAG 2.5.5, «inline»).
import { allPaths } from '../lib/dist.mjs';

const TABBABLE =
  'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

/** In the page: numbers the elements that should receive focus, returns how many. */
function markTabbables(selector) {
  let count = 0;
  for (const el of document.querySelectorAll(selector)) {
    delete el.dataset.e2eStop;
    if (el.closest('[hidden], dialog:not([open]), [inert]')) continue;
    if (el.matches('[disabled]') || el.tabIndex < 0) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    // The skip link is clipped to 1 px until focused, and still the first stop.
    if (!el.getClientRects().length && !el.matches('.dc-skip')) continue;
    // With the menu open only the dialog can take focus.
    const dialog = document.querySelector('dialog[open]');
    if (dialog && !dialog.contains(el)) continue;
    el.dataset.e2eStop = String(count++);
  }
  return count;
}

/** In the page: what the focused element looks like. */
function describeFocus() {
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  const parse = (value) => {
    const parts = value.match(/[\d.]+/g)?.map(Number) ?? [];
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const channel = (value) => {
    const v = value / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const luminance = ({ r, g, b }) =>
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  const ratio = (x, y) => {
    const [light, dark] = [luminance(x), luminance(y)].sort((a, b) => b - a);
    return (light + 0.05) / (dark + 0.05);
  };
  const background = (node) => {
    for (let n = node; n; n = n.parentElement) {
      const color = parse(getComputedStyle(n).backgroundColor);
      if (color.a > 0) return color;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  let fixed = false;
  for (let n = el; n; n = n.parentElement) {
    if (getComputedStyle(n).position === 'fixed') fixed = true;
  }
  const width = style.outlineStyle === 'none' ? 0 : parseFloat(style.outlineWidth);
  const offset = parseFloat(style.outlineOffset) || 0;
  const reach = offset + width;
  const ring = {
    left: rect.left - reach,
    right: rect.right + reach,
    top: rect.top - reach,
    bottom: rect.bottom + reach,
  };
  // The ring is drawn outside the box: compare it with the background of the parent.
  const contrast = width ? ratio(parse(style.outlineColor), background(el.parentElement)) : 0;
  let clippedBy = '';
  for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
    const s = getComputedStyle(n);
    if (s.overflowX === 'visible' && s.overflowY === 'visible') continue;
    const box = n.getBoundingClientRect();
    if (
      ring.left < box.left - 0.5 ||
      ring.right > box.right + 0.5 ||
      ring.top < box.top - 0.5 ||
      ring.bottom > box.bottom + 0.5
    ) {
      clippedBy =
        n.tagName.toLowerCase() + (n.className ? '.' + String(n.className).split(' ')[0] : '');
      break;
    }
  }
  const parent = el.parentElement;
  // In a sentence, or long enough to wrap like running text (the sources of La storia).
  const inline =
    style.display === 'inline' &&
    (parent.textContent.replace(/\s+/g, ' ').trim() !==
      el.textContent.replace(/\s+/g, ' ').trim() ||
      el.getClientRects().length > 1);
  return {
    stop: el.dataset.e2eStop,
    label: `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''} «${(el.textContent.trim() || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').slice(0, 30)}»`,
    x: rect.left + (fixed ? 0 : scrollX),
    y: rect.top + (fixed ? 0 : scrollY),
    w: rect.width,
    h: rect.height,
    fixed,
    ring: { width, contrast: Number(contrast.toFixed(2)) },
    clippedBy,
    inline,
  };
}

/** Is b before a in reading order? Same column and higher up, or same row and further left. */
function backwards(a, b) {
  if (a.fixed !== b.fixed) return false;
  const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (overlapY > Math.min(a.h, b.h) / 2) return b.x + b.w <= a.x + 1;
  return overlapX > 0 && b.y + b.h <= a.y + 1;
}

async function walk(page) {
  const expected = await page.evaluate(markTabbables, TABBABLE);
  // The open menu already has focus inside, and Tab from its last entry passes through the
  // browser before coming back to the first: go round once.
  const dialog = await page.evaluate(() => Boolean(document.querySelector('dialog[open]')));
  const first = dialog ? await page.evaluate(describeFocus) : null;
  const stops = first ? [first] : [];
  for (let i = 0; i < expected + 5; i++) {
    await page.keyboard.press('Tab');
    const focus = await page.evaluate(describeFocus);
    if (!focus && dialog) continue;
    if (!focus || (stops.length && focus.stop === stops[0].stop)) break;
    stops.push(focus);
  }
  const problems = [];
  const seen = new Set(stops.map((stop) => stop.stop));
  if (stops.some((stop) => stop.stop === undefined)) {
    problems.push(
      `fermate inattese: ${stops
        .filter((s) => s.stop === undefined)
        .map((s) => s.label)
        .join(', ')}`,
    );
  }
  if (seen.size !== expected) {
    const missing = await page.evaluate(
      (seen) =>
        [...document.querySelectorAll('[data-e2e-stop]')]
          .filter((el) => !seen.includes(el.dataset.e2eStop))
          .map((el) => `${el.tagName.toLowerCase()} «${el.textContent.trim().slice(0, 30)}»`),
      [...seen],
    );
    problems.push(`raggiunti ${seen.size} su ${expected}; mancano: ${missing.join(', ')}`);
  }
  stops.forEach((stop, i) => {
    if (i && backwards(stops[i - 1], stop)) {
      problems.push(`ordine: ${stops[i - 1].label} → ${stop.label} torna indietro`);
    }
    if (stop.ring.width < 2 || stop.ring.contrast < 3) {
      problems.push(
        `anello di focus: ${stop.label} ${stop.ring.width} px, ${stop.ring.contrast}:1`,
      );
    }
    if (stop.clippedBy)
      problems.push(`anello di focus tagliato da ${stop.clippedBy}: ${stop.label}`);
    if (!stop.inline && (stop.w < 43.5 || stop.h < 43.5)) {
      problems.push(`bersaglio ${Math.round(stop.w)} × ${Math.round(stop.h)} px: ${stop.label}`);
    }
  });
  return problems;
}

export async function run({ browser, origin, check }) {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width < 1024 ? 844 : 900 },
    });
    const page = await context.newPage();
    const problems = [];
    for (const path of allPaths) {
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      problems.push(...(await walk(page)).map((problem) => `${path} ${problem}`));
      if (width < 1024 && ['/', '/en/', '/de/'].includes(path)) {
        // Opened from the keyboard, as a keyboard user would: the first focus then shows its ring.
        await page.focus('[data-navsheet-open]');
        await page.keyboard.press('Enter');
        problems.push(...(await walk(page)).map((problem) => `${path} menu: ${problem}`));
        await page.keyboard.press('Escape');
      }
    }
    const menu = width < 1024 ? ', menu aperto compreso' : '';
    check(
      `tastiera a ${width} px: tutti raggiunti, ordine visivo, anello visibile, bersagli ≥ 44 px (25 pagine${menu})`,
      !problems.length,
      problems.join('\n       '),
    );
    await context.close();
  }
}
