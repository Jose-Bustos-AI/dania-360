# Generador de la landing de salones y centros de estética

Código fuente de la página publicada en
**https://dania360.com/salones-estetica/**.

Esta carpeta **no se publica**: es la fuente. Lo que sirve Hostinger es
`/salones-estetica/`, en la raíz del repositorio, y se genera desde aquí.

## Por qué existe

La landing tiene identidad visual propia, deliberadamente distinta de la home:
fondo marfil, tipografía editorial y acentos cálidos. Su HTML es largo y hay
datos que aparecen varias veces —los tres planes, los mensajes de WhatsApp, las
preguntas frecuentes y su equivalente en Schema.org—. Mantenerlos a mano
garantiza que antes o después dejen de coincidir.

Por eso todo dato vive una sola vez en `config/` y el generador lo imprime.

## Regenerar la landing

```bash
cd landing-src && npm run build:web
```

Eso reescribe **únicamente** `../salones-estetica/`. No toca la home, ni
`styles.css`, ni las páginas legales, ni el sitemap, ni el `.htaccess`.

Después, revisa el resultado y haz commit de los cambios en
`/salones-estetica/` junto con los de `landing-src/`.

## Comprobaciones

```bash
cd landing-src && npm run verify
```

`verify` genera una copia autónoma en `landing-src/site/` (ignorada por git) y
le pasa 97 comprobaciones: un solo H1, canonical, Open Graph, Twitter Card,
coincidencia literal entre el acordeón de preguntas y el bloque `FAQPage`,
precios de los tres planes, que todos los CTA abran WhatsApp con `target`,
`rel`, nombre accesible y `data-cta-location`, que no haya formularios ni
pasarela de pago, que no se publiquen testimonios inventados y que ninguna
fotografía apunte a un archivo inexistente.

No hay dependencias: ni `node_modules`, ni framework, ni fuentes remotas. Solo
Node 18 o superior.

## Cambiar un dato

| Quiero cambiar | Toco |
| --- | --- |
| Un precio o una característica de un plan | `config/planes.json` |
| El mensaje que se envía por WhatsApp | `config/contacto.json` |
| Una pregunta frecuente | `config/faq.json` |
| El title, la descripción o la imagen social | `config/sitio.json` |
| Activar una fotografía ya subida | `config/fotos.json` |
| Los datos legales | `config/legal.json` |

## Relación con el resto del sitio

- Las páginas legales `/aviso-legal/`, `/privacidad/` y `/cookies/` **ya existen
  en este repositorio**. El modo integrado no las genera ni las sobrescribe: la
  landing simplemente enlaza a ellas.
- `config/legal.json` queda como fuente centralizada de los datos de la futura
  S.L. para cuando se actualicen esas páginas. Ver
  [`docs/PENDIENTES-LEGALES.md`](docs/PENDIENTES-LEGALES.md).
- `npm run build` (sin `:web`) genera además páginas legales propias y un
  sitemap aparte, en `landing-src/site/`. Es el modo autónomo, útil para
  revisar en local; **no se despliega**.

## Fotografías

Ninguna está colocada todavía. Mientras `config/fotos.json` las marque como no
disponibles, la página **no pide ningún archivo inexistente** y cada hueco
muestra una composición cálida con un motivo de arco que forma parte del
diseño.

Para colocar una: guarda el archivo en `src/assets/img/` con el nombre exacto de
[`src/assets/img/FOTOGRAFIAS.md`](src/assets/img/FOTOGRAFIAS.md), pon
`disponible: true` en `config/fotos.json` y ejecuta `npm run build:web`.

## Medición

Cada enlace a WhatsApp empuja a `dataLayer`:

```js
{ event: 'whatsapp_click', cta_location: 'hero', plan: null,
  destino: 'https://wa.me/...', pagina: '/salones-estetica/' }
```

No hay ningún identificador de Google Analytics ni de Google Ads escrito en el
código. Cuando exista el contenedor de etiquetas, se dispara sobre ese evento.

## Pendiente

- [ ] Nueve fotografías del sector, más la imagen Open Graph propia
      (`/salones-estetica/assets/img/og-salones-estetica.jpg`, 1200×630).
      Mientras tanto se usa `/og.png`, la imagen social genérica del sitio.
- [ ] Completar `config/legal.json` y actualizar las páginas legales del sitio.
- [ ] Confirmar que puede publicarse la relación de franquicia con Dania.ai.
- [ ] Instalar el contenedor de etiquetas y conectar `whatsapp_click`.
