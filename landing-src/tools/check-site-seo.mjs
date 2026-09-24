import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const site = 'https://dania360.com';
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(https:\/\/dania360\.com\/[^<]*)<\/loc>/g)]
  .map((match) => match[1]);
const errors = [];
const titles = new Map();
const descriptions = new Map();

const homepage = readFileSync(resolve(root, 'index.html'), 'utf8');
const servicePage = readFileSync(resolve(root, 'gestion-redes-sociales/index.html'), 'utf8');
if (!/<h1>Marketing digital<br\/><em>para tu negocio\.<\/em><\/h1>/.test(homepage)) {
  errors.push('/: la portada debe hablar de marketing digital, no duplicar la intención de la página de servicio');
}
if (!/<h1>Gestión de redes sociales <em>para empresas<\/em><\/h1>/.test(servicePage)) {
  errors.push('/gestion-redes-sociales/: falta el H1 propio de gestión de redes sociales');
}
if (!homepage.includes('la gestión de redes sociales empieza con Growth por <strong>297 €/mes</strong>') &&
    !homepage.includes('la gestión de redes sociales empieza con Growth por <strong>297&nbsp;€/mes</strong>') &&
    !homepage.includes('la gestión de redes sociales empieza con Growth por 297 €/mes')) {
  errors.push('/: debe distinguir Starter de la gestión de redes sociales desde 297 €/mes');
}
if (homepage.includes('<b>+200</b><span>especialistas')) {
  errors.push('/: no mostrar un número de especialistas sin verificación');
}

const localFile = (pathname) => resolve(root, `.${decodeURIComponent(pathname)}`, pathname.endsWith('/') ? 'index.html' : '');
const tagValue = (html, pattern) => html.match(pattern)?.[1]?.trim();

for (const address of urls) {
  const pathname = new URL(address).pathname;
  const file = localFile(pathname);
  if (!existsSync(file)) {
    errors.push(`${pathname}: figura en el sitemap, pero falta index.html`);
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const title = tagValue(html, /<title>([^<]+)<\/title>/i);
  const description = tagValue(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const canonical = tagValue(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const robots = tagValue(html, /<meta\s+name="robots"\s+content="([^"]+)"/i) ?? '';
  const h1Count = [...html.matchAll(/<h1(?:\s|>)/gi)].length;

  if (!title) errors.push(`${pathname}: falta <title>`);
  else if (titles.has(title)) errors.push(`${pathname}: título repetido con ${titles.get(title)}`);
  else titles.set(title, pathname);
  if (!description) errors.push(`${pathname}: falta la meta description`);
  else if (descriptions.has(description)) errors.push(`${pathname}: descripción repetida con ${descriptions.get(description)}`);
  else descriptions.set(description, pathname);
  if (canonical !== address) errors.push(`${pathname}: canonical ${canonical ?? 'ausente'} no coincide con sitemap`);
  if (/noindex/i.test(robots)) errors.push(`${pathname}: noindex en una página del sitemap`);
  if (h1Count !== 1) errors.push(`${pathname}: ${h1Count} encabezados H1`);

  for (const [, json] of html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(json); } catch { errors.push(`${pathname}: JSON-LD no válido`); }
  }

  for (const [, href] of html.matchAll(/\bhref="([^"]+)"/gi)) {
    if (/^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let target;
    try { target = new URL(href, address); } catch { errors.push(`${pathname}: enlace no válido ${href}`); continue; }
    if (target.origin !== site) continue;
    const targetFile = localFile(target.pathname);
    if (!existsSync(targetFile)) errors.push(`${pathname}: enlace interno sin destino ${href}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`${urls.length} páginas del sitemap: títulos y descripciones únicos, canonical, H1, indexación, JSON-LD y enlaces internos correctos.`);
}
