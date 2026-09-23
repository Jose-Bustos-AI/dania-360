import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const homePath = fileURLToPath(new URL('../../index.html', import.meta.url));
const sectors = [
  ['/salones-estetica/', 'Peluquerías y estética', 'Citas, tratamientos y confianza'],
  ['/gestion-redes-sociales-restaurantes/', 'Restaurantes', 'Carta, ambiente y reservas'],
  ['/gestion-redes-sociales-gimnasios/', 'Gimnasios', 'Clases, equipo y comunidad'],
  ['/gestion-redes-sociales-clinicas-dentales/', 'Clínicas dentales', 'Equipo, tratamientos y reputación'],
  ['/gestion-redes-sociales-inmobiliarias/', 'Inmobiliarias', 'Propietarios, inmuebles y visitas'],
  ['/gestion-redes-sociales-academias/', 'Academias', 'Cursos, docentes y matrículas'],
  ['/gestion-redes-sociales-comercios/', 'Tiendas y comercios', 'Productos, novedades y visitas'],
  ['/gestion-redes-sociales-abogados/', 'Abogados', 'Especialidades y consultas'],
  ['/gestion-redes-sociales-fisioterapia/', 'Fisioterapeutas', 'Servicios, equipo y citas'],
  ['/gestion-redes-sociales-veterinarias/', 'Clínicas veterinarias', 'Prevención, servicios y confianza'],
];

let html = readFileSync(homePath, 'utf8');
const marker = '<!-- directorio de sectores -->';
const footer = '<footer class="footer">';
if (html.split(footer).length !== 2) {
  throw new Error('No se encontró un único pie de página en la portada');
}

const cards = sectors
  .map(([url, name, detail]) =>
    `<a href="${url}" class="sector-directory__card"><strong>Gestión de redes sociales para ${name.toLowerCase()}</strong><span>${detail}</span><span aria-hidden="true">Ver solución →</span></a>`)
  .join('');
const section = `${marker}<section class="sector-directory" aria-labelledby="sector-directory-title"><div class="section-heading centered"><span class="section-kicker">Soluciones por sector</span><h2 id="sector-directory-title">Una estrategia adaptada <em>a tu negocio.</em></h2><p>Consulta ejemplos, canales y planes específicos para tu actividad.</p></div><div class="sector-directory__grid">${cards}</div><p class="sector-directory__all"><a href="/gestion-redes-sociales/">Cómo funciona nuestro servicio de gestión de redes sociales →</a></p></section>`;

const markerIndex = html.indexOf(marker);
const footerIndex = html.indexOf(footer);
if (markerIndex !== -1 && markerIndex >= footerIndex) {
  throw new Error('El directorio sectorial está fuera de su posición prevista');
}
html = markerIndex === -1
  ? html.replace(footer, section + footer)
  : html.slice(0, markerIndex) + section + html.slice(footerIndex);
html = html.replace(
  '<small>Gestión de redes sociales</small><b>Desde 99 €/mes</b>',
  '<small>Planes digitales</small><b>Desde 99 €/mes</b>',
);
writeFileSync(homePath, html, 'utf8');
console.log(`Directorio visible de ${sectors.length} sectores añadido a la portada.`);
