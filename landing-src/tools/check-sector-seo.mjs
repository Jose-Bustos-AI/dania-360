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
const services = read('gestion-redes-sociales/index.html');
const resources = read('recursos/index.html');
const descriptions = new Set();
const errors = [];

for (const path of paths) {
  const html = read(`${path}/index.html`);
  const url = `https://dania360.com/${path}/`;
  const meta = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
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
  if (!meta?.includes('297 €')) errors.push(`${path}: la descripción debe indicar que las redes empiezan en 297 €`);
  if (title && /redes sociales.*desde 99/i.test(title)) errors.push(`${path}: el título atribuye redes sociales al precio de Starter`);
  if (canonical !== url) errors.push(`${path}: canonical incorrecto`);
  if (h1Count !== 1) errors.push(`${path}: ${h1Count} encabezados H1`);
  if (/noindex/i.test(html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? '')) {
    errors.push(`${path}: etiqueta noindex`);
  }
  if (prices.join(',') !== '297,497') {
    errors.push(`${path}: el Service debe ofrecer solo Growth y Scale; ofrece ${prices.join(',')}`);
  }
  if (/publicaciones semanales (?:en|y)|publicación semanal en Google Business Profile|incrementa la frecuencia y añade posicionamiento SEO/i.test(html)) {
    errors.push(`${path}: la FAQ afirma una frecuencia de publicaciones en Google no incluida en los planes oficiales`);
  }
  if (['gestion-redes-sociales-clinicas-dentales', 'gestion-redes-sociales-academias', 'gestion-redes-sociales-abogados', 'gestion-redes-sociales-veterinarias'].includes(path)) {
    const faq = entities.find((entity) => entity['@type'] === 'FAQPage');
    const priceAnswer = faq?.mainEntity?.find((entry) => entry.name?.startsWith('¿Cuánto cuesta la gestión de redes sociales'))?.acceptedAnswer?.text;
    if (!priceAnswer?.includes('Growth por 297 €') || !priceAnswer.includes('pero no gestión de redes sociales')) {
      errors.push(`${path}: la FAQ debe distinguir Starter de los planes de gestión de redes`);
    }
    if (priceAnswer && !html.includes(`<p>${priceAnswer}</p>`)) {
      errors.push(`${path}: la respuesta de precio en FAQPage no coincide con la respuesta visible`);
    }
  }
  if (!home.includes(`href="/${path}/"`)) errors.push(`${path}: falta enlace desde la portada`);
  if (!resources.includes(`href="/${path}/"`)) errors.push(`${path}: falta enlace desde recursos`);
  if (!sitemap.includes(`<loc>${url}</loc>`)) errors.push(`${path}: falta en sitemap.xml`);
}

if (!services.includes('Gestión de redes sociales para peluquerías →')) {
  errors.push('gestion-redes-sociales: el enlace a salones no nombra peluquerías');
}

for (const path of ['precios-gestion-redes-sociales', 'gestion-redes-sociales-murcia']) {
  const html = read(`${path}/index.html`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const meta = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!title?.includes('desde 297 €')) errors.push(`${path}: título con precio inicial de redes incorrecto`);
  if (!meta?.includes('297 €/mes') || !meta.includes('99 €')) {
    errors.push(`${path}: la descripción debe distinguir redes desde 297 € de Starter 99 €`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('10/10 landings: descripción única, canonical, H1, indexación, enlaces, sitemap y precios coherentes.');
}
