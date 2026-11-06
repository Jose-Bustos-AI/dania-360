# Murcia: aclarar dónde se atiende antes de pedir una visita

La guía local recomendaba mantener datos coherentes, pero no demostraba cómo distinguir una dirección administrativa de un punto de atención al público. La landing de Murcia tampoco enlazaba a un ejemplo que resolviera esa duda.

## Cambio

- Ejemplo original expresamente ficticio en la guía existente: negocio que trabaja a domicilio, cobertura confirmada y solicitud desde otra zona. No representa clientes ni la cobertura de Dania360.
- Tabla con las decisiones que se deben validar en Google, biografía, web, publicación y primera respuesta; revisión de destinos y ficha editable TXT.
- Enlace contextual desde la información local de Murcia e incorporación al índice de la guía. Se conserva el enlace previo de la guía a Murcia.
- El enlace a precios deja de anunciar una comparativa que la página de destino ya no contiene y describe el precio y alcance de Growth.
- Solo se actualizan la fecha real de modificación de la guía y las dos entradas afectadas del sitemap. No hay URL comercial nueva.

## Investigación

Consulta realizada el 6 de noviembre de 2026. Intención comercial local: gestión de redes sociales en Murcia. Se contrastaron los procesos visibles de Bootik y Vibras Marketing; no se copian sus prestaciones, casos ni promesas de visitas o producción presencial.

Fuentes primarias:

- https://www.bootik.es/gestion-redes-sociales-murcia/
- https://www.vibrasmarketing.es/servicios/redes-sociales/
- https://support.google.com/business/answer/9157481?hl=es

Search Console, España, Web, URL exacta y exclusión regex de marca: del 8 de octubre al 4 de noviembre frente al 10 de septiembre al 7 de octubre. Cero clics en ambos periodos; cero impresiones actuales frente a dos anteriores, estas últimas de ordenador para gestion redes sociales murcia, con posición media 76,5. La posición actual no es calculable sin impresiones; el cero de la interfaz no es un puesto. Muestra insuficiente para atribuir cambios o concluir desindexación. La primera página de Google con hl=es, gl=es y pws=0 no mostró la landing entre los resultados orgánicos revisados. No se obtuvo un puesto exacto ni se concluye que esté fuera del top 100.

## Validación

- Comprobación SEO del sitio: 121 URL correctas.
- Comprobación de las diez sectoriales originales: correcta.
- Título, H1, descripción y canonical idénticos a main en ambas páginas. FAQ y ofertas de Murcia intactas; en JSON-LD solo cambia dateModified del Article de la guía.
- Cero comillas en la prosa visible de ambas páginas y en el TXT. Sin cambios de precios, prestaciones, identidad, logo ni portada.
- Inspección visual en navegador integrado de escritorio y móvil de 390 × 844. Sin desbordamiento horizontal de página. La tabla se desplaza dentro de su contenedor y responde al teclado.
- Navegación desde la landing al apartado correcto; ancla visible bajo la cabecera. TXT servido con HTTP 200, tipo texto y bytes idénticos al archivo de la rama.
- git diff --check correcto.

Evidencias completas en el workspace, outputs/seo-murcia-20261106. Revisión local con proveedores externos bloqueados solo para QA; no acredita rendimiento de campo ni mejora de posiciones.

Pendiente de aprobación específica para fusionar y publicar.
