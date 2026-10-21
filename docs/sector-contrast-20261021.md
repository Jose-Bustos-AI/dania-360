# Contraste: inmobiliarias y restaurantes, 21/10/2026

## Evidencia y alcance

PageSpeed Insights móvil en producción, Lighthouse 13.5.0, Moto G Power y 4G lenta:

| Landing | Rendimiento | Accesibilidad | SEO | LCP de laboratorio |
|---|---:|---:|---:|---:|
| Clínicas dentales | 100 | 97 | 100 | 1,278 s |
| Inmobiliarias | 98 | 97 | 100 | 1,843 s |
| Restaurantes | 88 | 97 | 100 | 2,893 s |
| Veterinarias | 99 | 100 | 100 | 1,355 s |
| Comercios | 97 | 100 | 100 | 2,205 s |

No hay datos de campo CrUX para estas URL. Los resultados son una prueba de laboratorio, no un certificado de accesibilidad, Core Web Vitals o posiciones de búsqueda.

Los detalles de contraste señalan texto funcional, no solo logotipos:

- Inmobiliarias: texto secundario gris sobre papel, etiquetas y encabezados naranjas sobre superficies claras, números del proceso y etiquetas de planes.
- Restaurantes: números de pasos, etiqueta del plan destacado, rótulo de recursos, pie de página y botón flotante de WhatsApp.
- Dental: el contraste señalado corresponde al «360» del logotipo sobre fondo claro. No se cambia el naranja exacto solicitado ni se oculta texto para superar una prueba automática.

## Cambio

Se corrigen solo los estilos propios de inmobiliarias y restaurantes. Los fondos y acentos siguen usando #FF7139. La tinta naranja oscura existente se reserva para texto sobre superficies claras; los botones sobre naranja usan texto oscuro, y el pie oscuro usa texto claro legible. Se conserva el diseño propio por sector, H1, título, contenido, URL, canonical y datos estructurados.

El CSS de inmobiliarias cambia su versión de caché. Restaurantes se recompila desde su fuente React; no se edita a mano el CSS generado. No se modifican las otras ocho sectoriales ni la PR #98 de portada/precios.

El diagnóstico de velocidad de restaurantes se registra por separado: LCP/FCP de 2,893 s, cuatro CSS bloqueantes (ahorro estimado por Lighthouse de 150 ms), fuentes externas de 125 KiB. No se afirma que el cambio de contraste resuelva esos tiempos ni provoque una subida en Google.

## Validación de la corrección

- Compilación cliente/SSR/prerender de restaurantes y ESLint correctos.
- Comprobadores SEO generales: 30/30 páginas, 10/10 sectoriales y 5/5 ofertas correctas.
- Navegador a 1365 × 900 y 390 × 844: sin desbordamiento horizontal (ancho de documento 1350 y 375, respectivamente, por la barra de desplazamiento).
- Colores calculados del DOM renderizado: 42 elementos revisados en inmobiliarias y 18 en restaurantes, en cada tamaño. Todos superan su umbral de contraste. Mínimos: 5,25:1 y 5,58:1, respectivamente. No se interpreta como auditoría integral de accesibilidad.
- Capturas de escritorio/móvil guardadas en los outputs del hilo; H1 y navegación conservados. El logotipo «360» permanece en #FF7139 por la decisión de marca, sin ocultarlo a lectores de pantalla.
- `git diff --check` correcto. Las puntuaciones anteriores son la línea base, no un resultado nuevo después de publicar.

## Referencias de las pruebas previas

- Dental: https://pagespeed.web.dev/analysis/https-dania360-com-gestion-redes-sociales-clinicas-dentales/omt3a8lfmv?form_factor=mobile
- Inmobiliarias: https://pagespeed.web.dev/analysis/https-dania360-com-gestion-redes-sociales-inmobiliarias/qqv3h397td?form_factor=mobile
- Restaurantes: https://pagespeed.web.dev/analysis/https-dania360-com-gestion-redes-sociales-restaurantes/ktqwnj74ha?form_factor=mobile
- Veterinarias: https://pagespeed.web.dev/analysis/https-dania360-com-gestion-redes-sociales-veterinarias/x8gztfieov?form_factor=mobile
- Comercios: https://pagespeed.web.dev/analysis/https-dania360-com-gestion-redes-sociales-comercios/26dlxdh5tb?form_factor=mobile

Fuentes de referencia: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html y https://developer.chrome.com/docs/performance/insights/render-blocking .
