// Builds public/fonts/fraunces-600.woff2 and fraunces-700.woff2 from design/fonts/: the two weights
// the site uses, as static instances (design/HANDOFF.md §7.3, DESIGN.md §2 A7). Same Latin character
// set as the source, SOFT pinned at 50 and WONK at its default (1).
// The optical size is fixed per file at the size where each weight is used most on phones, so that
// headings wrap as with the variable font (DESIGN.md §6.2): 600 → opsz 28 (H2, card names, menu),
// 700 → opsz 36 (H1 and the big phone number).
// Run once after changing the source font: `npm run font:subset`.
import { readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import subsetFont from 'subset-font';

const { default: fontverter } = await import('fontverter');
const hb = await import('harfbuzzjs');

const SOURCE = 'design/fonts/fraunces-latin-full-normal.woff2';
const INSTANCES = [
  { weight: 600, opsz: 28 },
  { weight: 700, opsz: 36 },
];

const source = await readFile(SOURCE);
const face = new hb.Face(new hb.Blob(await fontverter.convert(source, 'sfnt')));
const text = String.fromCodePoint(...face.collectUnicodes());

await mkdir('public/fonts', { recursive: true });
// The variable file of the first build, replaced by the two static ones.
await rm('public/fonts/fraunces.woff2', { force: true });
for (const { weight, opsz } of INSTANCES) {
  const target = `public/fonts/fraunces-${weight}.woff2`;
  const output = await subsetFont(source, text, {
    targetFormat: 'woff2',
    variationAxes: { opsz, wght: weight, SOFT: 50, WONK: 1 },
  });
  await writeFile(target, output);
  console.log(
    `${target}: ${(output.length / 1024).toFixed(1)} KB, opsz ${opsz} (source ${(source.length / 1024).toFixed(1)} KB, ${[...text].length} code points)`,
  );
}
