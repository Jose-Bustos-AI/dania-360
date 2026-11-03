import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildRetailBrief, retailBriefAsText, initRetailBrief } from './ficha-campana.mjs';

const ready = { product: 'Tazas de cerámica', detail: 'Asa ancha y acabado mate.',
  nextStep: 'Pregunta en tienda por los colores disponibles.', stock: 'confirmed',
  priceState: 'omit', price: '', imageConfirmed: true, contactConfirmed: true };

test('borrador completo solo con datos declarados, sin precio inventado', () => {
  const brief = buildRetailBrief(ready);
  assert.deepEqual(brief.pending, []);
  assert.equal(brief.draft, 'Conoce Tazas de cerámica.\nAsa ancha y acabado mate.\nPregunta en tienda por los colores disponibles.');
  assert.doesNotMatch(brief.draft, /€|descuento|últimas|reserva|gratis/);
  assert.match(retailBriefAsText(brief), /REVISIÓN FINAL DEL COMERCIO PENDIENTE/);
});
test('precio confirmado se reproduce con sus condiciones sin calcular ofertas', () => {
  const brief = buildRetailBrief({ ...ready, priceState: 'confirmed', price: '12 € por unidad, IVA incluido' });
  assert.match(brief.draft, /12 € por unidad, IVA incluido/);
  assert.doesNotMatch(brief.draft, /descuento|antes|ahorra/);
});
for (const stock of ['pending', 'unavailable']) {
  test(`stock ${stock} impide generar el texto promocional`, () => {
    const brief = buildRetailBrief({ ...ready, stock });
    assert.equal(brief.draft, null);
    assert.equal(brief.pending.length, 1);
    assert.match(retailBriefAsText(brief), /NO PROGRAMAR/);
    assert.doesNotMatch(retailBriefAsText(brief), /Conoce Tazas/);
  });
}
test('precio pendiente impide el borrador', () => {
  const brief = buildRetailBrief({ ...ready, priceState: 'pending', price: '12 €' });
  assert.equal(brief.draft, null);
  assert.match(brief.pending.join(' '), /Precio pendiente/);
});
test('imagen y contacto sin confirmar se identifican por separado', () => {
  const brief = buildRetailBrief({ ...ready, imageConfirmed: false, contactConfirmed: false });
  assert.equal(brief.pending.length, 2);
  assert.equal(brief.draft, null);
});
test('un string que dice true no sustituye la confirmación booleana', () => {
  assert.equal(buildRetailBrief({ ...ready, imageConfirmed: 'true' }).draft, null);
});
test('precio anunciado y selección de omitir precio no pueden contradecirse', () => {
  assert.throws(() => buildRetailBrief({ ...ready, price: '12 €' }), /Borra el precio/);
  assert.throws(() => buildRetailBrief({ ...ready, priceState: 'confirmed' }), /Escribe el precio/);
});
test('opciones desconocidas y claves de prototipo se rechazan', () => {
  assert.throws(() => buildRetailBrief({ ...ready, stock: '__proto__' }), /disponibilidad/);
  assert.throws(() => buildRetailBrief({ ...ready, priceState: 'constructor' }), /precio/);
});
test('campos vacíos o excesivos no crean fichas aparentemente completas', () => {
  for (const key of ['product', 'detail', 'nextStep']) {
    assert.throws(() => buildRetailBrief({ ...ready, [key]: '   ' }), /caracteres/);
    assert.throws(() => buildRetailBrief({ ...ready, [key]: 'x'.repeat(201) }), /caracteres/);
  }
});
test('normaliza saltos y caracteres de control sin interpretar HTML', () => {
  const brief = buildRetailBrief({ ...ready, product: ' Tazas\n\u0000 azules ' });
  assert.equal(brief.product, 'Tazas azules');
  assert.match(buildRetailBrief({ ...ready, product: '<script>texto</script>' }).draft, /<script>texto<\/script>/);
});
test('inicialización sin formulario no rompe otras páginas', () => {
  assert.doesNotThrow(() => initRetailBrief({ getElementById: () => null }));
});
test('formulario sin JS no envía campos y siempre hay plantilla y texto HTML', () => {
  const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
  assert.match(html, /<form[^>]+id="retail-brief-form"[^>]+hidden/);
  assert.match(html, /href="\.\/plantilla-campana-tienda.txt" download/);
  assert.match(html, /<details class="retail-brief-fallback">[\s\S]*Producto o selección:/);
  assert.match(html, /href="\/gestion-redes-sociales-comercios\/#growth"/);
  const fallback = readFileSync(new URL('./plantilla-campana-tienda.txt', import.meta.url), 'utf8');
  assert.match(fallback, /No añadir datos personales/);
});
test('FAQ schema usa exactamente preguntas y respuestas visibles', () => {
  const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const section = html.match(/<section id="preguntas">([\s\S]*?)<\/section>/)[1];
  const visible = [...section.matchAll(/<article><h3>([^<]+)<\/h3><p>([^<]+)<\/p><\/article>/g)]
    .map(([, name, text]) => ({ name, text }));
  const marked = graph.find(node => node['@type'] === 'FAQPage').mainEntity.map(q => ({ name: q.name, text: q.acceptedAnswer.text }));
  assert.deepEqual(marked, visible);
  const article = graph.find(node => node['@type'] === 'Article');
  for (const property of ['headline', 'image', 'datePublished', 'author']) assert.ok(article[property]);
  assert.match(article.dateModified, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(html.match(/<meta property="article:modified_time" content="([^"]+)"/)[1], article.dateModified);
  const sitemap = readFileSync(new URL('../../sitemap.xml', import.meta.url), 'utf8');
  assert.equal(sitemap.match(/<loc>https:\/\/dania360\.com\/recursos\/atraer-clientes-tienda-redes-sociales\/<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/)[1], article.dateModified);
  const visibleDate = new Date(`${article.dateModified}T00:00:00Z`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  assert.ok(html.includes(`actualizado el ${visibleDate}`), 'fecha visible coherente con Article, Open Graph y sitemap');
});
test('la herramienta no añade red, almacenamiento ni paquetes de terceros', () => {
  const source = readFileSync(new URL('./ficha-campana.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|innerHTML|^import /m);
  assert.ok(Buffer.byteLength(source) < 8000);
  assert.ok(Buffer.byteLength(readFileSync(new URL('./ficha-campana.css', import.meta.url))) < 4000);
});
