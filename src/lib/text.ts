// Rendering of content strings: HTML escaping, {variables}, **bold**, phone links and
// [[placeholders]].
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

export interface RichOptions {
  /** Phone numbers as written in the copy ("0771 460651") that become tel: links. */
  tel?: { numbers: string[]; href: string };
}

/**
 * Escaped HTML for a content string. **bold** becomes <strong> (the brief marks the order rule
 * this way); the shop's phone number becomes a tel: link; in preview every [[placeholder]]
 * becomes <mark class="todo">, in live it stays as text and scripts/verify-dist.mjs fails the build.
 */
export function rich(value: string, options: RichOptions = {}): string {
  let html = escapeHtml(value).replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
  const { tel } = options;
  if (tel?.numbers.length) {
    const numbers = [...tel.numbers]
      .sort((a, b) => b.length - a.length)
      .map((number) => escapeHtml(number).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    html = html.replace(
      new RegExp(`(${numbers.join('|')})`, 'g'),
      `<a href="${escapeHtml(tel.href)}">$1</a>`,
    );
  }
  return isPreview ? html.replace(PLACEHOLDER, '<mark class="todo">[[$1]]</mark>') : html;
}
