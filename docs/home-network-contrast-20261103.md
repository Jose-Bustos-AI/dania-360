# Portada: contraste de los nombres de las redes

PageSpeed móvil del 3 de noviembre detecta contraste insuficiente en los rótulos Instagram, Facebook, TikTok y Pinterest de la portada. El DOM publicado confirma #686a72 sobre negro en la franja de cinco redes, con texto de 11 px. El quinto rótulo, Google, usa la misma regla aunque no aparezca en la lista de fallos visibles del informe.

Se sustituye ese color por la variable --muted existente, #a7a9b2. El contraste calculado pasa de 3.89:1 a 8.96:1. Se utiliza como referencia el umbral de 4,5:1 para texto normal de [WCAG 2.2, criterio 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Se versiona styles.css en la portada para evitar que la caché conserve el color anterior.

El HTML coincide con main excepto por esa referencia. Se conservan título, H1, metadescripción, contenido, VSL, CTA, precios, datos estructurados, fondo negro, naranja de marca y logo. El CSS solo cambia esa declaración; no se añaden recursos, scripts, dependencias o conexiones externas. No se modifica el sitemap por una corrección visual pequeña.

Revisión a 1280×900 y móvil real de 390×844. Ambos muestran rgb(167,169,178) sobre negro, sin desbordamiento del documento. Se descarta un primer intento de móvil que permanecía a 1280 px por aplicarse el tamaño a otra pestaña; la prueba válida tiene innerWidth 390 y está guardada por separado. Pasan las comprobaciones existentes de las 51 URLs.

Evidencias privadas: outputs/seo-visibility-20261103/home-contrast-validation.json, home-contrast-browser-checks.json y capturas antes/después. La prueba previa de PageSpeed es de laboratorio y no se vuelve a presentar como una prueba de esta propuesta. No se atribuye una mejora de posiciones o de Core Web Vitals a este cambio.

Requiere aprobación específica para publicar.
