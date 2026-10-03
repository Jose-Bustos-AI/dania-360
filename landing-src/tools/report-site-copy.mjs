import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));

function clean(value = '') {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

for (const url of urls) {
  const pathname = url.pathname;
  const html = readFileSync(resolve(root, pathname.slice(1), 'index.html'), 'utf8');
  const title = clean(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
  const description = clean(html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]);
  const headings = [...html.matchAll(/<h([123])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => `${match[1]} ${clean(match[2])}`);
  process.stdout.write(`${pathname}\n  title: ${title}\n  meta: ${description}\n  ${headings.join('\n  ')}\n\n`);
}
