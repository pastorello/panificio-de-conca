// Builds public/fonts/fraunces.woff2 from design/fonts/ (DESIGN.md §6.2):
// same Latin character set, opsz 9–144 kept for optical sizing, wght limited to 500–800,
// SOFT pinned at 50 and WONK at its default (1), so the output renders like the mockups.
// Run once after changing the source font: `npm run font:subset`.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import subsetFont from 'subset-font';

const { default: fontverter } = await import('fontverter');
const hb = await import('harfbuzzjs');

const SOURCE = 'design/fonts/fraunces-latin-full-normal.woff2';
const TARGET = 'public/fonts/fraunces.woff2';

const source = await readFile(SOURCE);
const face = new hb.Face(new hb.Blob(await fontverter.convert(source, 'sfnt')));
const text = String.fromCodePoint(...face.collectUnicodes());

const output = await subsetFont(source, text, {
  targetFormat: 'woff2',
  variationAxes: {
    opsz: { min: 9, max: 144 },
    wght: { min: 500, max: 800 },
    SOFT: 50,
    WONK: 1,
  },
});

await mkdir('public/fonts', { recursive: true });
await writeFile(TARGET, output);
console.log(
  `${TARGET}: ${(output.length / 1024).toFixed(1)} KB (source ${(source.length / 1024).toFixed(1)} KB, ${[...text].length} code points)`,
);
