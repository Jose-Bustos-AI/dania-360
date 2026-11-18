#!/usr/bin/env node
/**
 * Avisa a Bing, Yandex y el resto de buscadores de IndexNow de las URL nuevas o cambiadas.
 *
 * Uso (desde la raíz del repositorio, con la web ya publicada):
 *   node landing-src/tools/indexnow.mjs --since 2026-11-18     URL del sitemap con lastmod >= esa fecha
 *   node landing-src/tools/indexnow.mjs --all                  todas las URL del sitemap
 *   node landing-src/tools/indexnow.mjs https://dania360.com/a/ https://dania360.com/b/
 *   Añade --dry-run para ver la lista sin enviarla.
 *
 * La clave es el archivo <32 hex>.txt de la raíz, publicado en https://dania360.com/<clave>.txt.
 * Google no usa IndexNow: para Google sigue valiendo el sitemap y Search Console.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const host = 'dania360.com';
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const keyFile = readdirSync(root).find((name) => /^[0-9a-f]{32}\.txt$/.test(name));
if (!keyFile) throw new Error('No encuentro el archivo de clave <32 hex>.txt en la raíz');
const key = readFileSync(resolve(root, keyFile), 'utf8').trim();
if (`${key}.txt` !== keyFile) throw new Error('El contenido del archivo de clave no coincide con su nombre');

const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map((m) => ({ loc: m[1], lastmod: m[2] }));

let urls;
const sinceIndex = args.indexOf('--since');
if (sinceIndex !== -1) {
  const since = args[sinceIndex + 1];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(since ?? '')) throw new Error('--since necesita una fecha AAAA-MM-DD');
  urls = entries.filter((e) => e.lastmod.slice(0, 10) >= since).map((e) => e.loc);
} else if (args.includes('--all')) {
  urls = entries.map((e) => e.loc);
} else {
  urls = args.filter((a) => a.startsWith('https://'));
}
urls = [...new Set(urls)].filter((u) => new URL(u).host === host);
if (!urls.length) throw new Error('No hay URL que enviar');

console.log(`${urls.length} URL${urls.length === 1 ? '' : 's'}:`);
for (const u of urls) console.log(`  ${u}`);
if (dryRun) process.exit(0);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${keyFile}`, urlList: urls.slice(0, 10000) }),
});
console.log(`IndexNow respondió ${res.status} ${res.statusText}`);
if (![200, 202].includes(res.status)) {
  console.log(await res.text());
  process.exit(1);
}
