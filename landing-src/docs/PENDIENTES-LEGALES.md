# Datos legales pendientes

**Estado actual: `legalDataComplete: false` en [`config/legal.json`](../config/legal.json).**

> **No deben iniciarse campañas de pago ni captación masiva hasta completar y
> revisar toda la información legal.** Una landing comercial que capta contactos
> sin identificar correctamente al responsable del tratamiento expone al negocio
> a una reclamación y, en publicidad de pago, al rechazo de la cuenta.

Mientras el indicador siga en `false`:

- Las tres páginas legales se generan con `noindex, nofollow`.
- El sitemap **no** las incluye.
- Los bloques cuyos datos faltan **no se imprimen**. En ningún caso se publica
  un texto como `[PENDIENTE: NIF]`.
- El aviso de campos incompletos solo aparece con `npm run build:dev`, nunca en
  producción.
- La landing `/salones-estetica/` sí es indexable: no depende de estos datos.

## Qué falta

| Campo en `config/legal.json` | Qué hay que poner | De dónde sale |
| --- | --- | --- |
| `razonSocial` | Denominación social exacta de la S.L. | Escritura de constitución |
| `nif` | CIF/NIF definitivo | Tarjeta censal / AEAT |
| `domicilio.via` | Calle, número, piso y puerta | Escritura |
| `domicilio.codigoPostal` | Código postal | Escritura |
| `domicilio.localidad` | Municipio | Escritura |
| `domicilio.provincia` | Provincia | Escritura |
| `registroMercantil.registro` | Registro Mercantil de inscripción | Nota simple |
| `registroMercantil.tomo` | Tomo | Nota simple |
| `registroMercantil.folio` | Folio | Nota simple |
| `registroMercantil.hoja` | Hoja | Nota simple |
| `registroMercantil.inscripcion` | Número de inscripción | Nota simple |
| `correos.general` | Buzón de contacto general | Decisión interna |
| `correos.privacidad` | Buzón para ejercer derechos de protección de datos | Decisión interna |
| `correos.legal` | Buzón para notificaciones legales | Decisión interna |
| `dpd.designado` | `true` o `false` según se designe DPD | Análisis de la asesoría |
| `dpd.nombre` / `dpd.correo` | Solo si `designado` es `true` | — |
| `jurisdiccion.ciudad` | Fuero pactado en las condiciones | Asesoría jurídica |
| `daniaAi.identidadLegal` | Denominación y NIF de la entidad titular de Dania.ai | Contrato de franquicia |
| `daniaAi.domicilio` | Domicilio de esa entidad | Contrato de franquicia |
| `daniaAi.rolProteccionDatos` | Si actúa como encargado del tratamiento o corresponsable, y con qué contrato | Contrato de franquicia + asesoría |

Ya está confirmado y en uso: **teléfono `+34 631 105 772`**.

## Cómo cerrarlo

1. Rellena los campos en `config/legal.json`.
2. Cambia `legalDataComplete` a `true`.
3. Ejecuta `npm run verify`. Las comprobaciones pasan a exigir que las páginas
   legales sean indexables y que aparezcan en el sitemap.
4. **Antes de publicar, que una asesoría jurídica revise los tres textos.** Las
   páginas generadas son un punto de partida razonable y honesto, no un
   dictamen legal: no las hemos redactado con conocimiento de la actividad
   concreta, del alcance territorial ni de los encargados del tratamiento reales.
5. Revisa además la política de cookies el día que se instale un gestor de
   etiquetas: hoy declara, con razón, que la página no instala cookies.

## Punto que conviene decidir pronto

La landing afirma que **Dania360 opera como franquicia oficial de Dania.ai**.
Es un dato que nos has facilitado tú y que no hemos podido verificar en el
proyecto. Confirma que puede publicarse en esos términos antes de lanzar.

El dato de **«más de 200 especialistas en la red Dania» no aparece en la
landing**: no está confirmado en ningún punto del proyecto y la instrucción era
incluirlo solo si lo estuviera. Si se confirma, se añade a la sección de
confianza.
