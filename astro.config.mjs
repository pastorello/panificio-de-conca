// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { sitemapLinks } from './src/routes.ts';

// Build variables from the environment (Cloudflare) or from a local .env file.
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };
const phase = env.SITE_PHASE || 'preview';
if (phase !== 'preview' && phase !== 'live') {
  throw new Error(`SITE_PHASE must be "preview" or "live", got "${phase}"`);
}
if (phase === 'live' && !env.SITE_URL) {
  throw new Error('SITE_URL is required when SITE_PHASE=live');
}
const site = env.SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en', 'de'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  env: {
    schema: {
      SITE_PHASE: envField.enum({
        context: 'server',
        access: 'public',
        values: ['preview', 'live'],
        default: 'preview',
      }),
      // Builds /componenti/, the gallery of components and states used for the screenshots.
      SITE_GALLERY: envField.boolean({ context: 'server', access: 'public', default: false }),
    },
  },
  // No sitemap in preview (CLAUDE.md, Pubblicazione). Alternates come from routes.ts,
  // not from the integration's i18n option (BRIEF.md §3).
  integrations:
    phase === 'live'
      ? [
          sitemap({
            filter: (page) => !page.endsWith('/404/'),
            serialize: (item) => ({ ...item, links: sitemapLinks(item.url, site) }),
          }),
        ]
      : [],
  // Scripts as files, never inline: the Content-Security-Policy in public/_headers allows only 'self'.
  vite: { build: { assetsInlineLimit: 0 } },
  devToolbar: { enabled: false },
});
