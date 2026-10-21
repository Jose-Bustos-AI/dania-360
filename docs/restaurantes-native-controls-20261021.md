# Restaurantes: reducir JavaScript sin quitar contenido

## Problema observado

PageSpeed móvil en producción el 21/10/2026: rendimiento 88, FCP/LCP 2,893 s, TBT 0 ms y CLS 0. El informe detectaba unos 32 KiB de JavaScript no utilizado. No había datos de campo CrUX. El HTML ya estaba prerenderizado, pero se descargaban React, React DOM y la aplicación completa para hidratar principalmente el menú y el acordeón.

Línea base publicada (commit `9afebbfb98f8581324079ccb5712f20960cf6478`):
https://pagespeed.web.dev/analysis/https-dania360-com-gestion-redes-sociales-restaurantes/ktqwnj74ha?form_factor=mobile

## Solución y límites

- React se mantiene como herramienta de generación SSR, pero no se envía al visitante.
- FAQ con `details`/`summary` nativos, primera pregunta abierta, agrupadas por `name`. Las once preguntas y respuestas siguen en el HTML y coinciden con JSON-LD.
- Menú móvil nativo; un script pequeño lo cierra al seleccionar un enlace o pulsar Escape, devolviendo el foco al control. Sin scripts sigue pudiendo abrirse, navegar y cerrarse manualmente.
- Menú de escritorio, H1, títulos, metadescripción, precios, oferta, enlaces y contenido conservados. La propuesta se apoya en la corrección de contraste de la PR #100.
- Se elimina el ancho mínimo fijo de 320 px del cuerpo, que desbordaba cuando la barra de desplazamiento dejaba 305 px útiles.
- No se toca el VSL de la portada, el alojamiento del vídeo ni ninguna otra landing.

## Presupuesto medido de JavaScript

| Compilación | Sin comprimir | Gzip calculado con Node |
|---|---:|---:|
| Publicada, antes | 224.123 bytes | 69.866 bytes |
| Propuesta | 926 bytes | 501 bytes |

Reducción del JavaScript sin comprimir: **99,59 %**. El gzip es una medida local de los archivos, no una observación del tamaño de transferencia servido por Hostinger. No se ha medido todavía un nuevo LCP ni una nueva puntuación de PageSpeed en producción, y no se afirma que este cambio produzca una subida de posiciones.

## Comprobaciones ejecutadas

- Build cliente/SSR/prerender y ESLint correctos.
- Cinco pruebas Node: contenido/FAQ server-side y correspondencia con schema; JS por debajo de 5 KB y 2 KB gzip; cierre al seleccionar enlaces; Escape y foco; ausencia de errores si no existe menú.
- Comprobadores SEO: 30/30 páginas, 10/10 sectoriales y 5/5 ofertas correctas.
- Navegador: FAQ abre/cierra con clic, Enter y espacio; se cierra la anterior. Menú abre, cierra con Escape y devuelve foco, y se cierra al navegar a Planes. Sin errores de consola observados.
- Pantallas de 320, 390, 768 y 1365 px: ancho del documento igual al ancho útil en las cuatro, un H1 e imágenes sin fallos detectados.
- Prueba adicional en un servidor local temporal con cabecera `Content-Security-Policy: script-src 'none'; object-src 'none'`: menú y FAQ operativos mediante controles nativos. Captura guardada en los outputs. El servidor de prueba no cambia el sitio ni se publica.
- Capturas de FAQ en escritorio y menú/FAQ en móvil guardadas en los outputs del hilo.

## Publicación y seguimiento

Propuesta pendiente de revisión y autorización de despliegue, después de la PR #100. Tras publicarla se deberán contrastar HTML/recursos servidos, controles, consola, y una nueva medición de laboratorio comparable. Los cambios de posiciones se comprobarán por separado para las mismas consultas sin marca; una reducción de bytes no demuestra por sí sola una mejora de ranking.

Referencias técnicas primarias:

- https://developer.chrome.com/docs/lighthouse/performance/unused-javascript
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
