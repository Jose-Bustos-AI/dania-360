# Landings sectoriales

Fuentes y generación de las landings de ampliación. Generar archivos no implica publicación ni indexación.

- `pages.json` contiene metadatos, preguntas visibles, investigación y recursos propios.
- `content/` contiene el cuerpo escrito por separado para cada sector. No se sustituye el nombre del oficio dentro de un texto común.
- `art/` contiene ilustraciones SVG originales: esquemas conceptuales, nunca fotografías de obras o resultados de clientes.
- `groups.json` define las áreas del catálogo. Solo aparecen los grupos con páginas existentes; un grupo vacío no crea tarjetas ni enlaces. Las páginas 11 a 20 conservan el grupo de oficios por defecto. Las siguientes deben declarar `hubGroup` con un identificador de ese archivo.
- `catalog.mjs` comprueba identificadores, rutas, grupos, fechas y presentación del recurso antes de generar los archivos. Una configuración incorrecta debe fallar antes de escribir salidas.
- `build.mjs` comparte únicamente navegación, identidad, precio y alcance oficial de Growth, FAQ y pie. Lee los planes de `landing-src/config/planes.json`.
- `contentModified` indica la fecha real del contenido de cada página. Se revisa al hacer un cambio sustantivo; regenerar no debe cambiarla por la fecha del día. El índice usa la fecha más reciente de las páginas que reúne.
- `styles.css` define componentes editoriales que cada cuerpo combina según su contenido.
- `sectores.js` es el JavaScript compartido de las landings (sin librerías). Se copia a `/sectores/sectores.js` y, como el CSS, se enlaza con `?v=` y un hash de su contenido.

## Plantilla común de cada landing

`build.mjs` añade a todas las páginas, sin tocar sus textos SEO:

- Migas Inicio / Gestión de redes sociales (`/gestion-redes-sociales/`) / sector, visibles y en el `BreadcrumbList`.
- `WebPage.dateModified` igual a `contentModified`.
- Botón flotante `.wa-float` con mensaje propio del sector (`p.name`), que aparece al dejar atrás los botones del hero y se aparta en la llamada final y el pie. Los botones principales de WhatsApp llevan el icono.
- Barra de progreso de lectura.
- Un móvil vivo en el hero, marcado como "Ejemplo ilustrativo": tres publicaciones que se turnan y un chat de WhatsApp que se escribe solo.
- Marcador con las cifras oficiales de Growth leídas de `landing-src/config/planes.json` (publicaciones al mes, redes, cuota y permanencia). No son resultados.
- Sectores relacionados: hasta seis páginas siguientes del mismo grupo, en orden circular, sin incluirse a sí misma. Los grupos con menos de cinco páginas se completan hasta cuatro con `relatedFallback` de `catalog.mjs`. Debajo, enlaces al pilar, a precios y a `/sectores/`.

### Campos opcionales del hero en `pages.json`

- `heroPosts`: tres textos cortos (máximo 110 caracteres) para las publicaciones del móvil. Se muestran como Instagram, Facebook y TikTok.
- `heroChat`: objeto con `question` (mensaje del cliente) y `answer` (respuesta del negocio), máximo 200 caracteres cada uno.

Si faltan, se usan `promise`, `resourceTitle` y una publicación genérica, y un chat genérico. Son ejemplos: nunca nombres de clientes, mensajes reales, testimonios ni resultados. Comillas normales, nunca angulares.

### Movimiento y modo calma

Con movimiento normal: entrada escalonada del hero, apariciones al hacer scroll, contadores, inclinación de tarjetas con ratón, pulso del flotante, flotación suave del móvil, publicaciones que se deslizan y un resaltado que recorre listas y pasos del contenido. Los bucles solo corren con su bloque en pantalla.

Con `prefers-reduced-motion: reduce` no hay desplazamientos, zooms ni inclinación, pero la página no queda plana: fundidos, chat que se escribe, contadores, publicaciones que se turnan por fundido, resaltado de listas y pulso por color. No añadas una regla global que anule todas las animaciones; `check.mjs` la rechaza.

Sin JavaScript todo se ve: las apariciones y el flotante oculto dependen de la clase `js` en `html`, que pone un script en línea y se retira si `sectores.js` no llega a ejecutarse.

Los recursos existentes conservan su descripción y su presentación. Si un nuevo descargable es un ejemplo completo en vez de una ficha en blanco, la página debe declarar `resourcePresentation` con los tres campos: `description`, `linkLabel` y `documentSubtitle`. La descripción visible, el botón y el encabezado del archivo deben corresponder al contenido real. Todos los archivos TXT conservan la marca UTF-8 para que las tildes se lean correctamente también en servidores sin charset explícito.

Generar con `node sector-pages-src/build.mjs`. Verificar con `node sector-pages-src/check.mjs` y los verificadores existentes de `landing-src/tools/`. Inspeccionar además escritorio y móvil real de 390 píxeles: un chequeo estático no sustituye esa revisión.

La portada conserva su H1 y VSL. El índice `/sectores/` enlaza solo a páginas que existen en el repositorio. No se publican las otras candidatas del catálogo de cien.

La investigación es cualitativa, fechada y verificable por URL. No disponemos de volúmenes verificados para estas consultas. No se ofrecen puestos en Google ni apariciones garantizadas en respuestas de IA.
