function cleanField(value, label, limit) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text) throw new Error(`Confirma ${label} antes de preparar las respuestas.`);
  if (text.length > limit) throw new Error(`${label} es demasiado largo; resume el dato confirmado.`);
  return text;
}

export function buildVetReplies({ clinic, appointments, urgent }) {
  const name = cleanField(clinic, 'el nombre de la clínica', 80);
  const appointmentRoute = cleanField(appointments, 'el canal de citas y servicios', 120);
  const urgentRoute = cleanField(urgent, 'el canal para posibles urgencias', 120);

  return [
    {
      heading: '1. Horario o cita',
      draft: `Gracias por escribir a ${name}. Para comprobar el horario actualizado o pedir una cita, utiliza este canal confirmado por la clínica: ${appointmentRoute}. Si tu consulta incluye síntomas, evita publicarlos en comentarios y contacta directamente con el equipo.`
    },
    {
      heading: '2. Consulta sobre un servicio',
      draft: `Gracias por contactar con ${name}. Podemos confirmar qué servicios prestamos y su disponibilidad a través de: ${appointmentRoute}. La información publicada en redes es general; un profesional veterinario debe valorar cualquier situación individual.`
    },
    {
      heading: '3. Síntomas o posible urgencia',
      draft: `Gracias por escribir a ${name}. Este perfil no permite valorar síntomas ni sustituye la atención veterinaria. Para una posible urgencia, utiliza el canal que la clínica ha confirmado para estos casos: ${urgentRoute}. No esperes una respuesta en comentarios o mensajes de redes; el equipo o servicio indicado te dirá cómo proceder.`
    }
  ];
}

export function repliesAsText(replies) {
  return replies.map(({ heading, draft }) => `${heading}\n${draft}`).join('\n\n');
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('vet-replies-form');
  if (form) {
    const result = document.getElementById('vet-replies-result');
    const text = document.getElementById('vet-replies-text');
    const status = document.getElementById('vet-replies-status');
    const copy = document.getElementById('vet-replies-copy');

    form.addEventListener('input', () => {
      if (result.hidden) return;
      result.hidden = true;
      status.textContent = 'Han cambiado los datos. Prepara de nuevo las respuestas antes de copiarlas.';
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        const fields = Object.fromEntries(new FormData(form));
        text.value = repliesAsText(buildVetReplies(fields));
        result.hidden = false;
        status.textContent = 'Tres borradores preparados. La clínica debe revisarlos antes de usarlos.';
        result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      } catch (error) {
        result.hidden = true;
        status.textContent = error.message;
      }
    });

    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text.value);
        status.textContent = 'Texto copiado. Comprueba canales, horario y mensaje clínico antes de usarlo.';
      } catch {
        text.focus();
        text.select();
        status.textContent = 'Texto seleccionado. Cópialo manualmente y revísalo antes de usarlo.';
      }
    });
  }
}
