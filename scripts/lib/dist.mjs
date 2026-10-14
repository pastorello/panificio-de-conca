// Shared by the Playwright scripts: a static server for dist/ and the list of every page.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { locales, pathFor, routeKeys } from '../../src/routes.ts';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

/** The 25 pages: 8 routes × 3 languages, then the 404. */
export const allPaths = [
  ...routeKeys.flatMap((key) => locales.map((locale) => pathFor(key, locale))),
  '/404.html',
];

/** Language of a site path, from its prefix (the 404 is Italian first). */
export const localeOf = (path) => locales.find((code) => path.startsWith(`/${code}/`)) ?? 'it';

/** Serves a built site on 127.0.0.1; unknown paths get the 404 page with status 404. */
export async function serveDist(dir = 'dist') {
  const server = createServer(async (req, res) => {
    let file = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      res.end(await readFile(join(dir, '404.html')).catch(() => 'Not found'));
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
