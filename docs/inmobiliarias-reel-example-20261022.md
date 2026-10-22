# Inmobiliarias: muestra editorial de 15 segundos

## Motivo y alcance

La búsqueda sin marca «gestión de redes sociales para inmobiliarias» en Google, con `hl=es`, `gl=es` y `pws=0`, devuelve servicios comerciales y guías. La landing ya cubre ambas necesidades y enlaza a la guía de captación. No se ha demostrado un problema de indexación, rendimiento o arquitectura que justifique otra página o cambiar de nuevo el H1.

La tarjeta «Recorrido con criterio» tenía un símbolo de reproducción sin vídeo. Esta revisión lo sustituye por una referencia explícita a un guion y añade una muestra editorial original, visible en HTML: tres escenas contiguas que suman los 15 segundos de Growth. El visitante puede comprobar qué material debe aportar y qué alcance tiene ese formato. Es una hipótesis de mejora de utilidad y claridad comercial, no una garantía ni una causa demostrada de posiciones.

- Se mantienen el H1, título, descripción, canonical, precios y alcance de Growth, incluida la web con bot de IA.
- Se añade una lista de material descargable en texto, sin nuevas imágenes, vídeos, JavaScript ni peticiones de terceros.
- La guía existente enlaza al ejemplo en su contexto; no se crean landings repetidas.
- El ejemplo no se presenta como una vivienda disponible, un trabajo de cliente ni un resultado real. Requiere comprobar permisos, datos y disponibilidad.
- No se añade `VideoObject`: no hay un vídeo reproducible. `WebPage.dateModified` y el `lastmod` de la landing reflejan la modificación editorial del 22 de octubre. La guía solo recibe un enlace y conserva su fecha.

## Evidencia de rendimiento de búsqueda

Lectura directa de Search Console el 22 de octubre de 2026: España, búsqueda Web y consultas que no contienen «dania». El informe de 28 días todavía termina el 19 de octubre, antes de las mejoras publicadas el día 21. No se mide todavía el efecto de esas mejoras.

Comparación de semanas completas: 9–15 de octubre frente a 1–7 de octubre, excluyendo el día 8 en que se cambió el título de la portada. Search Console avisa de que los resultados filtrados pueden ser parciales.

| Dimensión | 9–15 octubre | 1–7 octubre |
| --- | ---: | ---: |
| Ordenador: impresiones / clics / posición media | 28 / 0 / 22 | 56 / 0 / 56,8 |
| Móvil: impresiones / clics / posición media | 14 / 0 / 38,6 | 18 / 0 / 59,8 |
| Portada, URL exacta: impresiones / clics | 0 / 0 | 0 / 0 |
| `/gestion-redes-sociales/`, URL exacta: impresiones / clics | 0 / 0 | 0 / 0 |

Las posiciones son medias históricas del conjunto de consultas observado, no puestos puntuales. Las muestras son pequeñas y cambian las consultas que generan impresiones. La posición «0» que muestra la interfaz sin impresiones no es una posición real. No hay evidencia en estas semanas de que portada y servicios compitan por una misma consulta; tampoco se deduce desindexación o estar fuera del top 100 por no tener filas.

Ejemplos de consultas observadas: «contenido para dentistas» (10 frente a 9 impresiones), «redes sociales clinica dental» (9 frente a 4), «redes sociales para abogados» (8 frente a 1) y «redes sociales clínicas veterinarias» (3 frente a 7). No se atribuye su variación al título de la portada ni al despliegue del día 21.

El análisis móvil de PageSpeed de la inmobiliaria, anterior a este cambio y generado el 21 de octubre a las 23:59 CEST, dio 98 en rendimiento, LCP de laboratorio de 1.808 ms y CLS 0. No tiene datos CrUX suficientes y no equivale a una evaluación de campo ni a una posición en Google. No se hacen cambios cosméticos de rendimiento para perseguir una puntuación de 100.

## Verificación

- `npm run check:site-seo`: revisión de 30 páginas y 20 pruebas (15 de la ficha de comercios y 5 del guion inmobiliario).
- `node landing-src/tools/check-sector-seo.mjs`: 10 landings.
- `node landing-src/tools/check-five-sector-offers.mjs`: 5 landings y coherencia de Growth.
- `git diff --check`.
- Vista local real de escritorio a 1.280 px: tres escenas en columnas; `scrollWidth === clientWidth`.
- Vista local real móvil a 320 px: una columna, textos legibles y sin desbordamiento horizontal (`scrollWidth === clientWidth`, 305 px útiles).
- Ancla probada por teclado. La ruta TXT devuelve HTTP 200, `text/plain`, 1.387 bytes, y coincide exactamente con el archivo local. El enlace tiene `download` y el destino correcto. La interfaz automatizada no entregó un evento de descarga; no se da por verificada la recepción del archivo en la carpeta del navegador.
- Capturas en `outputs/seo-five-sectors-20261021/inmobiliarias-guion-escritorio.png` e `inmobiliarias-guion-movil.png` del workspace de auditoría (no se añaden imágenes pesadas al repositorio).

## Publicación

Preparado en la rama aislada `codex/inmobiliarias-reel-example-20261022`, basada en `f576331`. Debe quedar en una PR revisable: esta ejecución diaria no autoriza fusionar ni desplegar automáticamente. No se envía otra solicitud de indexación antes de publicar ni se repiten las aceptadas el 21 de octubre.
