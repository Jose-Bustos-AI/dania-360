# Primer lote de ampliación sectorial

Preparado el 2 de noviembre de 2026. Diez nuevas landings comerciales, sin publicación automática. Las diez sectoriales anteriores conservan sus URLs y su contenido. No se atribuyen posiciones o indexación a páginas que todavía están en revisión.

## Qué aporta cada página

| Ruta | Consulta comercial de partida | Valor original del cuerpo y recurso |
| --- | --- | --- |
| `/gestion-redes-sociales-fontaneros/` | gestión de redes sociales para fontaneros | Diferencia avisos y trabajos previstos; guion de 15 segundos y ficha de servicios/consulta. |
| `/gestion-redes-sociales-construccion/` | redes sociales para empresas de construcción | Alcance de ejecución y cartera por fases; ficha editorial de un proyecto. |
| `/gestion-redes-sociales-reformas/` | gestión de redes sociales para empresas de reformas | Decisiones de una cocina en cuatro láminas; ficha de documentación antes de publicar. |
| `/gestion-redes-sociales-electricistas/` | gestión de redes sociales para electricistas | Especialidades, revisión técnica del mensaje y guion para una consulta de recarga. |
| `/gestion-redes-sociales-climatizacion/` | redes sociales para empresas de climatización | Calendario por etapas y separación de instalación, mantenimiento e incidencia. |
| `/gestion-redes-sociales-placas-solares/` | redes sociales para instaladores de placas solares | Revisión de afirmaciones, datos y estimaciones; ficha para documentar el origen de una cifra. |
| `/gestion-redes-sociales-carpinterias-madera/` | redes sociales para carpinterías de madera | Uso, materiales y detalles de una pieza a medida; ejemplo conceptual de armario. |
| `/gestion-redes-sociales-carpinterias-metalicas/` | redes sociales para carpinterías metálicas | Decisiones de un cerramiento, alcance de fabricación/instalación y documentación de prestaciones. |
| `/gestion-redes-sociales-cerrajeros/` | gestión de redes sociales para cerrajeros | Identidad, zona y disponibilidad; encaje de redes en servicios previstos y urgencias. |
| `/gestion-redes-sociales-pintores/` | gestión de redes sociales para pintores | Preparación, acabado y contexto; ficha para reunir material comparable de una intervención. |

Cada página dispone de introducción y cuerpo escritos individualmente, cuatro preguntas visibles, una ficha TXT distinta y un SVG original diferente. Los dibujos se identifican como ilustraciones conceptuales. No se presentan como clientes, obras ejecutadas ni pruebas de resultados.

## Investigación y límites

`sector-pages-src/pages.json` registra consultas sin marca, intención, diferenciación respecto a las otras páginas, fuentes y observaciones por sector. La revisión es cualitativa. No hay volúmenes de búsqueda, CPC o dificultad verificados. Cuando una apertura falló, se distingue el resultado indexado del contenido leído directamente.

Fuentes profesionales y comerciales consultadas: John Guest para fontanería; Made For Builders para construcción; Agency Dema y el resultado de Mayte Díaz para reformas; Lual y LPM para electricidad; Hacemos Cosas y Astratech para climatización/energía; Maderea para madera; ME's para aluminio; Posicionaze para cerrajería; Procolor y la oferta de DigitalWeb para pintura. Las URLs exactas y el límite de cada observación están en el registro de cada página.

No se copian casos ni métricas de competidores. Sus promesas de facturación, plazos o canales no se trasladan al servicio de Dania360. La demanda cuantitativa y el rendimiento se tendrán que contrastar con una fuente adecuada y con Search Console después de una publicación autorizada.

## Arquitectura y contenido rastreable

Las URLs nuevas siguen el patrón raíz ya utilizado. `/sectores/` es un índice de navegación con enlaces reales a las veinte sectoriales preparadas o existentes; no publica el catálogo restante. Portada y servicio general añaden únicamente un enlace al índice. Desde portada se llega a cada página nueva en dos clics. Los cuerpos contienen relaciones contextuales cuando hay un destino útil, sin enlazar a sectores todavía inexistentes.

Ningún contenido comercial requiere JavaScript para leerse. Se mantienen canonical absoluto, una etiqueta H1, jerarquía H2/H3, títulos y descripciones únicos, imágenes con proporciones reservadas y textos alternativos. Las fuentes del generador quedan fuera del rastreo en `robots.txt`. El sitemap incorpora solo páginas que existen en la rama.

Se comparte navegación, identidad, oferta oficial y pie. Los cuerpos no proceden de sustituir el nombre de un oficio en una plantilla de texto. El generador lee el alcance de Growth de `landing-src/config/planes.json`, incorpora su web y bot de IA y mantiene el precio de 297 €/mes. No añade LinkedIn a Growth ni promete anuncios, grabación presencial o resultados técnicos.

## Datos estructurados y buscadores con IA

Cada landing incluye Organization, WebPage, Service con Offer mensual de Growth, BreadcrumbList y FAQPage. El servicio y las preguntas coinciden con la oferta y el contenido visibles. No se añaden reseñas, puntuaciones, empresas locales o ubicaciones inventadas. Service no implica un resultado enriquecido propio y FAQPage no garantiza que Google muestre preguntas en sus resultados.

La preparación para respuestas de IA se apoya en contenido comprensible, información explícita, identidad y enlaces rastreables. La documentación de [Google Search Central sobre funciones con IA](https://developers.google.com/search/docs/appearance/ai-features) indica que no existe un marcado especial adicional necesario. No se ofrecen apariciones garantizadas ni se crean archivos de IA para aparentar una mejora.

## Comprobación y evidencia

- `node sector-pages-src/check.mjs`: enlaces y fragmentos, metadatos y oferta declarados, FAQ coherente, fichas e ilustraciones, detección de cuerpos excesivamente similares. Es un control mecánico, no una demostración de calidad ni de posiciones.
- `node landing-src/tools/check-site-seo.mjs`: las 41 páginas del sitemap, incluida la estructura anterior.
- `node landing-src/tools/check-sector-seo.mjs`: conserva los controles específicos de las diez sectoriales existentes.
- `node landing-src/tools/check-five-sector-offers.mjs`: mantiene las cinco ofertas existentes cubiertas por ese verificador.
- Inspección visual de cada landing en escritorio de 1280 px y móvil con `innerWidth` verificado de 390 px, sin desbordamiento horizontal. Revisión adicional de ejemplos y del índice en ambos formatos.
- Respuestas locales HTTP 200 para los diez HTML, diez SVG y diez TXT; las ilustraciones y las fichas tienen contenidos distintos.
- Comparación exacta de portada y servicio con main: únicamente cambia el enlace de entrada al índice; se conservan el H1 y el VSL.

Las capturas, métricas de viewport, comprobación HTTP y salida de verificadores se guardan en `outputs/seo-sector-expansion-20261102/` del workspace de trabajo, fuera del código publicado. La prueba de descarga mediante evento del navegador integrado agotó el tiempo de espera; se verificó el archivo enlazado y su respuesta HTTP, sin afirmar que el navegador confirmara su guardado en disco.

Validación local del JSON-LD y de sus datos, no ejecución del Rich Results Test remoto. La revisión local no verifica las cabeceras o el despliegue de Hostinger. Tras aprobar y publicar hay que comprobar las URLs reales, los recursos y las señales de indexabilidad; no se confunde ese paso con conseguir indexación o posiciones.
