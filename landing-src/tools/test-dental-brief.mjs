import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDentalBrief, briefAsText } from '../../recursos/ideas-contenido-redes-sociales-clinica-dental/revision-publicacion.js';

const complete = {
  topic: 'Primera cita de la clínica',
  channel: 'Instagram',
  format: 'Carrusel',
  nextStep: 'Llamar a recepción por el número publicado',
  clinical: 'not-applicable',
  images: 'not-applicable',
  claims: 'not-applicable',
  details: 'verified'
};

test('prepara una hoja sin declarar aprobación legal o clínica automática', () => {
  const brief = buildDentalBrief(complete);
  assert.equal(brief.pending, 0);
  assert.match(briefAsText(brief), /aprobación final de la clínica/);
  assert.match(briefAsText(brief), /no acredita cumplimiento legal/i);
});

test('destaca los controles pendientes y bloquea la programación en el texto', () => {
  const brief = buildDentalBrief({ ...complete, clinical: 'pending', images: 'pending' });
  assert.equal(brief.pending, 2);
  assert.match(briefAsText(brief), /2 controles pendientes: no programar todavía/);
});

test('no acepta valores de canal o control ajenos al formulario', () => {
  assert.throws(() => buildDentalBrief({ ...complete, channel: 'Canal desconocido' }), /canal/);
  assert.throws(() => buildDentalBrief({ ...complete, images: 'approved-by-ai' }), /Personas identificables/);
});

test('requiere tema y siguiente paso breves', () => {
  assert.throws(() => buildDentalBrief({ ...complete, topic: ' ' }), /tema/);
  assert.throws(() => buildDentalBrief({ ...complete, nextStep: 'x'.repeat(141) }), /siguiente paso/);
});

test('el HTML incluye la herramienta y no un formulario que envíe datos a un servidor', () => {
  const html = readFileSync(new URL('../../recursos/ideas-contenido-redes-sociales-clinica-dental/index.html', import.meta.url), 'utf8');
  assert.match(html, /id="dental-brief-form"/);
  assert.match(html, /id="dental-brief-result"[^>]*hidden/);
  assert.match(html, /revision-publicacion\.js/);
  assert.doesNotMatch(html.match(/<form id="dental-brief-form"[^>]*>/)?.[0] ?? '', /\baction=|\bmethod=/);
});
