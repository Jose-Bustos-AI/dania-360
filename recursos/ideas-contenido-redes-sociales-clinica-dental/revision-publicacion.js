const channels = ['Instagram', 'Facebook', 'TikTok', 'Perfil de Empresa en Google'];
const formats = ['Imagen y texto', 'Carrusel', 'Vídeo breve', 'Historia'];

const controls = [
  {
    key: 'clinical',
    name: 'Información clínica',
    choices: {
      'not-applicable': 'No contiene información clínica',
      verified: 'Revisada por el profesional responsable',
      pending: 'Pendiente de revisión clínica'
    }
  },
  {
    key: 'images',
    name: 'Personas identificables',
    choices: {
      'not-applicable': 'No aparece ninguna persona identificable',
      verified: 'Base y autorización comprobadas para esta publicación',
      pending: 'Pendiente de comprobar permisos'
    }
  },
  {
    key: 'claims',
    name: 'Afirmaciones y promesas',
    choices: {
      'not-applicable': 'No incluye resultados ni promesas clínicas',
      verified: 'Afirmaciones y fuentes revisadas',
      pending: 'Pendiente de revisar afirmaciones'
    }
  },
  {
    key: 'details',
    name: 'Datos de servicio y contacto',
    choices: {
      verified: 'Datos comprobados en web y recepción',
      pending: 'Pendiente de comprobar datos'
    }
  }
];

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

export function buildDentalBrief(fields) {
  const topic = clean(fields.topic);
  const channel = clean(fields.channel);
  const format = clean(fields.format);
  const nextStep = clean(fields.nextStep);

  if (!topic || topic.length > 120) throw new Error('Indica un tema de hasta 120 caracteres, sin datos de pacientes.');
  if (!channels.includes(channel)) throw new Error('Selecciona un canal de publicación.');
  if (!formats.includes(format)) throw new Error('Selecciona un formato.');
  if (!nextStep || nextStep.length > 140) throw new Error('Indica un siguiente paso de hasta 140 caracteres.');

  const checks = controls.map((control) => {
    const state = clean(fields[control.key]);
    if (!Object.hasOwn(control.choices, state)) throw new Error(`Selecciona el estado de «${control.name}».`);
    return { name: control.name, state, explanation: control.choices[state] };
  });

  return {
    topic,
    channel,
    format,
    nextStep,
    checks,
    pending: checks.filter((check) => check.state === 'pending').length
  };
}

export function briefAsText(brief) {
  const status = brief.pending
    ? `${brief.pending} control${brief.pending === 1 ? '' : 'es'} pendiente${brief.pending === 1 ? '' : 's'}: no programar todavía.`
    : 'No se han declarado controles pendientes; falta la aprobación final de la clínica.';
  return [
    'HOJA DE REVISIÓN DE PUBLICACIÓN DENTAL',
    `Tema: ${brief.topic}`,
    `Canal y formato: ${brief.channel} · ${brief.format}`,
    `Siguiente paso: ${brief.nextStep}`,
    '',
    'Controles declarados por la clínica:',
    ...brief.checks.map((check) => `- ${check.name}: ${check.explanation}`),
    '',
    `Estado editorial: ${status}`,
    'No incluir datos de pacientes. Esta hoja no acredita cumplimiento legal ni sustituye la revisión clínica.'
  ].join('\n');
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('dental-brief-form');
  if (form) {
    const result = document.getElementById('dental-brief-result');
    const summary = document.getElementById('dental-brief-summary');
    const text = document.getElementById('dental-brief-text');
    const status = document.getElementById('dental-brief-status');

    const clearResult = () => {
      if (result.hidden) return;
      result.hidden = true;
      status.textContent = 'Los datos han cambiado. Prepara otra hoja antes de compartirla.';
    };
    form.addEventListener('input', clearResult);
    form.addEventListener('change', clearResult);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        const brief = buildDentalBrief(Object.fromEntries(new FormData(form)));
        text.value = briefAsText(brief);
        summary.textContent = brief.pending
          ? `Hay ${brief.pending} control${brief.pending === 1 ? '' : 'es'} pendiente${brief.pending === 1 ? '' : 's'}. No programes la pieza hasta resolverlos.`
          : 'No has declarado controles pendientes. El centro debe dar igualmente su aprobación final.';
        result.hidden = false;
        status.textContent = 'Hoja preparada en este navegador; no se han enviado los datos a Dania360.';
        result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      } catch (error) {
        result.hidden = true;
        status.textContent = error.message;
      }
    });
  }
}
