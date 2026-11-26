# Paquetes de Dania360

Actualización del 26 de noviembre de 2026 basada en la captura facilitada por el usuario. Afecta a las cien landings sectoriales y a portada, servicio, precios y Murcia. Los importes anteriores de 99, 297 y 497 euros quedan sustituidos por 199, 299 y 499 euros al mes.

## Fuente comercial

`landing-src/config/planes.json` contiene el catálogo único. `render.mjs` genera las tarjetas y las ofertas estructuradas. Los tres generadores del sitio utilizan ese catálogo.

- Starter: web, dominio propio, alojamiento, mantenimiento, SEO, Google Business y Maps, una publicación semanal al conectar la ficha, cinco fichas QR y app con analíticas. Apple Maps y una cuenta de correo con dominio están en progreso.
- Growth: todo Starter y atención con IA en chat web, mensajes y comentarios de Instagram y Facebook, incluido Messenger. Las reseñas de 4 y 5 estrellas se responden automáticamente; las de 1 a 3 requieren aprobación. Correo, SMS, cuentas adicionales y la respuesta opcional a reseñas de 1 a 3 sin aprobación están en progreso.
- Scale: próximo lanzamiento, todavía no disponible. Anuncia publicidad en Instagram y Facebook, 100 USD de inversión al mes y ocho piezas: cuatro vídeos de 30 segundos y cuatro imágenes. TikTok queda para más adelante.

Las funciones pendientes se separan de las listas disponibles. Scale no tiene botón de contratación ni se publica como una oferta disponible en JSON-LD. Se conservan el dominio propio y el trabajo para mejorar la presencia en asistentes con IA; no se inventan las notas de los asteriscos que la captura no muestra, ni garantías de recomendaciones o posiciones.

Growth deja de ofrecer treinta publicaciones mensuales, vídeos de quince segundos, Pinterest o TikTok. Las guías y demostraciones existentes siguen siendo recursos orientativos para cada sector, no entregables mensuales de Growth. LinkedIn, X y YouTube tampoco se incorporan a los nuevos paquetes.

## Reconstrucción

Entorno verificado: Node 24 y Python 3 con Beautiful Soup 4.

Desde la raíz del repositorio:

```powershell
node sector-pages-src/build.mjs
npm --prefix landing-src run build:web
npm --prefix restaurantes-src ci
npm --prefix restaurantes-src run build
node package-src/sync.mjs
python package-src/check.py
```

`sync.mjs` actualiza el bloque comercial de las 104 páginas y sus ofertas estructuradas. Debe ejecutarse después de reconstruir las fuentes. No modifica los textos editoriales ni sustituye la revisión de metadatos y referencias comerciales al cambiar de nuevo los paquetes. Las preguntas de restaurantes proceden de `restaurantes-src/src/faq.json`, compartido entre React y el prerenderizado.

`packages.css` mantiene las tarjetas dentro de la identidad naranja del sitio. Las tres columnas pasan a una sola en móvil. Starter y Growth abren la consulta en WhatsApp con plan e importe correctos; Scale solo informa del próximo lanzamiento.

## Validación

`check.py` revisa las 104 páginas: tarjetas, importes, prestaciones, funciones pendientes, disponibilidad, mensajes de WhatsApp, FAQ visible y estructurada, descripciones únicas, enlaces y anclas. También comprueba los importes y FAQ de los recursos. El resultado se guarda en `validation.json`.

Se conservan los verificadores sectoriales, de SEO del sitio, del generador de salones y de los controles de restaurantes. Sus expectativas comerciales se actualizan al nuevo catálogo. El límite de HTML comprimido de restaurantes pasa de 30 a 32 KB al añadir la explicación completa de los nuevos paquetes y las funciones pendientes; el cliente sigue limitado a 5 KB y 2 KB comprimidos.

Comprobación con el navegador integrado de Codex: tarjetas de las 104 páginas a 390 y 1280 píxeles, sin desbordamientos en las tarjetas; una columna en móvil y tres en escritorio. Revisión visual de precios, peluquerías, restaurantes y una sectorial generada. Scale aparece como próximo lanzamiento. Las capturas de estas revisiones constan en el chat de trabajo.

## Publicación

El trabajo se entrega en una rama y una PR. No se ha fusionado ni desplegado. La publicación en Hostinger requiere la aprobación específica de la PR, conforme a las instrucciones vigentes del proyecto.
