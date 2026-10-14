// Print (DESIGN.md §5.1 CtaBar, §10.4): Contatti and Dove siamo in the three languages print
// without the CtaBar and the menu, without the space kept for the bar, and every text, links
// included, stays legible on white paper (browsers do not print backgrounds by default).
// The PDFs go to .shots/print/ for a look.
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { locales, pathFor } from '../../src/routes.ts';

const OUT = join('.shots', 'print');

/** In the page, printed: what should be gone, and texts too light for white paper. */
function printState() {
  const parse = (value) => value.match(/[\d.]+/g)?.map(Number) ?? [];
  const channel = (value) => {
    const v = value / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  const shown = (el) => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
  // Backgrounds are printed only where print-color-adjust asks for it; elsewhere the paper is white.
  const paper = (node) => {
    for (let n = node; n; n = n.parentElement) {
      const style = getComputedStyle(n);
      const color = parse(style.backgroundColor);
      if (style.printColorAdjust === 'exact' && (color[3] ?? 1) > 0) return color;
    }
    return [255, 255, 255];
  };
  const light = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (!shown(el) || el.closest('.dc-sr, .dc-skip, dialog')) continue;
    if (![...el.childNodes].some((child) => child.nodeType === 3 && child.data.trim())) continue;
    const [text, back] = [luminance(parse(getComputedStyle(el).color)), luminance(paper(el))];
    const ratio = (Math.max(text, back) + 0.05) / (Math.min(text, back) + 0.05);
    if (ratio < 4.5) light.push(`«${el.textContent.trim().slice(0, 30)}» ${ratio.toFixed(2)}:1`);
  }
  return {
    ctabar: [...document.querySelectorAll('.dc-ctabar')].filter(shown).length,
    menu: shown(document.querySelector('[data-navsheet]')),
    padding: parseFloat(getComputedStyle(document.body).paddingBottom),
    light,
  };
}

/** Printable width of an A4 sheet with the default margins, upright and sideways, in CSS px. */
const SHEETS = [
  { name: 'A4', width: 718, landscape: false },
  { name: 'A4 orizzontale', width: 1047, landscape: true },
];

export async function run({ browser, origin, check }) {
  await mkdir(OUT, { recursive: true });
  const page = await browser.newPage();
  const problems = [];
  for (const key of ['contact', 'findus']) {
    for (const locale of locales) {
      const path = pathFor(key, locale);
      for (const sheet of SHEETS) {
        await page.emulateMedia({ media: 'screen' });
        await page.setViewportSize({ width: sheet.width, height: 900 });
        await page.goto(origin + path, { waitUntil: 'networkidle' });
        await page.emulateMedia({ media: 'print' });
        const state = await page.evaluate(printState);
        const where = `${path} (${sheet.name})`;
        if (state.ctabar) problems.push(`${where}: CtaBar stampata`);
        if (state.menu) problems.push(`${where}: menu stampato`);
        if (state.padding)
          problems.push(`${where}: ${state.padding} px vuoti in fondo per la barra`);
        if (state.light.length)
          problems.push(`${where}: testo chiaro su carta bianca ${state.light.join(', ')}`);
        const suffix = sheet.landscape ? '-landscape' : '';
        await page.pdf({
          path: join(OUT, `${key}-${locale}${suffix}.pdf`),
          format: 'A4',
          landscape: sheet.landscape,
          printBackground: false,
        });
      }
    }
  }
  check(
    'stampa di Contatti e Dove siamo senza CtaBar, testi leggibili (6 pagine, A4 verticale e orizzontale, PDF in .shots/print/)',
    !problems.length,
    problems.join('\n       '),
  );
  await page.close();
}
