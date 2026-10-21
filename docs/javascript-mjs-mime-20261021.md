# Hostinger: módulos MJS con MIME correcto

## Evidencia de producción

Tras la PR #103, el verificador HTTP encontró que `ficha-campana.mjs` se entregaba con `Content-Type: text/plain`, aunque los bytes coincidían con el commit. El navegador público no mostraba el formulario, que permanece oculto hasta inicializarse. La plantilla HTML/TXT seguía disponible.

Se contrastó el recurso preexistente `calendario-redes-sociales-clinicas-veterinarias/protocolo.mjs`: también HTTP 200, `Content-Type: text/plain`, `X-Content-Type-Options: nosniff`. El problema afecta a los dos módulos del sitio que usan esa extensión. Un HTTP 200 o una prueba local no bastan para demostrar que el navegador puede ejecutarlos.

## Corrección acotada

- Declarar `.mjs` como `text/javascript` con `AddType` en `.htaccess`.
- Conservar `nosniff`, HTTPS, redirecciones y demás cabeceras de seguridad.
- Incluir `text/javascript` en la lista existente de compresión.
- Versionar las dos referencias HTML para que una respuesta anterior con MIME erróneo no se reutilice desde caché.
- Añadir al check SEO una guarda del mapeo y de `nosniff`. Es una comprobación de configuración, no prueba de ejecución pública.

No cambian textos comerciales, metadatos SEO, H1, URL, precios, almacenamiento ni servicios externos. Tampoco se cambian las fechas editoriales por este ajuste técnico.

## Verificación exigida después de desplegar

1. Ambas URL reales, incluidas las versiones usadas por HTML, entregan MIME JavaScript y mantienen `nosniff`.
2. El navegador público permite generar la ficha de comercios y las respuestas de veterinarias.
3. HTML y assets coinciden con el commit; las cinco landings conservan respuestas HTTP 200.
4. Checks generales, las 15 pruebas de comercios y las pruebas del protocolo veterinario correctos.

Referencias: [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Apache: AddType](https://httpd.apache.org/docs/2.4/mod/mod_mime.html#addtype). Cambiar el MIME corrige funcionamiento; no demuestra una mejora de ranking.
