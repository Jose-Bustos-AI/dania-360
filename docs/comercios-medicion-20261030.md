# Comercios: distinguir un clic, una consulta y una venta

## Problema y mejora

La guía existente enumera métricas y ya tiene una ficha editable de publicación. No se vuelve a presentar esa herramienta como novedad. Faltaba un ejemplo completo que enseñara a interpretar registros que se solapan: un clic a WhatsApp no es una conversación ni una venta, y las reservas o recogidas pueden pertenecer a conversaciones ya contadas.

Se amplía la misma guía con un ejemplo didáctico de una reposición de tazas. Las cifras se identifican como inventadas. No representan clientes, resultados de Dania360 ni una mejora medida de posición. La tabla diferencia clics, conversaciones, reservas, recogidas y compras de origen desconocido; termina con decisiones sobre información de producto y seguimiento sin datos personales en el informe.

## Arquitectura y alcance

- Un enlace contextual desde la respuesta de ejemplo en la landing lleva al nuevo apartado de la guía.
- El índice de la guía permite ir al apartado. Se conservan sus enlaces existentes de vuelta al servicio y a Growth, sin otra landing ni anclas nuevas repetidas en todo el sitio.
- Sin cambios de H1, títulos, metadescripciones, precios, planes, identidad, consentimiento o scripts. Se retiran las comillas de la prosa.
- Se reutilizan la tabla y estilos existentes: cero JavaScript, dependencias, peticiones o CSS nuevos.
- Fecha de modificación de esta guía alineada en texto visible, Article, Open Graph y sitemap con la revisión real del 3 de noviembre; el resto de páginas conserva sus fechas.
- No se añade schema que sugiera resultados comerciales ni casos reales. Las FAQ existentes se conservan.

## Estado histórico y revisión del 3 de noviembre

El borrador del 30 de octubre quedó sin la comprobación visual por la caída del navegador. Esta revisión actualiza la rama sobre main 95081b8 y conserva las publicaciones posteriores, incluida la versión nueva de analytics.js. La revisión actual de fondo elimina las comillas de la landing y guía y alinea la fecha real de modificación de la guía.

El estado editorial inicial quedó superado: el registro de la rotación documenta el envío del artículo corregido a Retail Actual el 30 de octubre. En esta continuación no se reenvía ni se presenta como nuevo artículo o contacto. Tampoco se cuenta como enlace sin verificar una URL publicada.

La publicación web continúa pendiente de aprobación específica. Se han completado las comprobaciones de escritorio y móvil para pasar el borrador a revisión.

## Skills y validación

seo-audit: no atribuir el ranking a una causa sin datos; no cambiar títulos correctos por cuota. site-architecture: ampliar el recurso existente y enlazar el punto que resuelve una duda concreta. schema: solo contenido visible; JSON y correspondencia revisados por los checks existentes. No existe un ejecutable validate_schema en la skill instalada. No se ha realizado una prueba oficial de resultados enriquecidos.

programmatic-seo no requiere una nueva plantilla: no se está generando una serie de páginas. La decisión es una ampliación específica de un recurso existente.

## Validación cerrada el 3 de noviembre

Controles de las 51 URLs, diez landings, cinco ofertas y quince pruebas de la ficha correctos. H1, title, descripción y canonical comparados con main, sin cambios. Sin estilos o scripts nuevos. La prueba existente comprueba coherencia de las fechas en lugar de fijar un día arbitrario.

Capturas inspeccionadas a 1280×900 y 390×844. Sin desbordamiento del documento; tabla desplazable por teclado. El enlace contextual abre el apartado correcto con clic en escritorio y Enter en móvil. El clic automatizado sobre ese texto en línea repartido en varias líneas no produjo navegación en móvil; se registra la limitación sin cambiar el diseño para acomodar la prueba. Consola sin errores.

Evidencias privadas: outputs/seo-visibility-20261103/retail-validation.json, retail-browser-checks.json y capturas de escritorio y móvil. No se deducen puestos, conversiones reales ni rendimiento de campo de estos controles. La publicación sigue pendiente de aprobación específica.
