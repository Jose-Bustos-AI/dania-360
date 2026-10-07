import test from 'node:test';
import assert from 'node:assert/strict';
import { buildVetReplies, repliesAsText } from './protocolo.mjs';

const valid = {
  clinic: 'Clínica Ejemplo',
  appointments: 'canal de citas confirmado',
  urgent: 'canal de urgencias confirmado'
};

test('genera tres respuestas diferenciadas y no hace diagnósticos', () => {
  const replies = buildVetReplies(valid);
  assert.equal(replies.length, 3);
  assert.match(replies[0].draft, /canal de citas confirmado/);
  assert.match(replies[1].draft, /servicios prestamos/);
  assert.match(replies[2].draft, /canal de urgencias confirmado/);
  assert.match(replies[2].draft, /no permite valorar síntomas/);
  assert.doesNotMatch(repliesAsText(replies), /te recomendamos un tratamiento/i);
});

test('no prepara un borrador de urgencias sin canal confirmado', () => {
  assert.throws(() => buildVetReplies({ ...valid, urgent: '   ' }), /canal para posibles urgencias/);
});

test('rechaza campos incompletos o demasiado largos', () => {
  assert.throws(() => buildVetReplies({ ...valid, appointments: '' }), /canal de citas y servicios/);
  assert.throws(() => buildVetReplies({ ...valid, clinic: 'x'.repeat(81) }), /demasiado largo/);
});

test('normaliza espacios para evitar saltos dentro de las plantillas', () => {
  const replies = buildVetReplies({ ...valid, clinic: ' Clínica\n Ejemplo ' });
  assert.match(replies[0].draft, /Clínica Ejemplo/);
  assert.doesNotMatch(replies[0].draft, /Clínica\n/);
});
