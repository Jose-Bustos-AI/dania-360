import { readFileSync } from 'node:fs';

const paths = [
  'salones-estetica',
  'gestion-redes-sociales-restaurantes',
  'gestion-redes-sociales-gimnasios',
  'gestion-redes-sociales-clinicas-dentales',
  'gestion-redes-sociales-inmobiliarias',
  'gestion-redes-sociales-academias',
  'gestion-redes-sociales-comercios',
  'gestion-redes-sociales-abogados',
  'gestion-redes-sociales-fisioterapia',
  'gestion-redes-sociales-veterinarias',
];
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const home = read('index.html');
const sitemap = read('sitemap.xml');
const descriptions = new Set();
const errors = [];

for (const path of paths) {
  const html = read(`${path}/index.html`);
  const url = `https://dania360.com/${path}/`;
  const meta = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const h1Count = [...html.matchAll(/<h1(?:\s|>)/g)].length;
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  const entities = blocks.flatMap((block) => block['@graph'] ?? [block]);
  const service = entities.find((entity) => entity['@type'] === 'Service');
  const offers = service?.offers ?? service?.hasOfferCatalog?.itemListElement ?? [];
  const prices = offers.map((offer) => Number(offer.price)).sort((a, b) => a - b);

  if (!meta || descriptions.has(meta)) errors.push(`${path}: descripción ausente o repetida`);
  descriptions.add(meta);
  if (canonical !== url) errors.push(`${path}: canonical incorrecto`);
  if (h1Count !== 1) errors.push(`${path}: ${h1Count} encabezados H1`);
  if (/noindex/i.test(html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? '')) {
    errors.push(`${path}: etiqueta noindex`);
  }
  if (prices.join(',') !== '297,497') {
    errors.push(`${path}: el Service debe ofrecer solo Growth y Scale; ofrece ${prices.join(',')}`);
  }
  if (!home.includes(`href="/${path}/"`)) errors.push(`${path}: falta enlace desde la portada`);
  if (!sitemap.includes(`<loc>${url}</loc>`)) errors.push(`${path}: falta en sitemap.xml`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('10/10 landings: descripción única, canonical, H1, indexación, enlaces, sitemap y ofertas coherentes.');
}
