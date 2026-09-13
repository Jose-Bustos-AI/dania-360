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

También publica una landing especializada para restaurantes, integrada desde
la antigua web GastroVisual:

- URL: https://dania360.com/gestion-redes-sociales-restaurantes/
- Archivos publicados: `gestion-redes-sociales-restaurantes/`
- Código fuente: `restaurantes-src/`

El dominio `gastrovisual.es` se conserva como dominio de migración y redirige
permanentemente a esta página para transferir usuarios y señales SEO.

La tercera landing sectorial está dirigida a gimnasios y centros deportivos:

- URL: https://dania360.com/gestion-redes-sociales-gimnasios/
- Archivos publicados: `gestion-redes-sociales-gimnasios/`
- Diseño: HTML y CSS estáticos propios, independientes de las otras landings
- SEO: canonical propio, datos estructurados de servicio, planes y preguntas

La página aparece en el sitemap principal y recibe enlaces internos desde la
página general de gestión de redes sociales.

La cuarta landing sectorial está dirigida a clínicas dentales y profesionales
de la odontología:

- URL: https://dania360.com/gestion-redes-sociales-clinicas-dentales/
- Archivos publicados: `gestion-redes-sociales-clinicas-dentales/`
- Diseño: identidad editorial propia en tonos marfil, salvia y verde clínico
- SEO: canonical propio, imagen social, servicio, planes, migas y preguntas

La página se incluye en el sitemap y recibe enlaces internos desde la página
general del servicio. Su contenido evita promesas clínicas y contempla la
validación profesional y la privacidad del paciente.

La quinta landing sectorial está dirigida a agencias inmobiliarias, agentes y
promotoras:

- URL: https://dania360.com/gestion-redes-sociales-inmobiliarias/
- Archivos publicados: `gestion-redes-sociales-inmobiliarias/`
- Diseño: identidad editorial oscura con acentos lima y azul
- SEO: canonical, imagen social, servicio, planes, migas y preguntas

La estrategia de contenido diferencia la captación de propietarios de la
presentación de inmuebles a compradores e inquilinos. La página figura en el
sitemap y recibe enlaces desde la página general del servicio.

La sexta landing sectorial está dirigida a academias, escuelas y centros de
formación presenciales u online:

- URL: https://dania360.com/gestion-redes-sociales-academias/
- Archivos publicados: `gestion-redes-sociales-academias/`
- Diseño: identidad editorial en tonos marfil, ciruela, coral y turquesa
- SEO: canonical, imagen social, servicio, planes, migas y preguntas

La estrategia acompaña el recorrido desde el descubrimiento de un curso hasta
la consulta, con campañas de matrícula, contenido docente, metodología y
reputación. La página figura en el sitemap y recibe enlaces desde la página
general del servicio.
