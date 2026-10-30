# Comercios: distinguir un clic, una consulta y una venta

## Problema y mejora

La guía existente enumera métricas y ya tiene una ficha editable de publicación. No se vuelve a presentar esa herramienta como novedad. Faltaba un ejemplo completo que enseñara a interpretar registros que se solapan: un clic a WhatsApp no es una conversación ni una venta, y las reservas o recogidas pueden pertenecer a conversaciones ya contadas.

Se amplía la misma guía con un ejemplo didáctico de una reposición de tazas. Las cifras se identifican como inventadas. No representan clientes, resultados de Dania360 ni una mejora medida de posición. La tabla diferencia clics, conversaciones, reservas, recogidas y compras de origen desconocido; termina con decisiones sobre información de producto y seguimiento sin datos personales en el informe.

## Arquitectura y alcance

- Un enlace contextual desde la respuesta de ejemplo en la landing lleva al nuevo apartado de la guía.
- El índice de la guía permite ir al apartado. Se conservan sus enlaces existentes de vuelta al servicio y a Growth, sin otra landing ni anclas nuevas repetidas en todo el sitio.
- Sin cambios de H1, títulos, metadescripciones, precios, planes, identidad, consentimiento o scripts.
- Se reutilizan la tabla y estilos existentes: cero JavaScript, dependencias, peticiones o CSS nuevos.
- Fecha de modificación de esta guía alineada en texto visible, Article, Open Graph y sitemap con la redacción real del 30/10. Si se publica tras otra revisión en otra fecha, actualizarla solo con una revisión real; no re-fechar el resto del sitio.
- No se añade schema que sugiera resultados comerciales ni casos reales. Las FAQ existentes se conservan.

## Límites de esta sesión

La sesión empezó con fallos de resolución de github.com y de conexión en Gmail y búsqueda web. El 30/10 a las 09:25 de Madrid volvió el acceso a GitHub: origin/main es afd78cc y su diferencia respecto a la base inicial f576331 solo afecta a .htaccess (enlace /ver). No hay cambios remotos de este alcance. Las PR #98, #105 y #106 siguen abiertas. Se actualiza esta rama sobre ese main antes de abrir el borrador.

El navegador sigue devolviendo «Codex app tool request failed». El conector Gmail identifica la cuenta personal bustosalmeria@gmail.com: no se lee su bandeja ni se usa como remitente. Sin navegador de la cuenta Dania360 no se puede revisar el historial editorial ni confirmar un envío sin duplicarlo. El artículo queda preparado fuera del repositorio, sin destinatario confirmado ni envío. No se han solicitado indexaciones, desplegado ni medido posiciones o rendimiento nuevos.

La PR se abre como borrador: faltan la revisión visual en escritorio y ancho móvil real, la comprobación pública y los datos actuales de Search Console. Los controles locales de las 30 URLs, las diez landings, las cinco ofertas Growth y las 15 pruebas de la ficha pasan. Una prueba tenía fijada la fecha 21/10; se conserva la comprobación y se mejora para exigir coherencia entre fecha visible, Article, Open Graph y sitemap en vez de congelar un día. No se añaden pruebas nuevas para esta edición de contenido.

No fusionar ni desplegar este borrador sin la revisión pendiente y aprobación específica. La autorización de publicación de la web sigue pendiente. El borrador editorial tampoco acredita un enlace conseguido.

## Skills y validación

seo-audit: no atribuir el ranking a una causa sin datos; no cambiar títulos correctos por cuota. site-architecture: ampliar el recurso existente y enlazar el punto que resuelve una duda concreta. schema: solo contenido visible; JSON y correspondencia revisados por los checks existentes. No existe un ejecutable validate_schema en la skill instalada. No se ha realizado una prueba oficial de resultados enriquecidos.

programmatic-seo no requiere una nueva plantilla: no se está generando una serie de páginas. La decisión es una ampliación específica de un recurso existente.
