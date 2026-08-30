/**
 * Generador de la landing de salones y centros de estética.
 *
 * No hay framework ni dependencias: es un sustituidor de plantillas de un solo
 * archivo. La razón es deliberada. Todo lo que puede desincronizarse entre dos
 * sitios (los precios de los planes, los mensajes de WhatsApp, el texto de las
 * preguntas frecuentes y su equivalente en Schema.org, los datos legales) se
 * declara una sola vez en `config/` y se imprime desde aquí. Si un dato cambia,
 * cambia en un único sitio y vuelve a generarse todo.
 *
 *   node tools/build.mjs                    genera site/ completo (autónomo)
 *   node tools/build.mjs --dev              añade el aviso visible de datos
 *                                           legales incompletos (nunca a producción)
 *   node tools/build.mjs --integrado --out <dir>
 *                                           genera SOLO salones-estetica/ dentro
 *                                           de <dir>. Es el modo que se usa en el
 *                                           repositorio de dania360.com, donde el
 *                                           sitio ya publica sus propias páginas
 *                                           legales, su sitemap y su robots.txt.
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const modoDesarrollo = process.argv.includes('--dev');
const modoIntegrado = process.argv.includes('--integrado');

const indiceOut = process.argv.indexOf('--out');
const destinoPedido = indiceOut !== -1 ? process.argv[indiceOut + 1] : null;
if (indiceOut !== -1 && !destinoPedido) {
  throw new Error('--out necesita una ruta de destino');
}

const leerJson = (ruta) => JSON.parse(readFileSync(join(raiz, ruta), 'utf8'));
const leerTexto = (ruta) => readFileSync(join(raiz, ruta), 'utf8');

const sitio = leerJson('config/sitio.json');
const contacto = leerJson('config/contacto.json');
const planes = leerJson('config/planes.json');
const faq = leerJson('config/faq.json');
const legal = leerJson('config/legal.json');
const fotos = leerJson('config/fotos.json');

const salida = destinoPedido ? resolve(process.cwd(), destinoPedido) : join(raiz, 'site');
const rutaLanding = join(salida, 'salones-estetica');

/* ------------------------------------------------------------------ ayudas */

/** Escapa lo que se imprime dentro de un nodo o un atributo HTML. */
function esc(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Serializa JSON-LD. La secuencia `</script>` dentro de una cadena cerraría la
 * etiqueta antes de tiempo, así que se escapa el signo de menor que.
 */
function jsonLd(objeto) {
  return JSON.stringify(objeto, null, 2).replace(/</g, '\\u003c');
}

/** Enlace de WhatsApp con el mensaje ya redactado. */
function enlaceWhatsapp(mensaje) {
  return `${contacto.whatsappBase}?text=${encodeURIComponent(mensaje)}`;
}

/** Sustituye los marcadores {{CLAVE}} de una plantilla. */
function rellenar(plantilla, valores) {
  return plantilla.replace(/\{\{([A-Z0-9_]+)\}\}/g, (coincidencia, clave) => {
    if (!(clave in valores)) {
      throw new Error(`Marcador sin valor en la plantilla: {{${clave}}}`);
    }
    return valores[clave];
  });
}

const anio = new Date().getFullYear();
const waGeneral = enlaceWhatsapp(contacto.mensajeGeneral);

/* ------------------------------------------------------------------ planes */

/**
 * Cada plan lleva su propio mensaje de WhatsApp con nombre y precio, de modo
 * que quien recibe la conversación sabe desde la primera línea de qué se
 * habla. El botón nunca compra: abre el chat.
 */
function mensajePlan(plan) {
  return (
    'Hola, tengo un salón o centro de estética. He visto la landing de ' +
    `Dania360 y quiero información sobre el plan ${plan.nombre} de ` +
    `${plan.precio} ${planes.moneda}/mes. Me gustaría agendar una llamada.`
  );
}

function renderPlan(plan) {
  const clases = plan.destacado ? "plan plan--destacado" : "plan";
  const cinta = plan.etiqueta
    ? `\n              <p class="plan__cinta">${esc(plan.etiqueta)}</p>`
    : '';

  const incluye = plan.incluye
    .map(
      (linea) =>
        '                <li>\n' +
        '                  <svg class="marca-lista" style="color: var(--terracota)" aria-hidden="true" focusable="false"><use href="#i-check" /></svg>\n' +
        `                  ${esc(linea)}\n` +
        '                </li>',
    )
    .join('\n');

  return `            <article class="${clases}" aria-labelledby="plan-${plan.id}">${cinta}
              <h3 class="plan__nombre" id="plan-${plan.id}">${esc(plan.nombre)}</h3>
              <p class="plan__descripcion">${esc(plan.descripcion)}</p>

              <p class="plan__precio">
                <span class="plan__importe">${plan.precio}</span>
                <span class="plan__periodo">${esc(planes.moneda)} / ${esc(planes.periodo)}</span>
              </p>
              <p class="plan__canales">${esc(plan.canales)}</p>

              <ul class="plan__incluye">
${incluye}
              </ul>

              <a
                class="boton boton--wa boton--ancho"
                href="${esc(enlaceWhatsapp(mensajePlan(plan)))}"
                target="_blank"
                rel="noopener noreferrer"
                data-cta-location="plan"
                data-plan="${esc(plan.id)}"
                aria-label="Escribir por WhatsApp a Dania360 para pedir información del plan ${esc(plan.nombre)} de ${plan.precio} ${esc(planes.moneda)} al mes"
              >
                <svg class="icono-wa" aria-hidden="true" focusable="false"><use href="#i-wa" /></svg>
                ${esc(plan.boton)}
              </a>
            </article>`;
}

/* -------------------------------------------------------------------- faq */

/**
 * El acordeón visible y el bloque FAQPage se generan de la misma fuente. Un
 * schema que no coincide con lo que ve la persona es motivo de penalización, y
 * mantener dos copias a mano garantiza que antes o después dejen de coincidir.
 */
function renderFaq() {
  return faq.preguntas
    .map((item, indice) => {
      const id = `faq-${indice + 1}`;
      return `            <div class="faq__item">
              <h3>
                <button
                  class="faq__pregunta"
                  type="button"
                  data-faq-pregunta
                  aria-expanded="false"
                  aria-controls="${id}"
                  id="${id}-boton"
                >
                  <span>${esc(item.pregunta)}</span>
                  <span class="faq__signo" aria-hidden="true"></span>
                </button>
              </h3>
              <div class="faq__respuesta" id="${id}" role="region" aria-labelledby="${id}-boton">
                <p>${esc(item.respuesta)}</p>
              </div>
            </div>`;
    })
    .join('\n');
}

/* ----------------------------------------------------------------- schema */

const schemaService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Gestión de presencia digital para centros de estética y salones de belleza',
  serviceType: 'Marketing digital para centros de estética',
  description: sitio.landing.description,
  url: sitio.landing.canonical,
  provider: {
    '@type': 'Organization',
    name: 'Dania360',
    url: `${sitio.origen}/`,
    telephone: contacto.telefonoE164,
  },
  audience: {
    '@type': 'BusinessAudience',
    name: 'Centros de estética, salones de belleza, centros de uñas, estudios de pestañas y cejas, centros de depilación y peluquerías con servicios de estética',
  },
  areaServed: { '@type': 'Country', name: 'España' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Planes de gestión de presencia digital',
    itemListElement: planes.planes.map((plan) => ({
      '@type': 'Offer',
      name: plan.nombre,
      description: plan.descripcion,
      price: String(plan.precio),
      priceCurrency: planes.moneda,
      url: `${sitio.landing.canonical}#planes`,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(plan.precio),
        priceCurrency: planes.moneda,
        billingIncrement: 1,
        unitCode: 'MON',
      },
    })),
  },
};

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.preguntas.map((item) => ({
    '@type': 'Question',
    name: item.pregunta,
    acceptedAnswer: { '@type': 'Answer', text: item.respuesta },
  })),
};

/* ---------------------------------------------------------------- landing */

/*
 * Se borra ÚNICAMENTE la carpeta de la landing, nunca la carpeta de salida.
 * Con --out apuntando a la raíz del repositorio de dania360.com, borrar el
 * destino completo se llevaría por delante la home, los estilos y las páginas
 * legales del sitio.
 */
rmSync(rutaLanding, { recursive: true, force: true });
mkdirSync(rutaLanding, { recursive: true });

/*
 * Huecos fotográficos. Solo se emite la URL de las fotografías marcadas como
 * disponibles: apuntar a un archivo que todavía no existe llenaría la consola
 * de 404 y ensuciaría cualquier auditoría de rendimiento. Mientras tanto el
 * hueco muestra su composición cálida, que ya forma parte del diseño.
 */
/*
 * El .htaccess del sitio cachea el CSS siete días. Sin una marca de version en
 * la URL, un cambio de estilos no llegaria a quien ya haya visitado la pagina
 * hasta que expire esa caché. Se añade un sello derivado del contenido del
 * propio archivo: cambia solo cuando el archivo cambia, y entonces el navegador
 * lo vuelve a pedir. Es la misma solucion que ya usa la home con
 * styles.css?v=..., pero calculada sola en lugar de a mano.
 */
function sello(rutaRelativa) {
  return createHash('sha1')
    .update(readFileSync(join(raiz, rutaRelativa)))
    .digest('hex')
    .slice(0, 8);
}

function versionarAssets(documento) {
  return documento
    .replace(
      'href="assets/css/salones-estetica.css"',
      `href="assets/css/salones-estetica.css?v=${sello('src/assets/css/salones-estetica.css')}"`,
    )
    .replace(
      'src="assets/js/salones-estetica.js"',
      `src="assets/js/salones-estetica.js?v=${sello('src/assets/js/salones-estetica.js')}"`,
    );
}

const fotosPendientes = [];

function aplicarFotos(documento) {
  return documento.replace(/data-foto="([a-z-]+)"/g, (coincidencia, id) => {
    const hueco = fotos.huecos[id];
    if (!hueco) throw new Error(`Hueco fotográfico no declarado en config/fotos.json: ${id}`);
    if (!hueco.disponible) {
      fotosPendientes.push(`${id}.${fotos.extension}`);
      return coincidencia;
    }
    /* data-con-foto retira la trama decorativa del hueco: solo tiene sentido
       mientras no hay imagen. Ver .marco[data-con-foto]::after en el CSS. */
    return `${coincidencia} data-con-foto style="--foto: url('${fotos.carpeta}${id}.${fotos.extension}')"`;
  });
}

const landing = versionarAssets(aplicarFotos(rellenar(leerTexto('src/templates/salones-estetica.html'), {
  TITLE: esc(sitio.landing.title),
  DESCRIPTION: esc(sitio.landing.description),
  CANONICAL: esc(sitio.landing.canonical),
  OG_TITLE: esc(sitio.landing.og.title),
  OG_DESCRIPTION: esc(sitio.landing.og.description),
  OG_IMAGE: esc(sitio.origen + sitio.landing.og.imagen),
  OG_IMAGE_W: String(sitio.landing.og.imagenAncho),
  OG_IMAGE_H: String(sitio.landing.og.imagenAlto),
  OG_IMAGE_ALT: esc(sitio.landing.og.imagenAlt),
  JSONLD_SERVICE: jsonLd(schemaService),
  JSONLD_FAQ: jsonLd(schemaFaq),
  WA_GENERAL: esc(waGeneral),
  PLANES: planes.planes.map(renderPlan).join('\n\n'),
  PLANES_MICROCOPY: esc(planes.microcopy),
  FAQ: renderFaq(),
  TELEFONO: esc(contacto.telefono),
  TEL_HREF: esc(contacto.telefonoTel),
  ORIGEN: esc(sitio.origen),
  RUTA_AVISO: esc(sitio.legales.avisoLegal),
  RUTA_PRIVACIDAD: esc(sitio.legales.privacidad),
  RUTA_COOKIES: esc(sitio.legales.cookies),
  ANIO: String(anio),
})));

writeFileSync(join(rutaLanding, 'index.html'), landing, 'utf8');
/* La documentación de las fotografías vive junto a los archivos para que quien
   las sustituya la encuentre, pero no tiene por qué publicarse. */
cpSync(join(raiz, 'src/assets'), join(rutaLanding, 'assets'), {
  recursive: true,
  filter: (origen) =>
    !origen.endsWith('.md') &&
    /* legal.css solo lo usan las páginas legales que genera el modo autónomo. */
    !(modoIntegrado && origen.endsWith('legal.css')),
});

/* ------------------------------------------------------------------ legal */

const datosLegalesCompletos = legal.legalDataComplete === true;

/**
 * Imprime un bloque solo si todos sus datos existen. Mientras falten, el
 * bloque desaparece por completo: nunca se publica un "[PENDIENTE: NIF]" ni
 * un hueco vacío en una página que tiene valor jurídico.
 */
function bloque(html, ...requeridos) {
  return requeridos.every((valor) => typeof valor === 'string' && valor.trim())
    ? html
    : '';
}

const dom = legal.domicilio;
const domicilioCompleto = [dom.via, dom.codigoPostal, dom.localidad, dom.provincia, dom.pais]
  .filter((parte) => typeof parte === 'string' && parte.trim())
  .join(', ');

const identificacion = [
  bloque(`          <dt>Titular</dt>\n          <dd>${esc(legal.razonSocial)}</dd>`, legal.razonSocial),
  bloque(`          <dt>NIF</dt>\n          <dd>${esc(legal.nif)}</dd>`, legal.nif),
  bloque(
    `          <dt>Domicilio</dt>\n          <dd>${esc(domicilioCompleto)}</dd>`,
    dom.via,
    dom.localidad,
  ),
  `          <dt>Teléfono</dt>\n          <dd><a href="${esc(contacto.telefonoTel)}">${esc(legal.telefono)}</a></dd>`,
  bloque(
    `          <dt>Correo</dt>\n          <dd><a href="mailto:${esc(legal.correos.general)}">${esc(legal.correos.general)}</a></dd>`,
    legal.correos.general,
  ),
  bloque(
    `          <dt>Registro Mercantil</dt>\n          <dd>${esc(
      [
        legal.registroMercantil.registro,
        legal.registroMercantil.tomo && `tomo ${legal.registroMercantil.tomo}`,
        legal.registroMercantil.folio && `folio ${legal.registroMercantil.folio}`,
        legal.registroMercantil.hoja && `hoja ${legal.registroMercantil.hoja}`,
        legal.registroMercantil.inscripcion &&
          `inscripción ${legal.registroMercantil.inscripcion}`,
      ]
        .filter(Boolean)
        .join(', '),
    )}</dd>`,
    legal.registroMercantil.registro,
  ),
]
  .filter(Boolean)
  .join('\n');

const avisoDesarrollo =
  modoDesarrollo && !datosLegalesCompletos
    ? `        <p class="aviso-desarrollo">
          <strong>Solo visible en desarrollo</strong>
          Los datos legales de <code>config/legal.json</code> están incompletos
          (<code>legalDataComplete: false</code>). Esta página se publica con
          <code>noindex,nofollow</code> y los bloques sin datos no se imprimen.
          Consulta la lista de pendientes en <code>docs/PENDIENTES-LEGALES.md</code>.
        </p>`
    : '';

const paginasLegales = [
  {
    ruta: sitio.legales.avisoLegal,
    titulo: 'Aviso legal',
    descripcion: 'Información legal de Dania360 y condiciones de uso del sitio.',
    cuerpo: `        <h2>Identificación del titular</h2>
${identificacion ? `        <dl>\n${identificacion}\n        </dl>` : ''}
        <h2>Objeto</h2>
        <p>
          Este sitio presenta los servicios de gestión de presencia digital que
          Dania360 ofrece a centros de estética, salones de belleza y negocios
          afines. Desde estas páginas no se realiza ninguna contratación ni
          ningún pago: el contacto se produce por WhatsApp o por teléfono, y las
          condiciones concretas se comunican por escrito antes de contratar.
        </p>

        <h2>Relación con Dania.ai</h2>
        <p>${esc(legal.daniaAi.relacion)}</p>
${bloque(
  `        <p>${esc(legal.daniaAi.identidadLegal)}</p>`,
  legal.daniaAi.identidadLegal,
)}

        <h2>Condiciones de uso</h2>
        <p>
          El acceso a este sitio es libre y gratuito. La persona usuaria se
          compromete a hacer un uso conforme a la ley y a no realizar
          actuaciones que puedan dañar el sitio o impedir su normal
          funcionamiento.
        </p>

        <h2>Propiedad intelectual e industrial</h2>
        <p>
          Los textos, el diseño, las marcas y los demás elementos de este sitio
          pertenecen a sus respectivos titulares. No se autoriza su reproducción
          sin consentimiento previo por escrito.
        </p>

        <h2>Responsabilidad</h2>
        <p>
          Dania360 no garantiza un número concreto de clientes, de reservas, de
          ventas ni una posición determinada en buscadores. La información
          publicada tiene carácter comercial e informativo y no constituye una
          oferta contractual vinculante.
        </p>
${bloque(
  `
        <h2>Legislación aplicable y jurisdicción</h2>
        <p>
          Esta relación se rige por la legislación española. Para cualquier
          controversia, las partes se someten a los juzgados y tribunales de
          ${esc(legal.jurisdiccion.ciudad)}, salvo que la normativa de consumo
          disponga otro fuero imperativo.
        </p>`,
  legal.jurisdiccion.ciudad,
)}`,
  },
  {
    ruta: sitio.legales.privacidad,
    titulo: 'Política de privacidad',
    descripcion: 'Cómo trata Dania360 los datos personales de quienes contactan.',
    cuerpo: `        <h2>Responsable del tratamiento</h2>
${identificacion ? `        <dl>\n${identificacion}\n        </dl>` : ''}
${bloque(
  `        <p>
          Contacto en materia de protección de datos:
          <a href="mailto:${esc(legal.correos.privacidad)}">${esc(legal.correos.privacidad)}</a>.
        </p>`,
  legal.correos.privacidad,
)}
${
  legal.dpd.designado
    ? bloque(
        `        <p>
          Delegado de Protección de Datos: ${esc(legal.dpd.nombre)} —
          <a href="mailto:${esc(legal.dpd.correo)}">${esc(legal.dpd.correo)}</a>.
        </p>`,
        legal.dpd.nombre,
        legal.dpd.correo,
      )
    : ''
}

        <h2>Qué datos tratamos y de dónde proceden</h2>
        <p>
          Únicamente los que la persona interesada nos facilita al escribirnos
          por WhatsApp o al llamarnos: nombre, teléfono, nombre del centro y lo
          que decida contarnos sobre su negocio. Estas páginas no incluyen
          formularios ni registro.
        </p>

        <h2>Para qué los usamos y con qué base legítima</h2>
        <ul>
          <li>
            Atender la solicitud de información y preparar una recomendación de
            plan, sobre la base de la aplicación de medidas precontractuales a
            petición de la persona interesada.
          </li>
          <li>
            Prestar y facturar el servicio si finalmente se contrata, sobre la
            base de la ejecución del contrato.
          </li>
          <li>
            Cumplir obligaciones legales, contables y fiscales.
          </li>
        </ul>

        <h2>Durante cuánto tiempo</h2>
        <p>
          Mientras dure la relación comercial y, después, durante los plazos de
          prescripción legalmente exigibles. Si la conversación no llega a
          convertirse en contrato, los datos se eliminan cuando dejan de ser
          necesarios.
        </p>

        <h2>Con quién los compartimos</h2>
        <p>
          Con los proveedores tecnológicos necesarios para prestar el servicio
          (mensajería, alojamiento, herramientas de publicación), que actúan
          como encargados del tratamiento con contrato firmado. No se venden ni
          se ceden datos a terceros con fines publicitarios.
        </p>
${bloque(
  `        <p>${esc(legal.daniaAi.rolProteccionDatos)}</p>`,
  legal.daniaAi.rolProteccionDatos,
)}

        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer los derechos de acceso, rectificación, supresión,
          oposición, limitación y portabilidad${bloque(
            ` escribiendo a <a href="mailto:${esc(legal.correos.privacidad)}">${esc(legal.correos.privacidad)}</a>`,
            legal.correos.privacidad,
          )}. También puedes presentar una reclamación ante la Agencia Española
          de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
        </p>

        <h2>WhatsApp</h2>
        <p>
          El botón de contacto abre una conversación en WhatsApp, un servicio de
          un tercero con sus propias condiciones y su propia política de
          privacidad. Al escribirnos por ese canal, el contenido de la
          conversación queda sujeto también a dichas condiciones.
        </p>`,
  },
  {
    ruta: sitio.legales.cookies,
    titulo: 'Política de cookies',
    descripcion: 'Qué cookies utiliza este sitio y cómo gestionarlas.',
    cuerpo: `        <h2>Qué son las cookies</h2>
        <p>
          Son pequeños archivos que un sitio guarda en el navegador para
          recordar información sobre la visita.
        </p>

        <h2>Qué usa esta página</h2>
        <p>
          La página <a href="${esc(sitio.landing.ruta)}">${esc(sitio.landing.ruta)}</a>
          no instala cookies propias ni de terceros por sí misma. No carga
          fuentes remotas, ni vídeos incrustados, ni bibliotecas externas: todos
          los recursos se sirven desde este mismo dominio.
        </p>
        <p>
          La página deja preparado un evento de medición para el momento en que
          se instale un gestor de etiquetas. Ese gestor todavía no está activo.
          Cuando se active, se publicará aquí el detalle de las cookies que
          incorpore y se solicitará el consentimiento previo cuando la normativa
          lo exija.
        </p>

        <h2>Cómo gestionarlas</h2>
        <p>
          Puedes bloquear o eliminar las cookies desde la configuración de tu
          navegador. Cada navegador ofrece instrucciones propias en su sección
          de ayuda.
        </p>

        <h2>Actualizaciones</h2>
        <p>
          Esta política se revisará cada vez que cambien las herramientas
          utilizadas en el sitio.
        </p>`,
  },
];

const plantillaLegal = leerTexto('src/templates/legal.html');

/*
 * En modo integrado no se generan: dania360.com ya publica /aviso-legal/,
 * /privacidad/ y /cookies/ desde su propio repositorio, y sobrescribirlas
 * destruiría textos que ya están en producción. La landing sigue enlazándolas.
 */
for (const pagina of modoIntegrado ? [] : paginasLegales) {
  const carpeta = join(salida, pagina.ruta.replace(/^\/|\/$/g, ''));
  mkdirSync(carpeta, { recursive: true });

  const html = rellenar(plantillaLegal, {
    TITULO: esc(pagina.titulo),
    DESCRIPCION: esc(pagina.descripcion),
    /* Mientras los datos legales no estén completos y revisados, estas páginas
       no deben aparecer en buscadores: una página legal incompleta indexada es
       peor que ninguna. */
    ROBOTS: datosLegalesCompletos ? 'index, follow' : 'noindex, nofollow',
    AVISO_DESARROLLO: avisoDesarrollo,
    ACTUALIZADO: `Última actualización: ${new Date().toISOString().slice(0, 10)}`,
    CUERPO: pagina.cuerpo,
    ORIGEN: esc(sitio.origen),
    RUTA_AVISO: esc(sitio.legales.avisoLegal),
    RUTA_PRIVACIDAD: esc(sitio.legales.privacidad),
    RUTA_COOKIES: esc(sitio.legales.cookies),
    ANIO: String(anio),
  });

  writeFileSync(join(carpeta, 'index.html'), html, 'utf8');
}

/* ---------------------------------------------------------------- sitemap */

/*
 * Se genera un sitemap propio en lugar de sobrescribir el de dania360.com, que
 * vive fuera de este proyecto. Quien despliegue tiene dos opciones, ambas
 * documentadas en el README: publicar este archivo y referenciarlo desde
 * robots.txt, o pegar el fragmento de `snippets/` dentro del sitemap existente.
 */
const urlsSitemap = [
  { loc: sitio.origen + sitio.landing.ruta, prioridad: '0.9', frecuencia: 'monthly' },
];

if (datosLegalesCompletos) {
  for (const pagina of paginasLegales) {
    urlsSitemap.push({
      loc: sitio.origen + pagina.ruta,
      prioridad: '0.1',
      frecuencia: 'yearly',
    });
  }
}

const hoy = new Date().toISOString().slice(0, 10);
const entradasSitemap = urlsSitemap
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${url.frecuencia}</changefreq>
    <priority>${url.prioridad}</priority>
  </url>`,
  )
  .join('\n');

/* En modo integrado el sitio ya tiene su propio sitemap.xml y su robots.txt:
   escribir otro al lado solo añadiría un archivo huérfano en el raíz web. */
if (!modoIntegrado) {
  writeFileSync(
    join(salida, 'sitemap-salones-estetica.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entradasSitemap}
</urlset>
`,
    'utf8',
  );
}

mkdirSync(join(raiz, 'snippets'), { recursive: true });
writeFileSync(
  join(raiz, 'snippets', 'sitemap-entrada.xml'),
  `<!-- Pegar dentro del <urlset> del sitemap actual de dania360.com -->
${entradasSitemap}
`,
  'utf8',
);

writeFileSync(
  join(raiz, 'snippets', 'robots-fragmento.txt'),
  `# Añadir al robots.txt existente de dania360.com.
# No sustituye al archivo actual: solo declara el sitemap de esta landing.
Sitemap: ${sitio.origen}/sitemap-salones-estetica.xml
`,
  'utf8',
);

/* ------------------------------------------------------------------ resumen */

const ctas = (landing.match(/data-cta-location="/g) || []).length;

console.log(`Landing generada en ${rutaLanding}`);
console.log(`  modo            ${modoIntegrado ? 'integrado (solo la landing)' : 'autónomo (landing + legales + sitemap)'}`);
console.log(`  ruta            ${sitio.landing.ruta}`);
console.log(`  planes          ${planes.planes.map((p) => `${p.nombre} ${p.precio} ${planes.moneda}`).join(' · ')}`);
console.log(`  preguntas       ${faq.preguntas.length} (acordeón + FAQPage)`);
console.log(`  CTA a WhatsApp  ${ctas}`);
console.log(
  `  fotografías     ${9 - fotosPendientes.length}/9 colocadas${
    fotosPendientes.length ? ` · pendientes: ${fotosPendientes.join(', ')}` : ''
  }`,
);
console.log(
  modoIntegrado
    ? '  páginas legales las publica dania360.com desde su propio repositorio'
    : `  páginas legales ${paginasLegales.length} · ${datosLegalesCompletos ? 'index' : 'noindex,nofollow (datos incompletos)'}`,
);
if (!datosLegalesCompletos) {
  console.log('  AVISO           faltan datos legales: no iniciar campañas. Ver docs/PENDIENTES-LEGALES.md');
}
