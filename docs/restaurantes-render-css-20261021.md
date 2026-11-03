# Restaurantes: retirar cuatro solicitudes CSS del primer pintado

## Evidencia

Después de publicar #100 y #101, PageSpeed móvil del 21/10/2026 a las 23:14 CEST mantiene rendimiento 88, FCP/LCP 2,891 s, TBT 0 y CLS 0. Accesibilidad pasa a 100. La reducción de JS elimina transferencia innecesaria, pero esta prueba no demuestra una mejora del primer pintado.

Informe: https://pagespeed.web.dev/analysis/https-dania360-com-gestion-redes-sociales-restaurantes/deztsnaaka?form_factor=mobile

El diagnóstico señala cuatro hojas propias bloqueantes, 10,4 KiB transferidos y 1.510 ms de duración agregada; no se interpreta esta suma como un ahorro garantizado. El LCP es el párrafo de la presentación, con 2.350 ms de retraso de renderizado. No hay datos de campo CrUX.

## Cambio

Solo en restaurantes, el prerender inserta las hojas CSS propias en el HTML, en su posición original. El orden sigue siendo sector SEO, resumen de oferta, estilos de aplicación y marca como última capa. Las fuentes externas y los archivos CSS fuente no se modifican. Las demás landings conservan sus enlaces y caché de CSS.

Se usa una lista explícita de archivos permitidos. El generador rechaza hojas duplicadas, imports sin resolver, cierres de style y URL relativas que cambiarían de base. Las pruebas comparan cada copia con su fuente: si cambia un estilo compartido sin reconstruir restaurantes, el comprobador falla. No se desactiva ni relaja una política de seguridad para insertar estilos.

## Presupuesto y contraprestación

HTML sin comprimir: 61.946 → 94.260 bytes. Gzip calculado con Node: 11.084 → 19.557 bytes. Aumenta el HTML porque incorpora los estilos; elimina cuatro solicitudes CSS propias del renderizado inicial. En una primera visita, se evita la transferencia separada de esos cuatro recursos; en una visita con caché caliente, el CSS insertado vuelve a viajar con el HTML. No se presenta como una mejora universal ni se promete una puntuación antes de medir producción.

El JavaScript sigue siendo el de #101, 926 bytes. El cuerpo HTML completo, H1, texto, precios, enlaces y FAQ son idénticos al commit publicado `ea2b7098d453fa95d5688f09f52a020006b8e44b`. No se cambian title, metadatos, JSON-LD, URL ni canonical; tampoco se crean páginas ni vídeos ni se toca el VSL de portada.

## Validación previa

- Build cliente/SSR/prerender, ESLint y ocho pruebas Node correctos.
- SEO: 30/30 páginas, 10/10 sectoriales, 5/5 ofertas.
- Cuerpo HTML idéntico al publicado, comprobado mediante comparación exacta normalizada de saltos de línea.
- Cuatro tamaños 320/390/768/1365: sin desbordamiento; un H1; cuatro estilos insertados y ningún enlace CSS propio; sin imágenes rotas detectadas.
- Menú móvil y FAQ operativos, contraste conservado y sin errores de consola observados. Capturas en los outputs del hilo.
- `git diff --check` correcto.

Después de publicar: comparar HTML, recursos y estilos con la versión revisada, probar navegación y repetir PageSpeed bajo condiciones comparables. Si no aporta una mejora o produce regresiones, reconsiderar la estrategia en lugar de conservarla por perseguir una puntuación. Las posiciones de Google se medirán por separado cuando existan datos posteriores; no se da el objetivo SEO por conseguido.

Referencia primaria: https://developer.chrome.com/docs/performance/insights/render-blocking (insertar CSS crítico puede reducir solicitudes bloqueantes, pero requiere validación y no siempre es necesario).
