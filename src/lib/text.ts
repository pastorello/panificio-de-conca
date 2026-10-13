// Rendering of content strings: HTML escaping, {variables} and [[placeholders]].
import { SITE_PHASE } from 'astro:env/server';

const PLACEHOLDER = /\[\[([\s\S]+?)\]\]/g;

export const isPreview = SITE_PHASE === 'preview';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function hasPlaceholder(value: string): boolean {
  return /\[\[[\s\S]+?\]\]/.test(value);
}

/** Replaces {name} with the given values; unknown names are left untouched. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => vars[name] ?? match);
}

/**
 * Escaped HTML for a content string. In preview every [[placeholder]] becomes
 * <mark class="todo">; in live it stays as text and scripts/verify-dist.mjs fails the build.
 */
export function rich(value: string): string {
  const html = escapeHtml(value);
  return isPreview ? html.replace(PLACEHOLDER, '<mark class="todo">[[$1]]</mark>') : html;
}
