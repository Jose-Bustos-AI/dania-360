# Veterinarias: de una idea de calendario a un guion producible

## Problema y cambio

La landing y la guía ya ofrecen un calendario, tres textos y una herramienta de respuestas. No faltaba otro calendario: faltaba enseñar cómo se transforma la idea de primera visita en un vídeo de 15 segundos que un centro pueda preparar y aprobar. Esta ampliación añade cuatro planos cronometrados, texto en pantalla, locución, pie de publicación y revisión operativa. Es un guion, no un vídeo grabado ni un caso de cliente.

El ejemplo se limita a entrada, recepción y canal de cita. No incorpora diagnósticos, tratamientos, pacientes, promesas de resultados ni disponibilidad inmediata. El centro valida los datos y confirma las citas; Growth mantiene su alcance de 297 €/mes con web y bot, sin nuevas prestaciones.

## Intención y decisión editorial

La búsqueda en Google España, sin marca, muestra proveedores sectoriales como [Veterclick](https://veterclick.com/gestion-de-redes-sociales-para-veterinarias/), [Marveting](https://marveting.com/servicios/redes-sociales/) y contenido de [MKVET](https://www.mkvet.es/kit-digital-redes/). El recorrido mezcla contratación y dudas sobre planificación/contenidos. La hipótesis de esta mejora es facilitar que un responsable de clínica evalúe una muestra concreta del trabajo, sin copiar textos ni atribuirse la experiencia o resultados que anuncian otros proveedores.

Se amplía la guía existente y se enlaza el guion desde la tarjeta Primera visita de la landing. El nuevo apartado conecta con la herramienta de mensajes ya disponible. El índice permite localizarlo y la guía conserva sus retornos al servicio. No se crea una URL competidora, ni se concluye canibalización sin consultas compartidas.

## Alcance técnico y datos estructurados

- H1, title y metadescripción de la landing comercial conservados; precios y ofertas conservados.
- Metadescripción y Open Graph de la guía reflejan el nuevo guion. Su fecha visible, Article, Open Graph y lastmod se alinean con la revisión real del 3/11.
- Se conservan las entidades existentes; no se añade VideoObject porque no hay vídeo. Las FAQ de la landing y el generador de respuestas no cambian.
- HTML, guion editable en TXT y sitemap, sin CSS, JS, imágenes, dependencias ni proveedores nuevos. La tabla reutiliza el contenedor desplazable y enfocable de la guía.
- Rama actualizada sobre main 95081b8 después de publicar las PR #98, #111, #106 y #105. Conserva íntegros sus cambios y la versión nueva de analytics.js. La PR #108 sigue fuera de este alcance.

## Validación actualizada del 3 de noviembre

- Check de las 51 URLs del sitemap, las diez landings originales y las cinco ofertas sectoriales correcto. No hay URLs nuevas de página ni cambios de title/H1 en este alcance.
- Cuatro pruebas existentes del protocolo y once del consentimiento correctas. La versión publicada de analytics.js y sus referencias se conservan.
- Navegador local: escritorio 1280×900 y móvil 390×844, con ancho real comprobado. Documento sin desbordamiento horizontal. La tabla de 620 px queda dentro de un contenedor de 343 px; con teclado, scrollLeft pasa de 0 a 40.
- Clic desde la tarjeta de la landing: destino correcto en ambos anchos. H2 visible a 138 px en escritorio y 130 px en móvil. El formulario existente sigue generando tres borradores con datos ficticios y sin enviar información.
- Límite de la automatización: el clic sobre el enlace en línea a los borradores, repartido entre dos líneas, no produjo navegación observable. Con Enter abre #protocolo y deja el H2 a 130 px. Se registra el límite sin cambiar el diseño para adaptar la página a la herramienta.
- TXT servido por HTTP 200, text/plain con UTF-8 y contenido exacto de origen. El navegador no devolvió confirmación de descarga durante 15 segundos; no se afirma que se haya guardado en Descargas.
- Sin errores de consola durante la comprobación. No se miden Core Web Vitals ni se reclama mejora de rendimiento de campo. No se añaden vídeos, imágenes, estilos, scripts ni proveedores.
- Article, fecha visible, Open Graph y lastmod coinciden con la revisión real del 3 de noviembre. JSON-LD parseado y contenido visible coherente; no se añade VideoObject a un guion. Las FAQ y ofertas de la landing se verifican con los controles existentes. No equivale a una confirmación de resultados enriquecidos por Google.

Evidencia privada: outputs/seo-visibility-20261103/vet-validation.json, vet-static-checks.json, vet-browser-checks.json y capturas de escritorio y móvil. La mejora requiere aprobación específica antes de fusionar y publicar.

## Revisión del 3 de noviembre

Se retira la puntuación con comillas de toda la guía, se acorta la locución y se añade un TXT para completar los datos del centro antes de grabar. El pie incluye el canal y horario de posibles urgencias como campos pendientes de confirmación. La página conserva título y H1; la landing comercial conserva también su metadescripción y sus ofertas.

La comparación de Search Console ya verificada para España, Web y consultas sin marca registra 7 impresiones con posición media 42,3 del 25 al 31 de octubre frente a 6 y 29,8 del 18 al 24. Son muestras pequeñas, no una posición puntual. La landing está indexada según la inspección individual del 3 de noviembre. Se consulta la evidencia de la sesión; no se repite una solicitud de indexación.

Las páginas propias de Veterclick y Marveting se revisan de nuevo el 3 de noviembre para contrastar el enfoque comercial. Se propone una muestra operativa original, sin copiar sus promesas ni atribuirse sus resultados. Se consulta de nuevo el Código Deontológico publicado por el Consejo General de Colegios Veterinarios, artículos 36, 38 y 39. El enlace AEPD responde, pero el extractor no permite verificar su contenido en esta revisión; no se añade ninguna conclusión jurídica nueva.
