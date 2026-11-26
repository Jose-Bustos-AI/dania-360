import data from '../landing-src/config/planes.json' with {type:'json'};
export const packages = data;
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function packageOffers(url) {
  return packages.planes.filter(p => p.disponible).map(p => ({
    '@type':'Offer', name:p.nombre, description:[p.descripcion, ...p.incluye].join(' '),
    price:String(p.precio), priceCurrency:'EUR', availability:'https://schema.org/InStock',
    url:url+'#'+p.id, priceSpecification:{'@type':'UnitPriceSpecification',price:String(p.precio),priceCurrency:'EUR',unitText:'mes'}
  }));
}
export function renderPackages({id='planes', context='mi negocio'} = {}) {
  return `<section class="d360-packages" id="${esc(id)}" aria-labelledby="packages-title" data-packages-version="${packages.version}">
    <header class="d360-packages__intro"><p>Planes para tu negocio</p><h2 id="packages-title">Que te encuentren, que les contesten y que lleguen más</h2><p>Starter cuida tu presencia en buscadores. Growth añade atención con IA. Scale añade publicidad y contenido para tus redes.</p></header>
    <div class="d360-packages__grid">${packages.planes.map(p => `<article class="d360-package${p.destacado?' d360-package--featured':''}" id="${p.id}" data-package="${p.id}" data-available="${p.disponible}">
      <div class="d360-package__heading"><h3>${p.nombre}</h3><span class="d360-package__badge">${esc(p.etiqueta)}</span></div>
      <p class="d360-package__price"><strong>${p.precio} €</strong><span>al mes</span></p>
      <p class="d360-package__description">${esc(p.descripcion)}</p>
      <p class="d360-package__label">Dónde trabaja${p.disponible?'':'rá'}</p><p class="d360-package__channels">${esc(p.canales)}</p>
      ${p.disponible ? `<a class="d360-package__cta" href="https://wa.me/34631105772?text=${encodeURIComponent(`Hola, quiero investigar la presencia digital de ${context} y conocer el plan ${p.nombre} de ${p.precio} €/mes.`)}" target="_blank" rel="noopener noreferrer" data-plan="${p.id}" data-cta-location="plan" aria-label="Investigar mi negocio con el plan ${p.nombre} de ${p.precio} euros al mes" data-cta="package-${p.id}">Investigar mi negocio<small>Paso 1: sin compromiso</small></a>` : '<p class="d360-package__status">Próximamente. Este plan todavía no está disponible.</p>'}
      <ul class="d360-package__features">${p.incluye.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
      <div class="d360-package__pending"><h4>${p.disponible?'En progreso':'Más adelante'}</h4><p>${p.disponible?'Estas funciones aún no están disponibles.':'TikTok no forma parte del lanzamiento anunciado.'}</p><ul>${p.pendiente.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>
    </article>`).join('')}</div>
    <p class="d360-packages__note">${esc(packages.microcopy)} La visibilidad en buscadores y asistentes de IA no garantiza posiciones ni recomendaciones. <a href="/precios-gestion-redes-sociales/">Consulta los planes y su alcance</a>.</p>
  </section>`;
}
