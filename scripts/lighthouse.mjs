// Lighthouse mobile on every page of dist/ (CLAUDE.md, Verifiche): 8 pages × 3 languages + 404.
// The same command runs locally and in GitHub Actions; thresholds are in lighthouserc.json.
// Uses Playwright's Chromium (or CHROME_PATH), so local and CI runs use the same browser.
// Run `npm run build` first.
//   npm run lighthouse                    every page
//   npm run lighthouse -- /storia/ /de/   only these paths
//   npm run lighthouse -- --runs=3        three runs per page, the median one is reported and asserted
//   npm run lighthouse -- --site=https://panificio-de-conca.luca-6ad.workers.dev/
//                                         the published site instead of dist/ (DESIGN.md §9.2, Fase 5)
//   npm run lighthouse -- --4g            a 4G network (60 ms, 9 Mbps, CPU ×4) instead of Lighthouse's
//                                         «slow 4G» (150 ms, 1.6 Mbps): the brief's «LCP < 1.5 s on 4G»
//                                         is measured on this profile, where it is an error; on slow 4G
//                                         it is a warning (design/HANDOFF.md §5). Reports and summary
//                                         go to .lighthouseci/reports-4g/ and summary-4g.md
// Prints the four scores, LCP, CLS, TBT and transfer size per page, then the audits that cost points;
// writes .lighthouseci/summary.md (also the job summary in GitHub Actions) and HTML reports in
// .lighthouseci/reports/.
// A preview build has noindex on every page on purpose (CLAUDE.md, Pubblicazione), so the SEO audit
// «is-crawlable» can only fail there: it is skipped and the 95 applies to the other SEO audits.
// noindex and robots.txt are checked in both phases by verify-dist and tests/phases.test.mjs.
// In a live build the audit runs (decided on 14 October 2026).
import { spawnSync } from 'node:child_process';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
import { locales, pathFor, routeKeys } from '../src/routes.ts';

const OUT = '.lighthouseci';
const BASE_CONFIG = 'lighthouserc.json';
/** lighthouserc.json plus the settings of this run (preview, CI). */
const CONFIG = join('node_modules', '.cache', 'lighthouse', 'lighthouserc.json');
const LHCI = join('node_modules', '@lhci', 'cli', 'src', 'cli.js');
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const args = process.argv.slice(2);
const runs = Number(args.find((arg) => arg.startsWith('--runs='))?.slice(7) ?? 1);
const site = args.find((arg) => arg.startsWith('--site='))?.slice(7);
const fast4g = args.includes('--4g');
const requested = args.filter((arg) => arg.startsWith('/'));
// Cloudflare serves the 404 page at /404/ (/404.html redirects there).
const notFound = site ? '/404/' : '/404.html';
const paths = requested.length
  ? requested
  : [...routeKeys.flatMap((key) => locales.map((locale) => pathFor(key, locale))), notFound];

function lhci(command, extra = []) {
  const result = spawnSync(process.execPath, [LHCI, command, `--config=${CONFIG}`, ...extra], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  return result.status ?? 1;
}

const homeHtml = site
  ? await (await fetch(new URL('/', site))).text()
  : await readFile(join('dist', 'index.html'), 'utf8');
const preview = /<meta name="robots" content="noindex/.test(homeHtml);
const config = JSON.parse(await readFile(BASE_CONFIG, 'utf8'));
if (site) delete config.ci.collect.staticDistDir;
const settings = (config.ci.collect.settings ??= {});
if (preview) settings.skipAudits = ['is-crawlable'];
if (fast4g) {
  settings.throttling = { rttMs: 60, throughputKbps: 9000, cpuSlowdownMultiplier: 4 };
  config.ci.assert.assertMatrix[0].assertions['largest-contentful-paint'][0] = 'error';
  config.ci.upload.outputDir = join(OUT, 'reports-4g');
}
// GitHub's Ubuntu runners do not allow Chrome's sandbox (as Playwright does by default).
if (process.env.CI) settings.chromeFlags = '--no-sandbox';
await mkdir(dirname(CONFIG), { recursive: true });
await writeFile(CONFIG, JSON.stringify(config, null, 2));

const chromePath = process.env.CHROME_PATH || chromium.executablePath();
const collectArgs = [
  ...paths.map((path) => `--url=${site ? new URL(path, site).href : path}`),
  `--numberOfRuns=${runs}`,
  `--chromePath=${chromePath}`,
];
if (lhci('collect', collectArgs) !== 0) process.exit(1);
const asserted = lhci('assert');
lhci('upload');

// Summary from the representative (median) run of each page.
const manifest = JSON.parse(
  await readFile(join(config.ci.upload.outputDir, 'manifest.json'), 'utf8'),
);
const rows = [];
const losses = new Map();
for (const entry of manifest.filter((item) => item.isRepresentativeRun)) {
  const lhr = JSON.parse(await readFile(entry.jsonPath, 'utf8'));
  const path = new URL(lhr.finalDisplayedUrl ?? entry.url).pathname;
  const audit = (id) => lhr.audits[id];
  rows.push({
    path,
    scores: CATEGORIES.map((id) => Math.round((lhr.categories[id]?.score ?? 0) * 100)),
    lcp: audit('largest-contentful-paint')?.numericValue ?? NaN,
    cls: audit('cumulative-layout-shift')?.numericValue ?? NaN,
    tbt: audit('total-blocking-time')?.numericValue ?? NaN,
    bytes: audit('total-byte-weight')?.numericValue ?? NaN,
  });
  // Audits that weigh in a category score and are not passed.
  for (const id of CATEGORIES) {
    for (const ref of lhr.categories[id]?.auditRefs ?? []) {
      const result = audit(ref.id);
      if (!ref.weight || result?.score === null || result?.score === undefined) continue;
      if (result.score >= 1) continue;
      const key = `${id} · ${ref.id} — ${result.title}`;
      if (!losses.has(key)) losses.set(key, []);
      losses.get(key).push(`${path} (${result.displayValue || Math.round(result.score * 100)})`);
    }
  }
}
rows.sort((a, b) => paths.indexOf(a.path) - paths.indexOf(b.path));

const seconds = (ms) => (ms / 1000).toFixed(2).replace('.', ',') + ' s';
const kb = (bytes) => Math.round(bytes / 1024) + ' KB';
const lines = [
  `### Lighthouse mobile · ${rows.length} pagine · ${runs} ${runs === 1 ? 'misura' : 'misure (mediana)'}${site ? ` · ${new URL(site).origin}` : ''} · ${fast4g ? '4G (60 ms, 9 Mbps)' : '4G lento (150 ms, 1,6 Mbps)'}`,
  '',
  ...(preview
    ? [
        'Build di anteprima: audit SEO «is-crawlable» saltato (noindex voluto, verificato da verify-dist).',
        '',
      ]
    : []),
  '| Pagina | Prestazioni | Accessibilità | Best practice | SEO | LCP | CLS | TBT | Peso |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...rows.map(
    (row) =>
      `| \`${row.path}\` | ${row.scores.join(' | ')} | ${seconds(row.lcp)} | ` +
      `${row.cls.toFixed(3).replace('.', ',')} | ${Math.round(row.tbt)} ms | ${kb(row.bytes)} |`,
  ),
  '',
];
if (losses.size) {
  lines.push('Audit che tolgono punti:', '');
  for (const [key, where] of [...losses].sort((a, b) => b[1].length - a[1].length)) {
    lines.push(
      `- ${key}: ${where.length} pagine — ${where.slice(0, 4).join(', ')}${where.length > 4 ? ', …' : ''}`,
    );
  }
  lines.push('');
}
lines.push(
  asserted === 0
    ? 'Soglie di lighthouserc.json: rispettate.'
    : 'Soglie di lighthouserc.json: NON rispettate (dettagli sopra).',
);

const summary = lines.join('\n') + '\n';
await writeFile(join(OUT, fast4g ? 'summary-4g.md' : 'summary.md'), summary);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
console.log('\n' + summary);
process.exit(asserted);
