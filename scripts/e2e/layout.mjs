// Long strings and zoom (DESIGN.md §3 principle 6, §10.2, §10.4): on every page in every language,
// at 360, 390, 768, 1024 and 1440 px and with the browser zoomed to 200 % (1280 and 1440 px
// windows), the document never scrolls sideways and no button, chip, anchor, menu entry or
// heading is cut or pushed outside the window; the open menu is checked at phone widths, and the
// fixed CtaBar stays usable and never hides the end of the footer.
// Also lists, without failing, the words split at the end of a line in headings and labels
// («Uferpro-|menade»: the bar is the line break), to review the German compounds.
import { allPaths, localeOf } from '../lib/dist.mjs';

export const WIDTHS = [360, 390, 768, 1024, 1440];
/** Browser zoom 200 %: a 1280 × 800 and a 1440 × 900 window show half as many CSS pixels. */
const ZOOMED = [
  { width: 640, height: 400, label: '1280 px al 200 %' },
  { width: 720, height: 450, label: '1440 px al 200 %' },
];
const BOXES = [
  'h1',
  'h2',
  'h3',
  'button',
  'a',
  '.dc-btn',
  '.dc-chip',
  '.dc-cat',
  '.dc-card__name',
  '.dc-nav a',
  '.dc-navsheet__list a',
  '.dc-footer__nav a',
  '.dc-lang a',
  '.dc-header__brand',
  '.dc-phone',
  '.dc-opennow',
  '.dc-hours',
].join(', ');
const LABELS = [
  'h1',
  'h2',
  'h3',
  '.dc-btn',
  '.dc-chip',
  '.dc-cat',
  '.dc-card__name',
  '.dc-nav a',
  '.dc-navsheet__list a',
  '.dc-footer__nav a',
  '.dc-link',
  '.dc-ctabar__rule',
  '.dc-ctarow__rule',
  '.dc-hours th',
].join(', ');

/** In the page: elements wider than their box or outside the window, and sideways scrolling. */
function overflowProblems({ selector, scope }) {
  const root = scope ? document.querySelector(scope) : document;
  const html = document.documentElement;
  const width = html.clientWidth;
  const problems = [];
  if (!scope && html.scrollWidth > width) {
    problems.push(`scorrimento orizzontale: documento largo ${html.scrollWidth} px su ${width}`);
  }
  const label = (el) =>
    `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} «${el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)}»`;
  for (const el of root.querySelectorAll(selector)) {
    if (el.closest('.dc-sr, [hidden], dialog:not([open])')) continue;
    if (el.matches('.dc-skip') && document.activeElement !== el) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width && !rect.height) continue;
    if (style.display !== 'inline' && el.scrollWidth > el.clientWidth + 1) {
      problems.push(`tagliato: ${label(el)} (${el.scrollWidth} px in ${el.clientWidth})`);
    }
    if (rect.right > width + 0.5 || rect.left < -0.5) {
      problems.push(
        `fuori dalla finestra: ${label(el)} (${Math.round(rect.left)}–${Math.round(rect.right)} su ${width})`,
      );
    }
  }
  return problems;
}

/**
 * In the page, below 1024 px: the fixed CtaBar is whole and inside the window, its buttons are
 * ≥ 44 px and not cut, and scrolled to the end no text of the footer stays under it.
 */
function barProblems() {
  const bar = document.querySelector('.dc-ctabar--fixed');
  if (!bar || getComputedStyle(bar).display === 'none') return [];
  const problems = [];
  const rect = bar.getBoundingClientRect();
  if (rect.top < 0 || rect.bottom > innerHeight + 0.5) problems.push('CtaBar fuori dalla finestra');
  for (const button of bar.querySelectorAll('.dc-btn')) {
    const box = button.getBoundingClientRect();
    if (
      box.height < 44 ||
      box.left < 0 ||
      box.right > innerWidth ||
      button.scrollWidth > button.clientWidth + 1
    ) {
      problems.push(
        `CtaBar: bottone «${button.textContent.trim()}» ${Math.round(box.width)} × ${Math.round(box.height)} px`,
      );
    }
  }
  window.scrollTo(0, document.documentElement.scrollHeight);
  const top = bar.getBoundingClientRect().top;
  const covered = [...document.querySelectorAll('.dc-footer *')].filter((el) => {
    if (![...el.childNodes].some((child) => child.nodeType === 3 && child.data.trim()))
      return false;
    const box = el.getBoundingClientRect();
    return box.height && box.bottom > top + 0.5 && box.top < innerHeight;
  });
  if (covered.length) {
    problems.push(
      `a fine pagina la CtaBar (${Math.round(rect.height)} px) copre «${covered.map((el) => el.textContent.trim().slice(0, 30)).join('», «')}»`,
    );
  }
  window.scrollTo(0, 0);
  return problems;
}

/** In the page: words of headings and labels split across two lines, e.g. «Uferpro-menade». */
function brokenWords(selector) {
  const found = [];
  const range = document.createRange();
  const lineOf = (node, index) => {
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    // A range that starts at a break also reports an empty box at the end of the line before.
    const rect = [...range.getClientRects()].filter((box) => box.width > 0).at(-1);
    return rect ? Math.round(rect.top + rect.height / 2) : undefined;
  };
  for (const el of document.querySelectorAll(selector)) {
    if (el.closest('.dc-sr, [hidden], dialog:not([open])')) continue;
    if (getComputedStyle(el).display === 'none' || !el.getClientRects().length) continue;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      for (const match of node.data.matchAll(/[\p{L}\p{N}­’'-]+/gu)) {
        let shown = '';
        let previous;
        let split = false;
        for (let i = 0; i < match[0].length; i++) {
          const char = match[0][i];
          const line = lineOf(node, match.index + i);
          if (char === '­') continue;
          if (previous !== undefined && line !== undefined && line > previous + 4) {
            // A break right after a real hyphen is the normal place to wrap a compound.
            shown += shown.endsWith('-') ? '|' : '-|';
            split = true;
          }
          shown += char;
          if (line !== undefined) previous = line;
        }
        if (split) found.push({ marked: shown, where: el.tagName.toLowerCase() });
      }
    }
  }
  return found;
}

export async function run({ browser, origin, check, note }) {
  const breaks = new Map();
  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: width < 1024 ? 844 : 900 },
    });
    const page = await context.newPage();
    const problems = [];
    for (const path of allPaths) {
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const problem of await page.evaluate(overflowProblems, { selector: BOXES })) {
        problems.push(`${path} ${problem}`);
      }
      for (const problem of await page.evaluate(barProblems)) problems.push(`${path} ${problem}`);
      for (const item of await page.evaluate(brokenWords, LABELS)) {
        const key = `${localeOf(path)} «${item.marked}»`;
        if (!breaks.has(key)) breaks.set(key, new Set());
        breaks.get(key).add(`${width} ${path}`);
      }
      // The menu, once per language, at the widths where it exists.
      if (width < 1024 && (path === '/' || path === '/en/' || path === '/de/')) {
        await page.click('[data-navsheet-open]');
        for (const problem of await page.evaluate(overflowProblems, {
          selector: BOXES,
          scope: '[data-navsheet]',
        })) {
          problems.push(`${path} menu aperto: ${problem}`);
        }
        await page.keyboard.press('Escape');
      }
    }
    check(
      `nessun testo tagliato né scorrimento orizzontale a ${width} px (25 pagine)`,
      !problems.length,
      problems.join('\n       '),
    );
    await context.close();
  }

  for (const { width, height, label } of ZOOMED) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    const problems = [];
    for (const path of allPaths) {
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const problem of await page.evaluate(overflowProblems, { selector: BOXES })) {
        problems.push(`${path} ${problem}`);
      }
      for (const problem of await page.evaluate(barProblems)) problems.push(`${path} ${problem}`);
    }
    check(
      `zoom 200 % (${label}): nessun testo tagliato, CtaBar usabile (25 pagine)`,
      !problems.length,
      problems.join('\n       '),
    );
    await context.close();
  }

  const lines = [...breaks]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(
      ([word, where]) =>
        `${word}: ${[...where].slice(0, 3).join(', ')}${where.size > 3 ? ` (+${where.size - 3})` : ''}`,
    );
  note(
    `parole spezzate a fine riga in titoli ed etichette (${lines.length}):\n       ${lines.join('\n       ')}`,
  );
}
