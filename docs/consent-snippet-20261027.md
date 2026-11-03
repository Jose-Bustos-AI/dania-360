# Excluir el aviso de cookies de los fragmentos de búsqueda

Revisión actualizada el 3 de noviembre de 2026. El nombre del archivo conserva la fecha inicial de preparación.

El 27 de octubre se observó texto del aviso de cookies en el fragmento de la landing veterinaria. Es una evidencia histórica; no se presenta como fragmento o posición actual. La captura de Google y los datos de aquella revisión permanecen en outputs/seo-consent-snippet-20261027 del workspace.

Se añade data-nosnippet únicamente al section del aviso antes de incorporarlo al DOM, de acuerdo con la documentación de Google. No se excluyen el servicio, la oferta ni la página completa. No cambian H1, títulos, metadescripciones, canonical, datos estructurados, contenido comercial ni fechas editoriales.

Fuente oficial: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#data-nosnippet-attr

La referencia de analytics.js usa la versión 20261103-snippet en las 51 páginas del sitemap, la política de cookies, las dos fuentes HTML y el generador de ampliación sectorial. La comparación contra main confirma que esa referencia es el único cambio en esos 55 archivos. El sitemap conserva su contenido y fechas.

La clave de consentimiento, las elecciones guardadas, el texto, los botones, sus estilos y la carga de Google y Meta se conservan. Sin aceptación no se cargan proveedores. El cambio no mejora las cifras de medición ni convierte un clic en contacto o venta.

Validación actual:
- Once pruebas existentes de consentimiento, con aceptación y rechazo simulados sin red.
- Comprobadores de 51 URLs, diez sectoriales originales, cinco ofertas y veinte páginas del generador.
- Generación sectorial con conservación del contenido y las fechas.
- Navegador local a 1280 y 390 píxeles reales. El atributo está presente en el section y el documento no se desborda.
- En móvil el aviso mide 343 píxeles y muestra ambos botones. Rechazo por teclado y recarga sin aviso ni etiquetas externas.
- Reapertura desde la política de cookies verificada en el entorno local. No se modifica el consentimiento de producción ni se aceptan proveedores para generar eventos de prueba.

La revisión del navegador bloquea proveedores externos solo en QA. El cambio requiere aprobación específica antes de fusionar y publicar. Tras el despliegue se debe verificar el recurso público y el atributo en el DOM. Un nuevo rastreo será necesario para evaluar el fragmento de Google; no se garantiza su redacción ni una mejora de posiciones.
