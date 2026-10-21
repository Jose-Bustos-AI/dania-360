# Comercios: ficha utilizable, no otra landing

## Problema y decisión

El rastreo público de las 30 páginas del sitemap confirma que las cinco landings prioritarias están a un clic de la portada. No se encontraron fragmentos internos rotos ni IDs duplicados. Comercios recibe enlaces de 13 páginas del rastreo, ocho desde el contenido principal. No hay evidencia para atribuir su posición a falta de enlaces internos.

La guía existente explicaba stock, precio y contacto, pero carecía de una ficha editable o descargable para aplicar ese proceso. Se añade un recurso operativo propio del comercio, en esa misma URL; no otra página con la misma palabra clave. La landing enlaza la herramienta desde sus ejemplos y esta vuelve al alcance de Growth. Esta es una hipótesis de utilidad y diferenciación, no una garantía de ranking.

Search Console, comprobado de nuevo en la cuenta Dania360: España, Web, consulta que no contenga «dania», 28 días. Sigue mostrando el período 22/09–19/10, anterior a las publicaciones del 21/10. Sus 234 impresiones, 0 clics y posición media 35,5 son del informe filtrado del sitio, con aviso de datos parciales; no prueban un efecto de estas mejoras ni son puestos puntuales.

## Implementación

- Ficha que combina producto, detalle útil, destino del contacto, stock, precio e imagen. No consulta inventario, sincroniza catálogo ni publica en redes.
- Si el stock está pendiente o agotado, el precio pendiente, o no se confirma imagen/contacto, devuelve tareas pendientes y no un anuncio de disponibilidad.
- El borrador usa solo los datos declarados. No inventa precios, descuentos, urgencia, testimonios, resultados ni disponibilidad.
- Descarga TXT local. Sin APIs, paquetes nuevos, almacenamiento ni transmisión de campos. El consentimiento y la analítica del sitio no se modifican.
- Al cambiar cualquier dato se ocultan el resultado y el enlace de descarga anterior, y se revoca su URL temporal.
- Plantilla en texto y estructura HTML disponibles sin JavaScript. El formulario arranca oculto y solo se habilita si se inicializa, evitando un GET accidental de los campos si el módulo no carga.
- FAQ de la guía alineadas literalmente con las preguntas y respuestas ya visibles; no se cambian las FAQ visibles ni se prometen resultados enriquecidos.
- Article.dateModified, fecha visible, Open Graph y lastmod de la guía coinciden con la revisión real del 21/10. No se refecha el resto del sitio.
- H1, title, descripción y canonical de guía y landing conservados, igual que los precios oficiales y las otras nueve landings. La PR #98 no se toca.

## Comprobación

- 15 pruebas Node: límites, opciones inválidas, precio contradictorio, stock sin comprobar/agotado, controles pendientes, texto sin precio inventado, contenido como texto, alternativa sin scripts, FAQ/JSON-LD y presupuesto de assets.
- Checks generales: 30 páginas del sitemap, diez landings y cinco resúmenes Growth.
- Navegador real: ficha pendiente y borrador con datos confirmados; descarga de TXT abierta y verificada; invalidación de resultado y enlace tras cambiar un dato.
- Anchos 320, 390, 768 y 1365: sin desbordamiento del documento ni imágenes rotas. Sin errores de consola en la versión con scripts.
- Servidor local temporal con CSP `script-src 'none'`: formulario oculto, plantilla descargable y estructura desplegable presentes y utilizables.
- No se ha medido una nueva subida en Google. No se repiten solicitudes de indexación enviadas hoy para las cinco landings.

## Criterios de las skills

`seo-audit` descarta primero problemas de rastreo/enlaces observables. `site-architecture` mantiene el recorrido landing → recurso → servicio sin crear un huérfano. `programmatic-seo` orienta la mejora hacia una utilidad propia del sector en vez de duplicar páginas. `schema` exige correspondencia con lo visible; su validador específico no está disponible, así que se comprueban JSON, propiedades y correspondencia con pruebas locales. Eso no equivale a un test oficial de rich results ni a una certificación legal.

Referencias: [contenido útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [enlaces rastreables](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [coherencia de datos estructurados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
