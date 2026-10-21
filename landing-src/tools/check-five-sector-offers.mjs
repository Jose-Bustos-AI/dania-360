import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const sectors = [
  'clinicas-dentales', 'inmobiliarias', 'restaurantes', 'veterinarias', 'comercios',
];
const required = {
  Organization: ['name', 'url'], WebSite: ['name', 'url'],
  WebPage: ['name', 'url'], Service: ['name', 'provider'],
  BreadcrumbList: ['itemListElement'], FAQPage: ['mainEntity'],
};
const decode = (text) => text.replace(/&#x([a-f\d]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ');
const plain = (text) => decode(text.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
const descriptions = new Set();
const summaryTitles = new Set();

for (const sector of sectors) {
  const path = `gestion-redes-sociales-${sector}/`;
  const html = readFileSync(new URL(`${path}index.html`, root), 'utf8');
  const body = html.split('</head>')[1];
  const hero = body.match(/<section\b[^>]*class="[^"]*\bhero\b[^"]*"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, `${path}: hero visible en HTML del servidor`);
  assert.match(plain(hero), /Growth.*297\s*€\/mes/s, `${path}: precio y plan en la presentación`);
  assert.match(plain(hero), /web con bot de IA|web y bot de IA/i, `${path}: web y bot incluidos en la presentación`);
  assert.equal([...html.matchAll(/<h1\b/gi)].length, 1, `${path}: un H1`);
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.match(description ?? '', /297 €\/mes/);
  assert.match(description, /web.*bot de IA/i);
  assert.ok(!/99\s*€/.test(description), `${path}: no mezclar la oferta de web sola en el resumen de Growth`);
  assert.ok(!descriptions.has(description), `${path}: descripción propia`);
  descriptions.add(description);
  for (const tag of ['og:description', 'twitter:description']) {
    const social = html.match(new RegExp(`<meta (?:property|name)="${tag}" content="([^"]+)"`))?.[1];
    assert.equal(social, description, `${path}: ${tag} coherente con la oferta`);
  }
  assert.equal([...body.matchAll(/id="growth"/g)].length, 1, `${path}: un solo resumen Growth`);
  const summary = body.match(/<section class="sector-offer"[\s\S]*?<\/section>/)?.[0] ?? '';
  const title = plain(summary.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? '');
  assert.ok(title && !summaryTitles.has(title), `${path}: encabezado y enfoque propios del sector`);
  summaryTitles.add(title);
  const summaryText = plain(summary);
  for (const included of ['30 al mes', '15 segundos', 'Instagram', 'Facebook', 'TikTok', 'Pinterest', 'bot de IA', 'app DANIA', 'hosting', 'actualización web mensual', 'reseñas']) {
    assert.ok(summaryText.includes(included), `${path}: falta ${included} en el alcance visible`);
  }
  assert.ok(summary.includes('href="#planes"'), `${path}: resumen conectado con los planes`);
  assert.ok(html.includes('href="#growth"'), `${path}: acceso directo desde la presentación`);
  assert.ok(html.includes('/sector-offer.css?v=20261021-1'), `${path}: estilos del resumen`);

  const graph = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => JSON.parse(match[1])['@graph'] ?? []);
  for (const entity of graph) {
    for (const type of [].concat(entity['@type'] ?? [])) {
      for (const property of required[type] ?? []) assert.ok(entity[property], `${path}: ${type}.${property}`);
    }
  }
  const webpage = graph.find((node) => node['@type'] === 'WebPage');
  assert.equal(webpage?.url, `https://dania360.com/${path}`);
  assert.equal(webpage?.description, description);
  assert.match(webpage?.dateModified ?? '', /^\d{4}-\d{2}-\d{2}$/);
  const service = graph.find((node) => node['@type'] === 'Service');
  assert.match(service?.description ?? '', /297 €\/mes/);
  assert.match(service.description, /bot de IA/);
  assert.deepEqual(service.offers.map((offer) => Number(offer.price)), [297, 497], `${path}: precios oficiales, sin cambios`);
  for (const offer of service.offers) {
    assert.equal(offer.priceCurrency, 'EUR');
    assert.equal(new URL(offer.url).pathname, `/${path}`);
  }
  const paragraphs = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((match) => plain(match[1]));
  const faq = graph.find((node) => node['@type'] === 'FAQPage');
  for (const question of faq.mainEntity) {
    assert.ok(plain(body).includes(question.name), `${path}: pregunta visible: ${question.name}`);
    assert.ok(paragraphs.includes(plain(question.acceptedAnswer.text)), `${path}: respuesta visible y JSON-LD coinciden: ${question.name}`);
  }
  console.log(`OK ${path}: oferta Growth, FAQ visible/JSON-LD, metadatos y enlaces del resumen.`);
}

const restaurant = readFileSync(new URL('restaurantes-src/src/App.jsx', root), 'utf8');
assert.ok(!restaurant.includes('ScrollTrigger') && !restaurant.includes('<video'), 'Restaurantes no debe volver a descargar ni fijar el vídeo decorativo al entrar');
console.log('5/5 ofertas revisadas. No es una prueba de posiciones ni de elegibilidad para resultados enriquecidos.');
