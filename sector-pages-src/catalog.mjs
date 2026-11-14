const resourceDefaults = {
  description: 'Descarga el archivo de texto y adáptalo a tu negocio. Es una ficha en blanco: no recoge ni envía datos.',
  linkLabel: 'Descargar ficha editable · TXT',
  documentSubtitle: 'Dania360 · Recurso editable · Ejemplo de organización',
};

export function resourcePresentation(page) {
  const supplied = page.resourcePresentation;
  if (supplied === undefined) return resourceDefaults;
  if (!supplied || typeof supplied !== 'object' || Array.isArray(supplied)) {
    throw new Error(`${page.slug}: la presentación del recurso debe ser un objeto`);
  }
  for (const key of Object.keys(supplied)) {
    if (!Object.hasOwn(resourceDefaults,key)) throw new Error(`${page.slug}: campo de recurso desconocido ${key}`);
  }
  for (const key of Object.keys(resourceDefaults)) {
    if (typeof supplied[key] !== 'string' || !supplied[key].trim()) {
      throw new Error(`${page.slug}: falta ${key} para describir el recurso completo`);
    }
  }
  return supplied;
}

export function prepareCatalog(pages, groups) {
  if (!Array.isArray(pages) || !pages.length || !Array.isArray(groups) || !groups.length) {
    throw new Error('El catálogo necesita páginas y grupos definidos');
  }
  const groupIds = new Set();
  for (const group of groups) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(group.id ?? '') || !group.title?.trim() || groupIds.has(group.id)) {
      throw new Error('Grupo sectorial incorrecto o duplicado');
    }
    groupIds.add(group.id);
  }
  const slugs = new Set(), ids = new Set();
  const grouped = groups.map(group => ({...group, pages: []}));
  for (const page of pages) {
    if (!Number.isInteger(page.id) || page.id < 11 || page.id > 100 || ids.has(page.id)) {
      throw new Error(`${page.slug}: identificador sectorial incorrecto o duplicado`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug ?? '') || slugs.has(page.slug)) {
      throw new Error('Ruta sectorial incorrecta o duplicada');
    }
    const groupId = groupOf(page);
    const group = grouped.find(group => group.id === groupId);
    if (!group) throw new Error(`${page.slug}: asigna un grupo sectorial existente`);
    const date = page.contentModified;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date) {
      throw new Error(`${page.slug}: falta una fecha de contenido válida`);
    }
    resourcePresentation(page);
    heroLive(page);
    ids.add(page.id);
    slugs.add(page.slug);
    group.pages.push(page);
  }
  return grouped.filter(group => group.pages.length);
}

// Grupo de una página: el declarado o, para las diez primeras ampliaciones, el de oficios.
export const groupOf = page => page.hubGroup ?? (page.id <= 20 ? 'oficios' : undefined);

// Grupos con menos de cinco páginas se completan hasta cuatro relacionadas con estas rutas afines,
// en este orden. Una ruta que empieza por / es una landing hecha a mano; si no, es un slug generado.
export const relatedFallback = {
  'proyectos-espacios': ['reformas', 'construccion'],
  'escuelas-clubes': ['/gestion-redes-sociales-gimnasios/', '/gestion-redes-sociales-academias/'],
};

const heroPostFormats = ['Instagram · Vídeo de 15 s', 'Facebook · Publicación', 'TikTok · Vídeo de 15 s'];
const noAngleQuotes = (slug, value) => {
  if (/[«»]/.test(value)) throw new Error(`${slug}: usa comillas normales en el ejemplo del hero`);
  return value.trim();
};

// Textos del móvil del hero. Son un ejemplo ilustrativo: nunca un cliente, un mensaje real ni un resultado.
export function heroLive(page) {
  const {slug} = page;
  let posts = [page.promise, page.resourceTitle, 'Cómo pedirnos información en un solo mensaje'];
  if (page.heroPosts !== undefined) {
    if (!Array.isArray(page.heroPosts) || page.heroPosts.length !== 3
        || page.heroPosts.some(text => typeof text !== 'string' || !text.trim() || text.length > 110)) {
      throw new Error(`${slug}: heroPosts debe tener tres textos cortos (máximo 110 caracteres)`);
    }
    posts = page.heroPosts;
  }
  let chat = {
    question: 'Hola, he visto vuestra publicación. ¿Me dais información?',
    answer: 'Hola, gracias por escribir. Cuéntanos qué necesitas y te pasamos la información. Si lo prefieres, te llamamos.',
  };
  if (page.heroChat !== undefined) {
    const supplied = page.heroChat;
    if (!supplied || typeof supplied !== 'object' || Array.isArray(supplied)
        || Object.keys(supplied).some(key => key !== 'question' && key !== 'answer')
        || ['question', 'answer'].some(key => typeof supplied[key] !== 'string' || !supplied[key].trim() || supplied[key].length > 200)) {
      throw new Error(`${slug}: heroChat necesita question y answer (máximo 200 caracteres cada uno)`);
    }
    chat = supplied;
  }
  return {
    posts: posts.map((text, i) => ({format: heroPostFormats[i], text: noAngleQuotes(slug, text)})),
    chat: {question: noAngleQuotes(slug, chat.question), answer: noAngleQuotes(slug, chat.answer)},
  };
}
