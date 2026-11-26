import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const site = 'https://dania360.com';
const joseAuthorId = `${site}/quienes-somos/#jose-antonio-bustos-garcia`;
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(https:\/\/dania360\.com\/[^<]*)<\/loc>/g)]
  .map((match) => match[1]);
const errors = [];
const serverRules = readFileSync(resolve(root, '.htaccess'), 'utf8');
if (!/^\s*AddType\s+(?:text|application)\/javascript\s+\.mjs\s*$/mi.test(serverRules)) {
  errors.push('.htaccess: los módulos .mjs deben servirse con MIME JavaScript, no text/plain');
}
if (!/Header\s+always\s+set\s+X-Content-Type-Options\s+"nosniff"/i.test(serverRules)) {
  errors.push('.htaccess: conservar X-Content-Type-Options nosniff; no desactivar la protección para cargar módulos');
}
const titles = new Map();
const descriptions = new Map();

const homepage = readFileSync(resolve(root, 'index.html'), 'utf8');
const servicePage = readFileSync(resolve(root, 'gestion-redes-sociales/index.html'), 'utf8');
const pricingPage = readFileSync(resolve(root, 'precios-gestion-redes-sociales/index.html'), 'utf8');
const brandCss = readFileSync(resolve(root, 'brand-orange.css'), 'utf8');
const salonPlans = readFileSync(resolve(root, 'landing-src/config/planes.json'), 'utf8');
const restaurantPlans = readFileSync(resolve(root, 'restaurantes-src/src/App.jsx'), 'utf8');
if (/^\s*\.plans \.kicker,/m.test(brandCss)) {
  errors.push('brand-orange.css: el texto blanco de planes no debe aplicarse a secciones claras de otros sectores');
}
if ([salonPlans, restaurantPlans].some((source) => source.includes('Web · Chat inteligente · Google Maps'))) {
  errors.push('las fuentes de los planes presentan Starter como gestión de Google Maps en lugar de kit QR');
}
const homeH1 = homepage.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
  ?.replace(/<br\s*\/?\s*>/gi, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();
// Desde el rediseño de noviembre de 2026 la portada compite por "agencia de marketing con IA" para pymes;
// "gestión de redes sociales para empresas" queda para /gestion-redes-sociales/ y no se repite aquí.
if (!/^Agencia de marketing con IA\b/.test(homeH1 ?? '') || !/redes sociales/i.test(homeH1) || !/pymes/i.test(homeH1)) {
  errors.push('/: el H1 debe presentar la "agencia de marketing con IA" y redes sociales para pymes de forma legible');
}
if (/Gestión de redes sociales para empresas/i.test(homeH1 ?? '')) {
  errors.push('/: el H1 no debe repetir el de /gestion-redes-sociales/');
}
if (!/<h1>Gestión de redes sociales <em>para empresas<\/em><\/h1>/.test(servicePage)) {
  errors.push('/gestion-redes-sociales/: falta el H1 propio de gestión de redes sociales');
}
for (const [page, html] of [['/', homepage], ['/precios-gestion-redes-sociales/', pricingPage]]) {
  if (!html.includes('data-packages-version="2026-11-26"') || !html.includes('Próximamente')) errors.push(`${page}: catálogo de planes incompleto`);
  const data = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(([,json]) => { const value = JSON.parse(json); return value['@graph'] ?? [value]; });
  const offers = data.filter(node => node['@type'] === 'Service').flatMap(node => [node.offers].flat());
  if (JSON.stringify(offers.map(o=>o.price)) !== JSON.stringify(['199','299']) || offers.some(o=>o.priceCurrency !== 'EUR')) {
    errors.push(`${page}: debe ofrecer Starter 199 EUR y Growth 299 EUR, sin Scale disponible`);
  }
}
const heroLead = homepage.match(/<p class="hero-lead">([\s\S]*?)<\/p>/i)?.[1]
  ?.replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim() ?? '';
if (!/Growth.*299\s*€\/mes/i.test(heroLead) || !/atención con IA/i.test(heroLead)) {
  errors.push('/: la presentación debe explicar Growth (atención con IA, 299 €/mes)');
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
  if (html.includes('Web · Chat inteligente · Google Maps')) {
    errors.push(`${pathname}: Starter no debe presentarse como gestión de Google Maps`);
  }
  if (html.includes('Gestión profesional de la presencia digital para empresas y negocios locales.')
      || html.includes('visibilidad digital para negocios que quieren crecer')) {
    errors.push(`${pathname}: queda un texto genérico de pie de página sin beneficio concreto`);
  }
  const title = tagValue(html, /<title>([^<]+)<\/title>/i);
  const description = tagValue(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const canonical = tagValue(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const robots = tagValue(html, /<meta\s+name="robots"\s+content="([^"]+)"/i) ?? '';
  const h1Count = [...html.matchAll(/<h1(?:\s|>)/gi)].length;
  const headingLevels = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));

  if (!/<script\s+src="\/analytics\.js\?v=[^"]+"\s+defer><\/script>/i.test(html)) {
    errors.push(`${pathname}: falta el script de analítica sujeto al consentimiento`);
  }

  if (!title) errors.push(`${pathname}: falta <title>`);
  else if (titles.has(title)) errors.push(`${pathname}: título repetido con ${titles.get(title)}`);
  else titles.set(title, pathname);
  if (!description) errors.push(`${pathname}: falta la meta description`);
  else if (descriptions.has(description)) errors.push(`${pathname}: descripción repetida con ${descriptions.get(description)}`);
  else descriptions.set(description, pathname);
  if (canonical !== address) errors.push(`${pathname}: canonical ${canonical ?? 'ausente'} no coincide con sitemap`);
  if (/noindex/i.test(robots)) errors.push(`${pathname}: noindex en una página del sitemap`);
  if (h1Count !== 1) errors.push(`${pathname}: ${h1Count} encabezados H1`);
  if (headingLevels[0] !== 1 || headingLevels.some((level, index) => index > 0 && level > headingLevels[index - 1] + 1)) {
    errors.push(`${pathname}: jerarquía de encabezados H1–H6 con saltos o sin H1 inicial`);
  }

  for (const [, json] of html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(json);
      const nodes = data['@graph'] ?? [data];
      for (const node of nodes) {
        if (node['@type'] === 'Person' && node.name === 'José Antonio Bustos García'
            && node['@id'] !== joseAuthorId) {
          errors.push(`${pathname}: el identificador del autor no coincide con /quienes-somos/`);
        }
        if (node['@type'] === 'Article' && node.author?.['@id']?.startsWith(`${site}/quienes-somos/#jose-antonio-bustos`)
            && node.author['@id'] !== joseAuthorId) {
          errors.push(`${pathname}: Article.author usa un identificador distinto al de /quienes-somos/`);
        }
      }
    } catch { errors.push(`${pathname}: JSON-LD no válido`); }
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
  console.log(`${urls.length} páginas del sitemap: títulos y descripciones únicos, canonical, jerarquía H1–H6, señales de indexabilidad, JSON-LD y enlaces internos correctos.`);
}
