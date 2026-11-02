# Landings sectoriales de oficios

Preparación del primer lote de ampliación. No implica publicación ni indexación.

- `pages.json` contiene metadatos, preguntas visibles, investigación y recursos propios.
- `content/` contiene el cuerpo escrito por separado para cada sector. No se sustituye el nombre del oficio dentro de un texto común.
- `art/` contiene ilustraciones SVG originales: esquemas conceptuales, nunca fotografías de obras o resultados de clientes.
- `build.mjs` comparte únicamente navegación, identidad, precio y alcance oficial de Growth, FAQ y pie. Lee los planes de `landing-src/config/planes.json`.
- `contentModified` indica la fecha real del contenido de cada página. Se revisa al hacer un cambio sustantivo; regenerar no debe cambiarla por la fecha del día. El índice usa la fecha más reciente de las páginas que reúne.
- `styles.css` define componentes editoriales que cada cuerpo combina según su contenido.

Generar con `node sector-pages-src/build.mjs`. Verificar con `node sector-pages-src/check.mjs` y los verificadores existentes de `landing-src/tools/`. Inspeccionar además escritorio y móvil real de 390 píxeles: un chequeo estático no sustituye esa revisión.

La portada conserva su H1 y VSL. El índice `/sectores/` enlaza solo a páginas que existen en el repositorio. No se publican las otras candidatas del catálogo de cien.

La investigación es cualitativa, fechada y verificable por URL. No disponemos de volúmenes verificados para estas consultas. No se ofrecen puestos en Google ni apariciones garantizadas en respuestas de IA.
