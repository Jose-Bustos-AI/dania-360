# Restaurantes: mantener vigente un menú publicado

La landing enlaza la tarjeta Carta y propuesta con un ejemplo de la guía existente. Un menú ficticio de mediodía cambia el jueves y termina el viernes. La tabla explica la confirmación del restaurante, la corrección de los destinos y la retirada de las piezas caducadas. La consulta por redes sigue separada de una reserva confirmada.

Se mantienen título, H1, metadescripción, canonical, ofertas y FAQ de ambas páginas. La guía recibe la ampliación real y su fecha visible, Article, Open Graph y lastmod corresponden al 3 de noviembre. La prosa se revisa sin comillas. No se añade una página que compita con la landing, ni imágenes, proveedores o nuevas funciones JavaScript.

El enlace se reproduce en el código React y en el HTML estático. El build inserta las hojas locales con su versión y conserva el script de consentimiento publicado. Los avisos de Vite sobre las hojas compartidas no resueltas durante el empaquetado son los esperados: el prerender las incorpora y la prueba de sincronización pasa. El JavaScript de cliente conserva su contenido; cambia el nombre del asset al cambiar el build.

## Validación del 3 de noviembre

Build, ESLint y ocho pruebas existentes de controles y estilos correctos. Controles de las 51 URLs, las diez landings originales y las cinco ofertas correctos. Revisión visual a 1280×900 y 390×844. El enlace abre el apartado correcto con clic en ambos anchos. Documento sin desbordamiento global; tabla de 620 px dentro de 343 px en móvil y desplazamiento con teclado de 40 px. Consola sin errores.

Evidencias privadas: outputs/seo-visibility-20261103/restaurant-validation.json, restaurant-browser-checks.json y capturas de escritorio y móvil. La limitación de captura que mantuvo la PR como borrador el 31 de octubre está resuelta. La validación no mide Core Web Vitals ni prueba puestos en Google o resultados enriqueccidos.

Profesional Horeca recibió el artículo el 31 de octubre según el registro editorial. No se repite ni se envía un seguimiento antes de plazo. No se cuenta como enlace sin verificar una publicación.

Pendiente de aprobación específica antes de fusionar y desplegar.
