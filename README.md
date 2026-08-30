# Dania 360

Landing comercial estática de [dania360.com](https://dania360.com/).

## Publicación

El repositorio está preparado para Hostinger Premium Web Hosting sin proceso de compilación:

- rama de producción: `main`
- documento principal: `index.html`
- estilos: `styles.css`
- carpeta de destino en Hostinger: `public_html`

Los cambios enviados a `main` se publican mediante la función de autodespliegue de Git de Hostinger.

## Conversión

Todos los botones comerciales dirigen al WhatsApp de Dania 360. La landing no utiliza enlaces de pago directo.

## Landing por sector

Además de la home, el repositorio publica una landing con identidad visual
propia dirigida a salones y centros de estética:

- URL: https://dania360.com/salones-estetica/
- Archivos publicados: `salones-estetica/`
- Código fuente: `landing-src/` (no es contenido del sitio)

La landing es HTML estático como el resto del sitio, así que Hostinger la
sirve sin ningún paso extra. Su HTML se genera desde `landing-src/` para que
los precios, los mensajes de WhatsApp y las preguntas frecuentes se declaren
una sola vez:

```bash
cd landing-src && npm run build:web
```

Ese comando reescribe únicamente `salones-estetica/`. No toca la home, ni
`styles.css`, ni las páginas legales, ni el sitemap, ni el `.htaccess`.
Detalles y comprobaciones en `landing-src/README.md`.
