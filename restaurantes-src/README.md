# Landing de restaurantes

Código fuente de la landing publicada en:

- https://dania360.com/gestion-redes-sociales-restaurantes/

El proyecto conserva la experiencia especializada que antes se publicaba en
`gastrovisual.es`, ahora integrada bajo la marca, el dominio y los datos de
Dania360.

## Generación

```bash
npm ci
npm run build
```

La compilación publica directamente el resultado en
`../gestion-redes-sociales-restaurantes/`.

React se usa solamente al generar el HTML (SSR/prerender), no se envía al
navegador ni se hidrata. Menú móvil y preguntas frecuentes usan `details` y
`summary` nativos, con contenido disponible sin JavaScript. La entrada
`src/main.jsx` solo cierra el menú al elegir un enlace o pulsar Escape.

Después de compilar, ejecutar `npm test` para verificar el HTML, la igualdad
de las preguntas/respuestas con JSON-LD y el presupuesto de JavaScript.

El prerender inserta en el HTML las cuatro hojas CSS locales de la página,
manteniendo su orden original y dejando la marca como última capa. No se
editan esas copias a mano: tras cambiar `sector-seo.css`, `sector-offer.css`,
`brand-orange.css` o los estilos de la aplicación, hay que reconstruir y
ejecutar las pruebas. Las hojas externas de fuentes no se alteran.
