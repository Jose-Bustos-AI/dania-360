const tasks = [
  {
    offset: 0, week: 1, stage: 'Conocer', question: '¿Qué actividad ofrece el centro?',
    piece: (activity) => `Muestra un fragmento real de ${activity} y explica dónde se realiza. Comprueba que las imágenes tienen permiso.`,
    next: 'Enlaza la ficha de la actividad con ubicación y datos actualizados.'
  },
  {
    offset: 3, week: 1, stage: 'Conocer', question: '¿Quién dirige la actividad?',
    piece: () => 'Presenta al profesional que la dirige y pídele que explique qué sucede en una sesión, sin prometer resultados físicos.',
    next: 'Indica cómo consultar dudas antes de la primera visita.'
  },
  {
    offset: 7, week: 2, stage: 'Encajar', question: '¿Es adecuada para mí?',
    piece: (activity, audience) => audience
      ? `Explica para quién está confirmada ${activity}: ${audience}. Aclara nivel y requisitos con el equipo.`
      : `Pregunta al equipo a quién va dirigida ${activity}; publica nivel y requisitos solo después de confirmarlos.`,
    next: 'Deriva las dudas individuales al personal del centro.'
  },
  {
    offset: 10, week: 2, stage: 'Encajar', question: '¿Cómo es el ambiente?',
    piece: () => 'Enseña espacios, material y recepción. Si aparecen personas identificables, comprueba su autorización.',
    next: 'Lleva a las condiciones reales de la primera visita.'
  },
  {
    offset: 14, week: 3, stage: 'Prepararse', question: '¿Cuándo se imparte?',
    piece: (activity, audience, slot) => slot
      ? `Comprueba con recepción que el horario de ${activity} sigue siendo ${slot}; solo entonces prepara una pieza con ese dato.`
      : `Confirma día, hora, duración y posibles cambios de ${activity} antes de preparar una pieza de horarios.`,
    next: 'Compara el horario con la web, Google y el canal de reservas.'
  },
  {
    offset: 17, week: 3, stage: 'Prepararse', question: '¿Qué llevo y cómo llego?',
    piece: () => 'Prepara una ficha breve con acceso, material, vestuarios y tiempo de llegada; valida cada dato con el centro.',
    next: 'Enlaza la ubicación y explica a quién preguntar al llegar.'
  },
  {
    offset: 21, week: 4, stage: 'Reservar', question: '¿Cómo solicito la primera visita?',
    piece: () => 'Explica el proceso de reserva y las condiciones vigentes; no anuncies plazas o descuentos sin confirmar.',
    next: (bookingUrl) => bookingUrl
      ? `Prueba en móvil que ${bookingUrl} abre la reserva correcta y que alguien atiende la solicitud.`
      : 'Añade el enlace real de reserva o un canal de contacto atendido después de comprobarlo.'
  },
  {
    offset: 24, week: 4, stage: 'Decidir', question: '¿Qué pasa después de la visita?',
    piece: () => 'Aclara cómo consultar horarios, modalidades y precios vigentes tras la primera sesión, sin presión comercial.',
    next: 'Revisa consultas, reservas y visitas reales sin confundirlas con visualizaciones.'
  }
];

function parseStartDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Indica una fecha de inicio válida.');
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error('Indica una fecha de inicio válida.');
  }
  return date;
}

export function buildGymPlan({ activity, audience = '', startsOn, slot = '', bookingUrl = '' }) {
  const name = String(activity || '').trim();
  if (!name) throw new Error('Indica una clase o actividad real.');
  const start = parseStartDate(String(startsOn || ''));
  const target = String(audience || '').trim();
  const timetable = String(slot || '').trim();
  const booking = String(bookingUrl || '').trim();
  if (booking && !/^https?:\/\/\S+$/i.test(booking)) throw new Error('El enlace de reserva debe comenzar por https:// o http://.');

  return tasks.map((task) => {
    const date = new Date(start.getTime() + task.offset * 86400000);
    return {
      week: task.week,
      date: date.toISOString().slice(0, 10),
      stage: task.stage,
      question: task.question,
      piece: task.piece(name, target, timetable),
      next: typeof task.next === 'function' ? task.next(booking) : task.next
    };
  });
}

export function planAsText(plan) {
  return plan.map((task) =>
    `Semana ${task.week} · ${task.date} · ${task.stage}\nDuda: ${task.question}\nPieza: ${task.piece}\nSiguiente paso: ${task.next}`
  ).join('\n\n');
}

function csvCell(value) {
  let cell = String(value).replace(/\r\n?|\n/g, ' ');
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(cell)) cell = `'${cell}`;
  return `"${cell.replace(/"/g, '""')}"`;
}

export function planAsCsv(plan) {
  const rows = [['Semana', 'Fecha sugerida', 'Etapa', 'Duda', 'Pieza', 'Siguiente paso']];
  for (const task of plan) rows.push([task.week, task.date, task.stage, task.question, task.piece, task.next]);
  return '\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('gym-planner-form');
  if (form) {
    const result = document.getElementById('gym-planner-result');
    const text = document.getElementById('gym-planner-text');
    const status = document.getElementById('gym-planner-status');
    const download = document.getElementById('gym-planner-download');
    let currentPlan = null;

    const clearOutdatedPlan = () => {
      if (!currentPlan) return;
      currentPlan = null;
      result.hidden = true;
      status.textContent = 'Los datos han cambiado. Genera de nuevo el borrador antes de descargarlo.';
    };
    form.addEventListener('input', clearOutdatedPlan);
    form.addEventListener('change', clearOutdatedPlan);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = Object.fromEntries(new FormData(form));
      try {
        currentPlan = buildGymPlan(fields);
        text.value = planAsText(currentPlan);
        result.hidden = false;
        status.textContent = 'Borrador preparado. Revísalo antes de publicarlo.';
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      } catch (error) {
        currentPlan = null;
        result.hidden = true;
        status.textContent = error.message;
      }
    });

    download.addEventListener('click', () => {
      if (!currentPlan) return;
      const blob = new Blob([planAsCsv(currentPlan)], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'calendario-redes-gimnasio.csv';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'CSV descargado. Revisa y adapta cada tarea con datos reales del centro.';
    });
  }
}
