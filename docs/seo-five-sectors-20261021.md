# Cinco landings: oferta e intención comercial, 21/10/2026

## Alcance y evidencia

Autorización del usuario: trabajar y publicar mejoras de clínicas dentales, inmobiliarias, restaurantes, veterinarias y comercios para mejorar su posicionamiento. No se modifican portada, precios ni la PR #98 pendiente.

El rastreo público del 21/10 encontró las 30 páginas del sitemap con HTTP 200, canonical propio, un H1 por página y sin noindex. Las cinco landings se localizaron en búsquedas de Google España sin marca: dental 25, inmobiliarias 70, restaurantes 101, veterinarias 122 y comercios 237, por paginación. Son una observación puntual con ubicación por IP en Murcia, no una media de Search Console ni una posición universal.

Search Console, España/Web/consultas sin «dania», 22/09–19/10: 0 clics y 234 impresiones en el sitio filtrado. La muestra es pequeña y el informe advierte que un filtro puede producir datos parciales. No prueba ausencia de visitas de otros canales o desindexación.

### Problemas controlables

- La presentación explicaba sobre todo qué contenido producir, pero no qué contrata el cliente. Las cinco metadescripciones separaban «redes desde 297 €» y «web desde 99 €», sin destacar que Growth ya incluye la web y su bot de IA.
- Las FAQ sobre la web de dental, inmobiliarias y restaurantes contestaban primero por Starter. Veterinarias y comercios carecían de una respuesta directa sobre la web/bot de Growth.
- Una muestra inmobiliaria indicaba 38 segundos y una de comercios 18; Growth incluye vídeos de 15 segundos. El encabezado inmobiliario incluía LinkedIn sin delimitar allí que corresponde a Scale.
- Restaurantes cargaba en escritorio un vídeo decorativo de 3.760.792 bytes, GSAP y ScrollTrigger para fijar la cabecera durante el scroll. No era el VSL de la portada.
- El schema de algunas páginas describía SEO sin aclarar que el trabajo continuo corresponde a Scale. Restaurantes mezclaba Organization con ProfessionalService sin los datos de una ubicación visible.

## Cambios

1. Presentaciones propias por sector: servicio, Growth 297 €/mes, web y bot de IA incluidos y participación del negocio.
2. Resumen `#growth` inmediatamente tras la presentación: publicaciones y canales, web/bot/app DANIA, dominio/hosting/actualización/QR, Google y reseñas. La parte común describe el mismo plan real; encabezado, contexto y límites son propios de cada actividad.
3. Límites claros: revisión clínica y derivación, compatibilidad del CRM, verificación del stock y confirmación de reservas. No se añaden funcionalidades, casos, testimonios, resultados ni credenciales inventados.
4. Descripciones únicas y coherentes en meta, Open Graph, Twitter y WebPage. Se conservan los títulos y H1 sectoriales ya alineados, las URL y los precios oficiales.
5. FAQ visible y JSON-LD revisados conjuntamente; descripción de Service precisa. No se promete que Service o FAQ produzcan un resultado enriquecido ni mejoras de ranking por sí mismos.
6. Restaurantes utiliza su cabecera estática ya existente en lugar del vídeo y scroll fijado. No se modifica ni elimina el VSL de portada. JavaScript generado: 336.338 → 224.123 bytes (−33,4 % sin comprimir); la visita deja de solicitar automáticamente el vídeo decorativo.
7. `lastmod` y WebPage.dateModified actualizados solo en las cinco URL con cambios sustantivos.

## Arquitectura conservada

```text
Portada (/)
├── Servicio general (/gestion-redes-sociales/)
├── Cinco landings sectoriales (URL existentes, sin redirecciones nuevas)
│   ├── Presentación → #growth → #planes
│   └── Guía sectorial y página de quiénes somos
└── Recursos (/recursos/)
    └── Guías existentes → landing sectorial correspondiente
```

Las cinco continúan enlazadas desde portada, servicio y recursos. No se crean nuevas páginas de sector ni se cambia su canonical. Las guías existentes ya aportan ejemplos y herramientas; no se duplican para aumentar el número de páginas.

## Validación previa a publicación

- `node landing-src/tools/check-five-sector-offers.mjs`: 5/5; resumen visible, metadatos, propiedades mínimas, precios y correspondencia de todas las respuestas FAQ/JSON-LD.
- `node landing-src/tools/check-site-seo.mjs`: 30/30; títulos/descripciones únicos, H1–H6, indexabilidad HTML, canonical y destinos internos.
- `node landing-src/tools/check-sector-seo.mjs`: 10/10.
- `node --test landing-src/tools/test-gym-planner.mjs landing-src/tools/test-dental-brief.mjs`: 10 pruebas correctas.
- Restaurantes: compilación cliente/SSR/prerender y ESLint correctos.
- Navegador: cinco páginas en escritorio de 1365 px y móvil de 390 px; sin desbordamiento horizontal ni imágenes rotas; enlaces a `#growth` funcionales y resumen legible. Se conservan capturas en los outputs del hilo.
- `git diff --check`: correcto. La validación no equivale a un resultado de Core Web Vitals, a un test oficial de rich results ni a una subida en Google.

## Referencias contrastadas

Se revisaron las propias páginas de servicios que aparecían delante, sin reutilizar sus textos ni sus testimonios:

- https://docmedia.es/redes-sociales/
- https://agenciaegos.com/gestion-de-redes-sociales-para-inmobiliarias/
- https://masleadsdigital.com/gestion-de-redes-sociales-para-restaurantes/
- https://veterclick.com/gestion-de-redes-sociales-para-veterinarias/
- https://www.beedigital.es/productos/redes-sociales/

Los competidores no prueban qué factor explica una posición. Sirven para comparar la claridad del alcance y el tipo de demostración, no para atribuir causalidad ni copiar sus servicios a nuestra cuota.

## Seguimiento

Tras desplegar, verificar las cinco páginas y recursos publicados; solicitar recrawl cuando Search Console lo permita. Comparar las mismas consultas y URL cuando Google haya podido procesar el contenido; separar posición puntual, posición media, impresiones, clics y contactos. No declarar conseguido el objetivo de escalar posiciones hasta observarlo de forma verificable. No cambiar títulos diariamente mientras se espera procesamiento.
