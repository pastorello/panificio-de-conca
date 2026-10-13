// Fails if a color, size or spacing is written by hand outside src/styles/tokens.css
// (CLAUDE.md, Stack e convenzioni). Scans CSS files, <style> blocks and style="" in .astro.
// Allowed: var(--…), 0, unitless numbers, %, fr, and the px of @media breakpoints.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = 'src';
const TOKENS = join('src', 'styles', 'tokens.css');
const VALUE =
  /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|color-mix)\(|-?\d*\.?\d+(?:px|rem|em|vh|vw|vmin|vmax|ch|pt|ms|s)\b/gi;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return nested.flat();
}

function cssOf(file, text) {
  if (file.endsWith('.css')) return [text];
  if (!file.endsWith('.astro')) return [];
  const blocks = [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  const inline = [...text.matchAll(/\sstyle="([^"]*)"/g)].map((m) => m[1]);
  return [...blocks, ...inline];
}

const problems = [];
for (const file of await walk(ROOT)) {
  if (file === TOKENS) continue;
  const text = await readFile(file, 'utf8');
  for (const css of cssOf(file, text)) {
    const lines = css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' ')).split('\n');
    lines.forEach((line, index) => {
      if (/^\s*@media\b/.test(line)) return;
      for (const match of line.matchAll(VALUE)) {
        problems.push(`${file}:${index + 1}  ${match[0]}  →  ${line.trim()}`);
      }
    });
  }
}

if (problems.length) {
  console.error('Values written by hand outside src/styles/tokens.css:');
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log('check-tokens: ok');
