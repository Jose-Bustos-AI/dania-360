# Peluquerías y estética: primera mejora del bloque diario

## Problema y cambio

La cabecera no mostraba el precio ni explicaba que Growth incluye web y bot de IA. Cuatro etiquetas genéricas ocupaban la fotografía, sin conducir a una muestra del trabajo. El logo superior volvía a la propia landing y faltaba una ruta al directorio de sectores. El distintivo Más elegido no estaba respaldado por datos.

La nueva composición mantiene la identidad cálida del sector, el H1 y el título. Presenta Growth por 297 €/mes con su alcance principal, acceso directo al plan y una muestra editorial enlazada al carrusel de color que ya existía. No se cuenta ese recurso como contenido nuevo. La fotografía se identifica como ambientación y se sirve como imagen HTML con dimensiones explícitas y prioridad alta, en lugar de depender del fondo CSS.

La navegación añade Inicio, Sectores y la página actual con BreadcrumbList coherente. El logo lleva a la portada. La descripción y los metadatos sociales aclaran que web y bot están incluidos en Growth; no cambian los precios ni las prestaciones. El menú móvil anuncia correctamente abrir o cerrar.

La sección de confianza enlaza al artículo ya publicado de José Antonio Bustos García en Tocado, dentro de Professional Beauty. Es una colaboración editorial verificable, sin presentarla como caso de cliente ni como enlace conseguido hoy.

## Evidencia anterior al cambio

Consulta del 6 de noviembre: gestión de redes sociales para peluquerías, Google España, hl=es, gl=es y pws=0. La URL se observó en la página 14, tercera posición de esa página, resultado web 126 entre los contados. El offset de paginación daría 133; se conservan ambos datos para no equiparar métodos distintos. Se excluyeron anuncios, citas de IA y carruseles.

Search Console, España, Web, URL exacta y consultas sin marca, 8/10 a 4/11 frente a 10/9 a 7/10: sin impresiones ni clics reportados en ambos periodos, sin consultas o dispositivos con datos. No se interpreta como desindexación: la landing se encontró en Google y estaba indexada en la inspección individual del 5/11. No se afirma una tendencia ni causalidad.

## Validación

- Generador integrado y autónomo ejecutados. HTML y CSS/JS publicados coinciden con sus fuentes y salida generada.
- 99 comprobaciones del generador correctas; 121 URL del sitemap y diez sectoriales originales correctas; diff sin errores.
- Título, H1, canonical, precios, prestaciones y FAQ conservados. Service actualiza su descripción; BreadcrumbList corresponde a la navegación visible.
- Inspección visual en 1280 px y 390 × 844. Precio, alcance y contacto visibles en el primer pantallazo móvil; sin desbordamiento horizontal de página.
- Fotografía cargada con dimensiones naturales 1200 × 1500; menú móvil, cierre por Escape, acordeón y enlace al carrusel comprobados.
- Se actualiza únicamente la fecha de la landing en el sitemap. No se modifica el consentimiento ni la analítica.

El comprobador antiguo esperaba exactamente dos bloques JSON-LD y trataba cualquier enlace externo como un recurso cargado. Se actualiza para comprobar los tres bloques y distinguir los enlaces editoriales de scripts, imágenes, fuentes y otros recursos externos. Se conserva la restricción de dependencias externas.

Evidencias completas y antes/después en outputs/seo-ten-daily-20261106/salones del workspace. QA local con proveedores externos bloqueados; no equivale a medir Core Web Vitals en usuarios reales.

## Publicación

Rama aislada sobre main 2d0605a. Pendiente de aprobación específica de la PR para fusionar y publicar. La preparación de esta landing no completa el bloque de diez.
