// robots.txt: everything blocked in preview, everything allowed with the sitemap in live.
import type { APIRoute } from 'astro';
import { SITE_PHASE } from 'astro:env/server';

export const GET: APIRoute = ({ site }) => {
  const body =
    SITE_PHASE === 'live'
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
      : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
