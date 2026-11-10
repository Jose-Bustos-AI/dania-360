import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const landing = readFileSync(new URL('gestion-redes-sociales-inmobiliarias/index.html', root), 'utf8');
const reel = landing.match(/<aside class="reel-outline"[\s\S]*?<\/aside>/)?.[0];
const textFile = readFileSync(new URL('gestion-redes-sociales-inmobiliarias/guion-reel-inmobiliario-15-segundos.txt', root), 'utf8');

test('tres escenas contiguas suman exactamente los 15 segundos de Growth', () => {
  assert.ok(reel);
  const scenes = [...reel.matchAll(/data-start="(\d+)" data-end="(\d+)"/g)].map(([, start, end]) => [Number(start), Number(end)]);
  assert.deepEqual(scenes, [[0, 5], [5, 10], [10, 15]]);
  assert.equal(scenes.reduce((duration, [start, end]) => duration + end - start, 0), 15);
  for (const label of ['00:00–00:05', '00:05–00:10', '00:10–00:15']) {
    assert.ok(reel.includes(label) && textFile.includes(label));
  }
});
test('la muestra no se presenta como vivienda disponible, campaña o vídeo real', () => {
  assert.match(reel, /no representa una vivienda disponible ni una campaña realizada/);
  assert.match(textFile, /No corresponde a un inmueble disponible/);
  assert.doesNotMatch(reel, /<(?:video|iframe|script)\b/i);
  assert.ok(!landing.includes('VideoObject'));
  assert.ok(!landing.includes('<span>▶</span><small>REEL · 00:15</small>'));
});
test('material, privacidad y disponibilidad están sujetos a comprobación de la agencia', () => {
  for (const item of ['imágenes autorizadas', 'detalles privados', 'confirma disponibilidad', 'no prometen']) {
    assert.ok(reel.includes(item), item);
  }
  assert.match(textFile, /No prometer visitas, ventas, plazos de venta o rentabilidad/);
});
test('muestra y descarga están conectadas con el contenido y la guía', () => {
  assert.match(landing, /href="#guion-reel"/);
  assert.match(reel, /href="\.\/guion-reel-inmobiliario-15-segundos.txt" download/);
  const guide = readFileSync(new URL('recursos/captar-propietarios-inmobiliaria-redes-sociales/index.html', root), 'utf8');
  assert.match(guide, /href="\/gestion-redes-sociales-inmobiliarias\/#guion-reel"/);
  assert.match(reel, /aria-labelledby="reel-outline-title"/);
});
test('los metadatos identifican el servicio y conservan URL y precios', () => {
  assert.match(landing, /<title>Gestión de redes sociales para inmobiliarias \| Dania360<\/title>/);
  assert.match(landing, /<meta name="description" content="Redes sociales para inmobiliarias por 297 €\/mes\. Publicaciones para propietarios y compradores, atención de consultas, web y bot de IA\.">/);
  assert.equal([...landing.matchAll(/<h1\b/gi)].length, 1);
  assert.match(landing, /<link rel="canonical" href="https:\/\/dania360.com\/gestion-redes-sociales-inmobiliarias\/">/);
  const graph = JSON.parse(landing.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.deepEqual(graph.find(node => node['@type'] === 'Service').offers.map(offer => Number(offer.price)), [297, 497]);
  const sitemap = readFileSync(new URL('sitemap.xml', root), 'utf8');
  const landingLastmod = sitemap.match(/<loc>https:\/\/dania360\.com\/gestion-redes-sociales-inmobiliarias\/<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/)[1];
  assert.equal(graph.find(node => node['@type'] === 'WebPage').dateModified, landingLastmod);
});
