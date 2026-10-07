import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../../recursos/calendario-redes-sociales-gimnasios/planificador.js', import.meta.url), 'utf8');
const { buildGymPlan, planAsCsv, planAsText } = await import(`data:text/javascript,${encodeURIComponent(source)}`);

test('ordena ocho tareas en cuatro semanas desde la fecha indicada', () => {
  const plan = buildGymPlan({ activity: 'Pilates', startsOn: '2026-10-05' });
  assert.equal(plan.length, 8);
  assert.deepEqual(plan.map((task) => task.week), [1, 1, 2, 2, 3, 3, 4, 4]);
  assert.deepEqual(plan.map((task) => task.date), [
    '2026-10-05', '2026-10-08', '2026-10-12', '2026-10-15',
    '2026-10-19', '2026-10-22', '2026-10-26', '2026-10-29'
  ]);
});

test('mantiene los datos facilitados como información pendiente de verificar', () => {
  const plan = buildGymPlan({
    activity: 'Pilates', audience: 'personas adultas principiantes',
    slot: 'martes a las 18:00', bookingUrl: 'https://ejemplo.es/reservar', startsOn: '2026-10-05'
  });
  const text = planAsText(plan);
  assert.match(text, /Pilates/);
  assert.match(text, /personas adultas principiantes/);
  assert.match(text, /Comprueba con recepción.*martes a las 18:00/);
  assert.match(text, /Prueba en móvil que https:\/\/ejemplo.es\/reservar/);
  assert.doesNotMatch(text, /plazas garantizadas|resultados garantizados/i);
});

test('cruza el cambio de año sin desplazar la fecha por la zona horaria', () => {
  const plan = buildGymPlan({ activity: 'Yoga', startsOn: '2026-12-28' });
  assert.equal(plan[0].date, '2026-12-28');
  assert.equal(plan.at(-1).date, '2027-01-21');
});

test('rechaza actividades vacías, fechas inexistentes y enlaces no web', () => {
  assert.throws(() => buildGymPlan({ activity: ' ', startsOn: '2026-10-05' }));
  assert.throws(() => buildGymPlan({ activity: 'Yoga', startsOn: '2026-02-30' }));
  assert.throws(() => buildGymPlan({ activity: 'Yoga', startsOn: '2026-10-05', bookingUrl: 'javascript:alert(1)' }));
});

test('el CSV conserva tildes y neutraliza fórmulas al abrirse en una hoja de cálculo', () => {
  const plan = buildGymPlan({ activity: 'Pilates', startsOn: '2026-10-05' });
  const csv = planAsCsv([{ ...plan[0], question: '=HYPERLINK("https://ejemplo.es")' }]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.match(csv, /"'=HYPERLINK\(""https:\/\/ejemplo.es""\)"/);
  assert.match(csv, /¿Qué actividad ofrece el centro\?|Pilates/);
});
