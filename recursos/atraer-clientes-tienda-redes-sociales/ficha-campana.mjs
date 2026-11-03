const stockLabels = {
  pending: 'Disponibilidad pendiente de comprobar',
  confirmed: 'Disponibilidad confirmada por el comercio',
  unavailable: 'Sin existencias: no anunciar disponibilidad'
};
const priceLabels = {
  omit: 'No se anuncia un precio',
  confirmed: 'Precio confirmado por el comercio',
  pending: 'Precio pendiente de comprobar'
};

function field(value, label, maximum, optional = false) {
  const text = String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  if ((!optional && !text) || text.length > maximum) {
    throw new Error(`${label}: escribe ${optional ? 'como máximo' : 'entre 1 y'} ${maximum} caracteres.`);
  }
  return text;
}

export function buildRetailBrief(fields) {
  const product = field(fields.product, 'Producto o selección', 100);
  const detail = field(fields.detail, 'Detalle que ayuda a elegir', 180);
  const nextStep = field(fields.nextStep, 'Cómo preguntar o visitar', 160);
  const price = field(fields.price, 'Precio y condiciones', 100, true);
  if (!Object.hasOwn(stockLabels, fields.stock)) throw new Error('Selecciona el estado de disponibilidad.');
  if (!Object.hasOwn(priceLabels, fields.priceState)) throw new Error('Selecciona el estado del precio.');
  if (fields.priceState === 'omit' && price) throw new Error('Borra el precio o indica si está confirmado o pendiente.');
  if (fields.priceState !== 'omit' && !price) throw new Error('Escribe el precio y sus condiciones, o elige no anunciarlo.');

  const pending = [];
  if (fields.stock !== 'confirmed') pending.push(stockLabels[fields.stock]);
  if (fields.priceState === 'pending') pending.push(priceLabels.pending);
  if (fields.imageConfirmed !== true) pending.push('Comprobar que el material visual representa el producto real y puede utilizarse');
  if (fields.contactConfirmed !== true) pending.push('Comprobar el destino del contacto y quién atiende las consultas');

  const draft = pending.length ? null : [
    `Conoce ${product}.`, detail,
    ...(price ? [`Precio y condiciones: ${price}.`] : []), nextStep
  ].join('\n');

  return {
    product, detail, nextStep, price,
    stock: stockLabels[fields.stock], priceState: priceLabels[fields.priceState],
    pending, draft
  };
}

export function retailBriefAsText(brief) {
  return [
    'FICHA DE PUBLICACIÓN PARA UNA TIENDA',
    `Producto o selección: ${brief.product}`,
    `Detalle útil: ${brief.detail}`,
    `Siguiente paso: ${brief.nextStep}`,
    `Disponibilidad declarada: ${brief.stock}`,
    `Precio: ${brief.priceState}${brief.price ? ` · ${brief.price}` : ''}`,
    '',
    ...(brief.pending.length ? [
      'NO PROGRAMAR: HAY DATOS PENDIENTES O FALTA DISPONIBILIDAD.',
      ...brief.pending.map(item => `- ${item}`),
      'No se genera texto promocional de disponibilidad hasta resolverlos.'
    ] : [
      'BORRADOR DE TEXTO · REVISIÓN FINAL DEL COMERCIO PENDIENTE',
      brief.draft
    ]),
    '',
    'Antes de publicar: comprobar de nuevo stock, precio, condiciones, imagen y destino.',
    'Después: registrar consultas de este producto y actualizar o retirar el anuncio si cambia la información.',
    'Esta ficha usa lo que has declarado. No comprueba el inventario ni acredita cumplimiento legal o ventas.'
  ].join('\n');
}

export function initRetailBrief(doc) {
  const form = doc.getElementById('retail-brief-form');
  if (!form) return;
  const result = doc.getElementById('retail-brief-result');
  const text = doc.getElementById('retail-brief-text');
  const status = doc.getElementById('retail-brief-status');
  const download = doc.getElementById('retail-brief-download');
  form.hidden = false;
  let fileUrl;
  const invalidate = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    fileUrl = undefined;
    download.removeAttribute('href');
    if (!result.hidden) status.textContent = 'Has cambiado la ficha. Prepárala de nuevo antes de descargarla.';
    result.hidden = true;
    text.value = '';
  };
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  form.addEventListener('submit', event => {
    event.preventDefault();
    invalidate();
    try {
      const values = Object.fromEntries(new FormData(form));
      const brief = buildRetailBrief({ ...values,
        imageConfirmed: values.imageConfirmed === 'on',
        contactConfirmed: values.contactConfirmed === 'on'
      });
      text.value = retailBriefAsText(brief);
      fileUrl = URL.createObjectURL(new Blob([text.value], { type: 'text/plain;charset=utf-8' }));
      download.href = fileUrl;
      result.hidden = false;
      status.textContent = brief.pending.length
        ? 'Ficha preparada con tareas pendientes. No programes todavía una publicación de disponibilidad.'
        : 'Borrador preparado con tus datos. Revísalo antes de publicarlo: la herramienta no verifica el stock.';
      text.focus();
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

if (typeof document !== 'undefined') initRetailBrief(document);
