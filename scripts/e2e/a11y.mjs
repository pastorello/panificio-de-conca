// Accessibility, WCAG 2.1 AA (DESIGN.md §3 principle 10, §10.3): axe-core on every page in every
// language at 390 and 1440 px, and in the open menu; then the contrast of the hover and active
// states, which axe does not see. Each link and button is put in that state through the DevTools
// protocol (as scripts/shots.mjs does for the gallery) and its text, and the text inside it, is
// measured against the background it sits on: 4.5:1, or 3:1 for large text (≥ 24 px, or
// ≥ 18.66 px bold).
import AxeBuilder from '@axe-core/playwright';
import { allPaths } from '../lib/dist.mjs';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const MENU_PAGES = ['/', '/en/', '/de/'];

/** Runs on an element (this) in a forced state: its texts below the contrast threshold. */
function lowContrast(state) {
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
  if (this.closest('[hidden], dialog:not([open]), .dc-sr') || !this.getClientRects().length)
    return [];
  const texts = [this, ...this.querySelectorAll('*')].filter((node) =>
    [...node.childNodes].some((child) => child.nodeType === 3 && child.data.trim()),
  );
  const problems = [];
  for (const node of texts) {
    const style = getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden' || node.closest('.dc-sr'))
      continue;
    const size = parseFloat(style.fontSize);
    const bold = Number(style.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const value = ratio(parse(style.color), background(node));
    if (value < (large ? 3 : 4.5)) {
      problems.push(
        `:${state} «${node.textContent.trim().replace(/\s+/g, ' ').slice(0, 30)}» ${style.color} su ${getComputedStyle(node).backgroundColor} = ${value.toFixed(2)}:1 (${size} px${bold ? ' bold' : ''})`,
      );
    }
  }
  return problems;
}

async function stateContrast(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
    nodeId: root.nodeId,
    selector: 'a[href], button',
  });
  const problems = new Set();
  for (const nodeId of nodeIds) {
    const { object } = await cdp.send('DOM.resolveNode', { nodeId });
    for (const state of ['hover', 'active']) {
      await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [state] });
      const { result } = await cdp.send('Runtime.callFunctionOn', {
        objectId: object.objectId,
        functionDeclaration: lowContrast.toString(),
        arguments: [{ value: state }],
        returnByValue: true,
      });
      for (const problem of result.value ?? []) problems.add(problem);
      await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] });
    }
  }
  await cdp.detach();
  return [...problems];
}

const describe = (violation) =>
  `${violation.id} (${violation.impact}): ${violation.nodes
    .slice(0, 3)
    .map((node) => node.target.join(' '))
    .join(', ')} — ${violation.nodes[0]?.failureSummary?.split('\n').slice(1, 2).join('').trim()}`;

export async function run({ browser, origin, check }) {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width < 1024 ? 844 : 900 },
    });
    const page = await context.newPage();
    const violations = [];
    const states = [];
    for (const path of allPaths) {
      await page.goto(origin + path, { waitUntil: 'networkidle' });
      // Colour transitions would be measured halfway.
      await page.addStyleTag({
        content: '*, *::before, *::after { transition: none !important; }',
      });
      const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      violations.push(...result.violations.map((violation) => `${path} ${describe(violation)}`));
      states.push(...(await stateContrast(page)).map((problem) => `${path} ${problem}`));
      if (width < 1024 && MENU_PAGES.includes(path)) {
        await page.click('[data-navsheet-open]');
        const menu = await new AxeBuilder({ page })
          .include('[data-navsheet]')
          .withTags(TAGS)
          .analyze();
        violations.push(
          ...menu.violations.map((violation) => `${path} menu: ${describe(violation)}`),
        );
        states.push(...(await stateContrast(page)).map((problem) => `${path} menu: ${problem}`));
        await page.keyboard.press('Escape');
      }
    }
    const menu = width < 1024 ? ', menu aperto compreso' : '';
    check(
      `axe WCAG 2.1 AA a ${width} px (25 pagine${menu})`,
      !violations.length,
      violations.join('\n       '),
    );
    check(
      `contrasto AA di hover e attivo a ${width} px (25 pagine${menu})`,
      !states.length,
      states.join('\n       '),
    );
    await context.close();
  }
}
