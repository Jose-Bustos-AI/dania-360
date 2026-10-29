# Excluir el aviso de cookies de los fragmentos de Google

## Evidencia y alcance

El 27 de octubre de 2026 se comprobó en Google la consulta sin marca y sin comillas `gestión de redes sociales para clínicas veterinarias`, con `hl=es`, `gl=es` y `pws=0`. La landing comercial apareció como tercer resultado web de la página 16 (`start=150`): puesto observado 153 por paginación. El fragmento acababa con «Si aceptas, ...», texto del aviso compartido de cookies, no de la oferta veterinaria.

La observación anterior de la misma consulta, el 21 de octubre, era 122. Son dos mediciones puntuales, no una posición universal ni prueba de una caída sostenida o de su causa. La cuenta y la ubicación de la búsqueda pueden seguir influyendo pese a `pws=0`. No se han vuelto a medir hoy las otras nueve consultas sectoriales.

Search Console aún terminaba el 24 de octubre, sin datos nuevos respecto a la revisión del día anterior. Con España, búsqueda Web y consultas que no contienen «dania», el período 18–24 de octubre suma 64 impresiones y 0 clics, frente a 74 y 0 del 1–7 de octubre. La posición media es 29,2 frente a 57,5: cambia la mezcla de consultas y no equivale al puesto puntual de la consulta veterinaria. No se atribuye causalidad al título de portada ni a este cambio aún sin publicar.

## Cambio propuesto

- Añadir el atributo booleano `data-nosnippet` al `section` del aviso en `analytics.js`, **antes** de insertar el elemento en el DOM.
- Actualizar la referencia del recurso a `/analytics.js?v=20261027-1` en las 30 páginas del sitemap, la política de cookies y las dos fuentes HTML existentes. No cambia ningún otro contenido de esos 33 archivos.
- Añadir una prueba aislada `npm run check:consent-snippet`, sin paquetes nuevos ni red.

Google documenta `data-nosnippet` en elementos `span`, `div` y `section`, y recomienda fijarlo antes de insertar contenido generado con JavaScript:

https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#data-nosnippet-attr

No se añade un `nosnippet` global, `noindex` ni contenido oculto. Se conservan el texto del aviso, su aspecto, el rol y etiqueta accesible, ambas opciones, el enlace a la política, la clave `dania360_consent_v2`, las elecciones guardadas y el bloqueo de Google/Meta hasta aceptar. Tampoco se cambian precios, H1, títulos, descripciones, schema, canonicals, fechas editoriales ni sitemap. La política de cookies conserva su `noindex,follow` previo.

## Comprobaciones

- 11 pruebas de consentimiento: atributo desde la inserción, mismas opciones, denegación inicial, aceptación, rechazo, elecciones guardadas, DOMContentLoaded, almacenamiento bloqueado, retirada y clic de WhatsApp condicionado al consentimiento; versión del recurso en las 33 páginas/fuentes.
- `npm run check:site-seo`: 30 URLs y 15 pruebas de la herramienta de comercios.
- `node tools/check-sector-seo.mjs`: 10/10 landings.
- `node tools/check-five-sector-offers.mjs`: 5/5 ofertas.
- `git diff --check` y comparación de los 33 HTML con HEAD descontando únicamente el nuevo identificador de caché.
- Navegador de escritorio, viewport real 1280 × 720: aviso visible, dos botones, rechazo y recarga sin proveedores, reapertura desde la política.
- Breakpoint de 390 × 844 mediante iframe local: sin desbordamiento horizontal; aviso de 343 px y dos botones visibles de 149,5 × 38 px. Rechazo por teclado y recarga sin proveedores. La API de viewport del navegador no aplicó la reducción de la ventana, por lo que esta comprobación no se presenta como emulación de un dispositivo físico.
- La aceptación se verificó en VM sin red; no se aceptaron etiquetas en producción ni se generaron eventos de medición de QA.

Capturas y mediciones completas quedan en el directorio local de resultados `outputs/seo-consent-snippet-20261027/`, fuera del repositorio. El fixture de prueba adaptativa se retiró al terminar.

## Publicación y verificación posterior

La PR queda abierta, sin fusionar ni desplegar. No incluye ni publica las PR pendientes #98 y #105. Después de una aprobación y despliegue habrá que comprobar el recurso público y la presencia del atributo en el DOM; tras un nuevo rastreo de Google se podrá volver a revisar el fragmento. No se garantiza un fragmento concreto, una fecha de actualización ni una mejora de posiciones.
