# Veterinarias: de una idea de calendario a un guion producible

## Problema y cambio

La landing y la guía ya ofrecen un calendario, tres textos y una herramienta de respuestas. No faltaba otro calendario: faltaba enseñar cómo se transforma la idea de «primera visita» en un vídeo de 15 segundos que un centro pueda preparar y aprobar. Esta ampliación añade cuatro planos cronometrados, texto en pantalla, locución, pie de publicación y revisión operativa. Es un guion, no un vídeo grabado ni un caso de cliente.

El ejemplo se limita a entrada, recepción y canal de cita. No incorpora diagnósticos, tratamientos, pacientes, promesas de resultados ni disponibilidad inmediata. El centro valida los datos y confirma las citas; Growth mantiene su alcance de 297 €/mes con web y bot, sin nuevas prestaciones.

## Intención y decisión editorial

La búsqueda en Google España, sin marca, muestra proveedores sectoriales como [Veterclick](https://veterclick.com/gestion-de-redes-sociales-para-veterinarias/), [Marveting](https://marveting.com/servicios/redes-sociales/) y contenido de [MKVET](https://www.mkvet.es/kit-digital-redes/). El recorrido mezcla contratación y dudas sobre planificación/contenidos. La hipótesis de esta mejora es facilitar que un responsable de clínica evalúe una muestra concreta del trabajo, sin copiar textos ni atribuirse la experiencia o resultados que anuncian otros proveedores.

Se amplía la guía existente y se enlaza el guion desde la tarjeta «Primera visita» de la landing. El nuevo apartado conecta con la herramienta de mensajes ya disponible. El índice permite localizarlo y la guía conserva sus retornos al servicio. No se crea una URL competidora, ni se concluye canibalización sin consultas compartidas.

## Alcance técnico y datos estructurados

- H1, title y metadescripción de la landing comercial conservados; precios y ofertas conservados.
- Metadescripción y Open Graph de la guía reflejan el nuevo guion. Su fecha visible, Article, Open Graph y lastmod se alinean con la revisión real del 30/10.
- Se conservan las entidades existentes; no se añade VideoObject porque no hay vídeo. Las FAQ de la landing y el generador de respuestas no cambian.
- Solo HTML y sitemap, sin CSS, JS, imágenes, dependencias ni proveedores nuevos. La tabla reutiliza el contenedor desplazable y enfocable de la guía.
- Esta rama parte de main afd78cc. Las PR #98, #105, #106 y #108 siguen abiertas y no se mezclan con este cambio.

## Validación

- Check SEO de las 30 URLs del sitemap, diez landings y cinco resúmenes Growth correcto.
- Cuatro pruebas existentes del protocolo correctas. Se conservan sus límites para no generar borradores incompletos ni diagnósticos.
- Navegador local: escritorio 1280×720 y móvil 390×844, con innerWidth real comprobado. Sin desbordamiento horizontal del documento. En móvil la tabla de 620 px se desplaza dentro de un contenedor de 341 px; comprobado con teclado (scrollLeft pasa a 40).
- El enlace desde la landing abre el apartado correcto; al llegar en móvil el H2 queda visible bajo la cabecera. Capturas de guía, enlace y ancho móvil guardadas en la evidencia privada de la sesión.
- Sin errores o avisos en la consola de las dos páginas revisadas. No se prueba rendimiento de campo ni se deducen Core Web Vitals. El servidor local de revisión bloquea proveedores externos; no modifica el consentimiento de producción ni genera supuestos leads.
- Los checks parsean JSON-LD y verifican propiedades y contenido visible. La skill instalada no contiene un ejecutable validate_schema; estos controles no equivalen a validación oficial de elegibilidad de resultados enriquecidos.

La revisión se limita a una muestra creativa y su recorrido interno. Las posiciones y las decisiones editoriales externas se registran aparte; no se promete una subida ni una publicación. Requiere aprobación específica antes de fusionar o desplegar.
