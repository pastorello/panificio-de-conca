// The two publication phases (CLAUDE.md, Pubblicazione; DESIGN.md §9.3) on real builds: the same
// `astro build` + scripts/verify-dist.mjs that `npm run build` runs, into node_modules/.cache/phases/.
//  - preview: the build passes, every page has noindex, robots.txt blocks everything, no sitemap;
//  - live with today's content: the build fails, and only because of the [[placeholders]] and the
//    to-do list of business.json — noindex is gone, robots.txt is open, the sitemap is there with
//    the alternates of routes.ts, hreflang and JSON-LD pass.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { before, describe, it } from 'node:test';
import { locales, pathFor, routeKeys } from '../src/routes.ts';

const OUT = join('node_modules', '.cache', 'phases');
const SITE = 'https://panificiodeconca.it';

/** Builds one phase; returns the output folder and what verify-dist said. */
async function build(phase) {
  const dir = join(OUT, phase);
  await rm(dir, { recursive: true, force: true });
  const env = { ...process.env, SITE_PHASE: phase, SITE_URL: SITE, DIST_DIR: dir };
  delete env.SITE_GALLERY;
  const astro = spawnSync(
    process.execPath,
    ['node_modules/astro/astro.js', 'build', '--outDir', dir],
    { env, encoding: 'utf8' },
  );
  assert.equal(astro.status, 0, `astro build (${phase}) failed:\n${astro.stderr}`);
  const verify = spawnSync(process.execPath, ['scripts/verify-dist.mjs'], {
    env,
    encoding: 'utf8',
  });
  const errors = verify.stderr
    .split('\n')
    .filter((line) => line.startsWith('error '))
    .map((line) => line.replace(/^error\s+/, ''));
  return { dir, status: verify.status, errors };
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { recursive: true });
  return entries.filter((file) => file.endsWith('.html')).map((file) => join(dir, file));
}

const robotsMeta = (html) => html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';

describe('SITE_PHASE=preview', () => {
  let result;
  before(async () => {
    result = await build('preview');
  });

  it('passes verify-dist', () => {
    assert.equal(result.status, 0, result.errors.join('\n'));
  });

  it('has noindex, nofollow on every page', async () => {
    const files = await htmlFiles(result.dir);
    assert.equal(files.length, 25);
    for (const file of files) {
      assert.equal(robotsMeta(await readFile(file, 'utf8')), 'noindex, nofollow', file);
    }
  });

  it('blocks everything in robots.txt and has no sitemap', async () => {
    const robots = await readFile(join(result.dir, 'robots.txt'), 'utf8');
    assert.match(robots, /^Disallow: \/$/m);
    const files = await readdir(result.dir);
    assert.ok(!files.some((file) => file.startsWith('sitemap')), files.join(', '));
  });
});

describe('SITE_PHASE=live with the placeholders of today', () => {
  let result;
  before(async () => {
    result = await build('live');
  });

  it('fails the build', () => {
    assert.notEqual(result.status, 0);
    assert.ok(result.errors.some((error) => error.endsWith('contains [[')));
  });

  it('fails only because of placeholders and the to-do list of business.json', () => {
    const others = result.errors.filter(
      (error) =>
        !error.endsWith('contains [[') &&
        !error.startsWith('business.json: to do:') &&
        !/JSON-LD: sameAs \[\[.*\]\] is not a URL$/.test(error),
    );
    assert.deepEqual(others, []);
  });

  it('has no noindex on the pages, only on the 404', async () => {
    for (const file of await htmlFiles(result.dir)) {
      const robots = robotsMeta(await readFile(file, 'utf8'));
      if (file.endsWith('404.html')) continue;
      assert.equal(robots, '', file);
    }
  });

  it('opens robots.txt and lists every page in the sitemap with its alternates', async () => {
    const robots = await readFile(join(result.dir, 'robots.txt'), 'utf8');
    assert.doesNotMatch(robots, /^Disallow: \/$/m);
    assert.match(robots, new RegExp(`^Sitemap: ${SITE}/sitemap-index.xml$`, 'm'));
    const sitemap = await readFile(join(result.dir, 'sitemap-0.xml'), 'utf8');
    for (const key of routeKeys) {
      for (const locale of locales) {
        const url = new URL(pathFor(key, locale), SITE).href;
        const entry = sitemap.match(new RegExp(`<url><loc>${url}</loc>(.*?)</url>`))?.[1];
        assert.ok(entry, `${url} missing from the sitemap`);
        for (const code of [...locales, 'x-default']) {
          assert.match(entry, new RegExp(`hreflang="${code}"`), `${url} has no ${code} alternate`);
        }
      }
    }
    assert.doesNotMatch(sitemap, /404/);
  });
});
