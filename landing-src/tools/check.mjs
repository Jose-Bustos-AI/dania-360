/**
 * Comprobaciones sobre el sitio ya generado.
 *
 * Son las reglas que no se pueden dejar a la vista: que exista un solo H1, que
 * ningún botón comercial deje de apuntar a WhatsApp, que el bloque FAQPage
 * diga exactamente lo mismo que el acordeón visible, que no se cuele un
 * formulario de compra, que no aparezca un testimonio inventado y que ninguna
 * página legal publique un marcador de dato pendiente.
 *
 *   node tools/check.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (ruta) => readFileSync(join(raiz, ruta), 'utf8');
const leerJson = (ruta) => JSON.parse(leer(ruta));

const sitio = leerJson('config/sitio.json');
const contacto = leerJson('config/contacto.json');
const planes = leerJson('config/planes.json');
const faq = leerJson('config/faq.json');
const legal = leerJson('config/legal.json');

let fallos = 0;
let pruebas = 0;

function comprobar(descripcion, condicion, detalle = '') {
  pruebas += 1;
  if (condicion) {
    console.log(`  ok    ${descripcion}`);
    return;
  }
  fallos += 1;
  console.log(`  FALLO ${descripcion}${detalle ? ` — ${detalle}` : ''}`);
}

function grupo(titulo) {
  console.log(`\n${titulo}`);
}

if (!existsSync(join(raiz, 'site/salones-estetica/index.html'))) {
  console.error('No hay nada que comprobar: ejecuta antes `npm run build`.');
  process.exit(1);
}

const html = leer('site/salones-estetica/index.html');

/* ------------------------------------------------------------- estructura */

grupo('Estructura y accesibilidad');

const h1 = html.match(/<h1[\s>]/g) || [];
comprobar('Existe exactamente un H1', h1.length === 1, `encontrados ${h1.length}`);
comprobar('El documento declara idioma español', /<html lang="es"/.test(html));
comprobar('Hay enlace de salto al contenido', /class="enlace-salto"/.test(html));
comprobar(
  'No quedan marcadores de plantilla sin sustituir',
  !/\{\{[A-Z0-9_]+\}\}/.test(html),
);
comprobar(
  'El menú móvil declara aria-expanded y aria-controls',
  /data-menu-boton[\s\S]{0,200}aria-expanded="false"[\s\S]{0,120}aria-controls="menu-movil"/.test(
    html,
  ),
);
comprobar(
  'Toda etiqueta img, si la hubiera, lleva alt',
  (html.match(/<img\b(?![^>]*\balt=)/g) || []).length === 0,
);
comprobar(
  'Los huecos de fotografía se anuncian con role e etiqueta accesible',
  (html.match(/class="marco[^"]*"/g) || []).length ===
    (html.match(/class="marco[^"]*"[\s\S]{0,220}?aria-label="/g) || []).length,
);

/* -------------------------------------------------------------------- SEO */

grupo('SEO y metadatos sociales');

comprobar(
  'El title es el acordado',
  html.includes(`<title>${sitio.landing.title}</title>`),
);
comprobar(
  'La meta description es la acordada',
  html.includes(`content="${sitio.landing.description}"`),
);
comprobar(
  'El canonical apunta a la URL definitiva',
  html.includes(`<link rel="canonical" href="${sitio.landing.canonical}" />`),
);
comprobar('La landing es indexable', /name="robots" content="index, follow/.test(html));

for (const propiedad of ['og:type', 'og:url', 'og:title', 'og:description', 'og:image', 'og:image:alt']) {
  comprobar(`Open Graph declara ${propiedad}`, html.includes(`property="${propiedad}"`));
}
comprobar('Twitter Card en formato summary_large_image', html.includes('name="twitter:card" content="summary_large_image"'));
comprobar('Twitter Card declara imagen', html.includes('name="twitter:image"'));

/* ----------------------------------------------------------------- schema */

grupo('Schema.org');

const bloques = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
  (coincidencia) => JSON.parse(coincidencia[1]),
);

comprobar('Hay dos bloques JSON-LD y ambos son JSON válido', bloques.length === 2);

const service = bloques.find((b) => b['@type'] === 'Service');
const faqPage = bloques.find((b) => b['@type'] === 'FAQPage');

comprobar('Existe un bloque Service', Boolean(service));
comprobar('Existe un bloque FAQPage', Boolean(faqPage));
comprobar(
  'Service declara a Dania360 como proveedor',
  service?.provider?.name === 'Dania360',
);
comprobar(
  'Service publica los tres planes con su precio real',
  planes.planes.every((plan) =>
    service?.hasOfferCatalog?.itemListElement?.some(
      (oferta) => oferta.name === plan.nombre && oferta.price === String(plan.precio),
    ),
  ),
);
comprobar(
  'FAQPage tiene tantas preguntas como el acordeón',
  faqPage?.mainEntity?.length === faq.preguntas.length,
);
comprobar(
  'Cada respuesta del schema coincide literalmente con la visible',
  faq.preguntas.every((pregunta, indice) => {
    const entrada = faqPage?.mainEntity?.[indice];
    return (
      entrada?.name === pregunta.pregunta &&
      entrada?.acceptedAnswer?.text === pregunta.respuesta
    );
  }),
);

/* ------------------------------------------------------------------ planes */

grupo('Planes');

for (const plan of planes.planes) {
  comprobar(
    `El plan ${plan.nombre} aparece con su precio (${plan.precio} ${planes.moneda})`,
    html.includes(`>${plan.nombre}</h3>`) && html.includes(`>${plan.precio}</span>`),
  );
  comprobar(
    `El plan ${plan.nombre} lista sus ${plan.incluye.length} características`,
    plan.incluye.every((linea) =>
      html.includes(linea.replace(/&/g, '&amp;').replace(/</g, '&lt;')),
    ),
  );
  comprobar(
    `El botón del plan ${plan.nombre} abre WhatsApp con su mensaje`,
    html.includes(`data-plan="${plan.id}"`) &&
      html.includes(encodeURIComponent(`plan ${plan.nombre} de ${plan.precio}`)),
  );
}

comprobar('Se muestra el microcopy de condiciones', html.includes(planes.microcopy));

/* ---------------------------------------------------------------- WhatsApp */

grupo('CTA a WhatsApp');

const enlaces = [...html.matchAll(/<a\b[^>]*href="([^"]*wa\.me[^"]*)"[^>]*>/g)].map(
  (coincidencia) => coincidencia[0],
);

comprobar('Hay enlaces a WhatsApp', enlaces.length > 0, `${enlaces.length} encontrados`);
comprobar(
  'Todos abren en pestaña nueva con rel seguro',
  enlaces.every(
    (enlace) =>
      enlace.includes('target="_blank"') && enlace.includes('rel="noopener noreferrer"'),
  ),
);
comprobar(
  'Todos llevan nombre accesible',
  enlaces.every((enlace) => /aria-label="[^"]{15,}"/.test(enlace)),
);
comprobar(
  'Todos declaran data-cta-location',
  enlaces.every((enlace) => enlace.includes('data-cta-location=')),
);
comprobar(
  'Todos apuntan al número oficial',
  enlaces.every((enlace) => enlace.includes(`wa.me/${contacto.whatsappNumero}`)),
);
comprobar(
  'Todos llevan un mensaje previo redactado',
  enlaces.every((enlace) => enlace.includes('?text=')),
);

const ubicaciones = [
  'cabecera',
  'menu_movil',
  'hero',
  'problema',
  'beneficios',
  'como_funciona',
  'plan',
  'faq',
  'cierre',
  'pie',
  'barra_movil',
];

for (const ubicacion of ubicaciones) {
  comprobar(
    `Hay CTA en la ubicación "${ubicacion}"`,
    html.includes(`data-cta-location="${ubicacion}"`),
  );
}

const js = leer('site/salones-estetica/assets/js/salones-estetica.js');
comprobar('El evento de medición es whatsapp_click sobre dataLayer', /dataLayer[\s\S]*event: 'whatsapp_click'/.test(js));
comprobar(
  'No se codifica ningún identificador de Analytics ni de Ads',
  !/\bG-[A-Z0-9]{6,}|\bAW-\d{6,}|\bGTM-[A-Z0-9]{5,}|UA-\d{4,}/.test(js + html),
);

/* ------------------------------------------------- nada de venta ni promesas */

grupo('Sin checkout, sin registro, sin datos inventados');

comprobar('No hay formularios', !/<form\b/i.test(html));
comprobar('No hay campos de entrada', !/<input\b|<textarea\b|<select\b/i.test(html));
comprobar(
  'No hay pasarela de pago ni carrito',
  !/(checkout|stripe|paypal|carrito|añadir al carrito|comprar ahora)/i.test(html),
);
comprobar(
  'No se garantiza ningún resultado',
  !/(garantizamos|te garantizamos) (más|nuevos|un mínimo|x )/i.test(html),
);
comprobar(
  'El bloque de casos reales está vacío y oculto',
  /class="casos-reales"[^>]*\bhidden\b/.test(html) && !/caso__cita">[^<]+</.test(html),
);
comprobar(
  'No se afirma el número de especialistas de la red (dato no confirmado)',
  !/\d{2,}\s+especialistas/i.test(html),
);

/* ------------------------------------------------------------ dependencias */

grupo('Recursos y dependencias');

const externos = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)].map((c) => c[1]);
const permitidos = ['wa.me'];
comprobar(
  'No se carga ningún recurso de un tercero',
  externos.every(
    (url) =>
      url.startsWith(sitio.origen) || permitidos.some((dominio) => url.includes(dominio)),
  ),
  externos.filter(
    (url) =>
      !url.startsWith(sitio.origen) && !permitidos.some((dominio) => url.includes(dominio)),
  ).join(', '),
);
comprobar('No hay fuentes remotas', !/fonts\.(googleapis|gstatic)\.com/.test(html));
comprobar(
  'No se carga ninguna biblioteca de terceros',
  !/<script[^>]+src="https?:/.test(html),
);
comprobar('No hay vídeo con reproducción automática', !/autoplay/i.test(html));

for (const recurso of [
  'site/salones-estetica/assets/css/salones-estetica.css',
  'site/salones-estetica/assets/css/legal.css',
  'site/salones-estetica/assets/js/salones-estetica.js',
  'site/salones-estetica/assets/img/favicon.svg',
]) {
  comprobar(`Existe ${recurso.replace('site/', '')}`, existsSync(join(raiz, recurso)));
}

const fotos = leerJson('config/fotos.json');
const huecos = [...html.matchAll(/data-foto="([a-z-]+)"/g)].map((c) => c[1]);

comprobar(
  'Todos los huecos fotográficos están declarados en config/fotos.json',
  huecos.every((id) => id in fotos.huecos),
  huecos.filter((id) => !(id in fotos.huecos)).join(', '),
);
comprobar(
  'Ninguna fotografía apunta a un archivo inexistente',
  [...html.matchAll(/--foto: url\('([^']+)'\)/g)].every((c) =>
    existsSync(join(raiz, 'site', c[1])),
  ),
);
comprobar(
  'Los huecos sin fotografía no emiten ninguna URL',
  Object.entries(fotos.huecos)
    .filter(([, hueco]) => !hueco.disponible)
    .every(([id]) => !html.includes(`${fotos.carpeta}${id}.${fotos.extension}`)),
);

const css = leer('site/salones-estetica/assets/css/salones-estetica.css');
comprobar('El CSS respeta prefers-reduced-motion', css.includes('prefers-reduced-motion'));
comprobar('El CSS define un foco visible', css.includes(':focus-visible'));
comprobar('Hay barra fija de WhatsApp en móvil', css.includes('.barra-movil'));
comprobar(
  'Los botones tienen altura cómoda para el pulgar',
  /\.boton\s*\{[\s\S]*?min-height:\s*52px/.test(css),
);
comprobar('El cuerpo evita el desplazamiento horizontal', /body\s*\{[\s\S]*?overflow-x:\s*hidden/.test(css));

/* ----------------------------------------------------------------- legales */

grupo('Páginas legales');

for (const ruta of Object.values(sitio.legales)) {
  const archivo = `site${ruta}index.html`;
  const existe = existsSync(join(raiz, archivo));
  comprobar(`Existe ${ruta}`, existe);
  if (!existe) continue;

  const pagina = leer(archivo);
  comprobar(
    `${ruta} lleva noindex mientras faltan datos`,
    legal.legalDataComplete
      ? pagina.includes('content="index, follow"')
      : pagina.includes('content="noindex, nofollow"'),
  );
  comprobar(
    `${ruta} no publica ningún marcador de dato pendiente`,
    /* El TODO se busca en mayúsculas y con límites de palabra: en castellano
       "todo" y "todos" son palabras corrientes y provocarían un falso fallo. */
    !/\[PENDIENTE|POR DEFINIR|XXXX|\{\{/i.test(pagina) && !/\bTODO\b/.test(pagina),
  );
  comprobar(`${ruta} no deja etiquetas de definición vacías`, !/<dd>\s*<\/dd>/.test(pagina));
  comprobar(
    `${ruta} no muestra el aviso de desarrollo`,
    !pagina.includes('aviso-desarrollo'),
  );
}

comprobar(
  'La landing enlaza las tres páginas legales',
  Object.values(sitio.legales).every((ruta) => html.includes(`href="${ruta}"`)),
);

/* ----------------------------------------------------------------- sitemap */

grupo('Sitemap');

const sitemap = leer('site/sitemap-salones-estetica.xml');
comprobar('El sitemap incluye la landing', sitemap.includes(sitio.landing.canonical));
comprobar(
  'El sitemap excluye las páginas legales mientras son noindex',
  legal.legalDataComplete
    ? sitemap.includes(`${sitio.origen}${sitio.legales.avisoLegal}`)
    : !sitemap.includes(`${sitio.origen}${sitio.legales.avisoLegal}`),
);
comprobar(
  'Existe el fragmento para el sitemap actual de dania360.com',
  existsSync(join(raiz, 'snippets/sitemap-entrada.xml')),
);
comprobar(
  'Existe el enlace de pie para dania360.com',
  existsSync(join(raiz, 'snippets/footer-soluciones-por-sectores.html')),
);

/* ------------------------------------------------------------------ resumen */

console.log(
  `\n${pruebas - fallos}/${pruebas} comprobaciones correctas${fallos ? ` · ${fallos} FALLOS` : ''}`,
);

if (!legal.legalDataComplete) {
  console.log(
    'Aviso: legalDataComplete = false. No deben iniciarse campañas hasta completar\n' +
      'y revisar los datos legales (docs/PENDIENTES-LEGALES.md).',
  );
}

process.exit(fallos ? 1 : 0);
