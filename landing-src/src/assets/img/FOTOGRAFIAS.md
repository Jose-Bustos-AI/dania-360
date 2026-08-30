# Recursos visuales de la landing

Nueve fotografías y una imagen social, ya colocadas en la landing.

**Los recursos actuales se generaron con IA para esta landing el 30 de agosto de 2026.**
El salón, las profesionales y las clientas son ficticios; no reproducen un negocio,
un perfil social ni una web de terceros. Si se sustituyen por fotografías reales,
deben conservarse la licencia y las cesiones de imagen correspondientes.

Los nueve huecos están activos en `config/fotos.json`. El generador conserva el
mecanismo de reserva: si en el futuro se desactiva una imagen, no emitirá una URL
inexistente y mostrará la composición cálida de respaldo.

## Cómo colocarlas

1. Guarda el archivo en esta carpeta con **exactamente** el nombre indicado.
2. Formato **WebP** (calidad 78–80). Máximo 250 KB por imagen.
3. Pon `disponible: true` en `config/fotos.json`.
4. `cd landing-src && npm run build:web`.

No hay que tocar el HTML.

## Las nueve fotografías

Los tamaños recomendados son el doble del ancho real de renderizado —medido en
la página, no estimado— para que se vean nítidas en pantallas de alta densidad.
Las nueve aparecen **en móvil y en escritorio**; ninguna se oculta.

### 1. `hero-salon.webp`

| | |
| --- | --- |
| Sección | Hero, marco en arco, junto al titular |
| Proporción | 4:5 vertical |
| Tamaño | 1200 × 1500 px |
| Render real | 526 × 658 px en escritorio · 350 × 438 px en móvil |
| Dispositivos | Ambos |
| Texto alternativo | Interior luminoso de un centro de estética con una profesional atendiendo a una clienta |

Es la primera imagen que se ve y la más importante. Interior real del centro,
luz natural, una profesional atendiendo a una clienta. Debe transmitir calma y
cuidado, no actividad frenética. Encima se superponen cuatro etiquetas blancas
en las esquinas: **deja las esquinas despejadas**, sin caras ni detalles
importantes ahí.

### 2. `tratamiento-facial.webp`

| | |
| --- | --- |
| Sección | Resultados, marco grande a la derecha de la lista de beneficios |
| Proporción | 3:4 vertical |
| Tamaño | 1200 × 1600 px |
| Render real | 586 × 781 px en escritorio · 350 × 467 px en móvil |
| Dispositivos | Ambos |
| Texto alternativo | Detalle de un tratamiento facial en un centro de estética |

Un tratamiento facial o corporal en curso. Manos, producto, textura, piel.
Nada invasivo ni clínico: sin agujas, sin aparatología agresiva, sin guantes de
quirófano. La sensación debe ser de bienestar, no de consulta médica.

### 3. `detalle-espacio.webp`

| | |
| --- | --- |
| Sección | Resultados, marco cuadrado superpuesto sobre la anterior |
| Proporción | 1:1 |
| Tamaño | 600 × 600 px |
| Render real | 270 × 270 px en escritorio · 140 × 140 px en móvil |
| Dispositivos | Ambos |
| Texto alternativo | Detalle del espacio del salón: recepción cuidada con productos y flores |

Un plano corto: producto sobre una superficie, flores, una toalla doblada, un
rincón de la recepción. Se ve pequeña y con un borde marfil de 6 px, así que
**tiene que funcionar como textura**: un elemento claro y grande, nada de
escenas con muchos detalles.

### 4. `redes-sociales-movil.webp`

| | |
| --- | --- |
| Sección | Qué gestionamos · 01 Redes sociales |
| Proporción | 16:10 apaisada |
| Tamaño | 1240 × 775 px |
| Render real | 502 × 314 px en escritorio · 350 × 219 px en móvil |
| Dispositivos | Ambos |
| Texto alternativo | Teléfono mostrando el perfil de redes sociales profesional de un centro de estética |

Un teléfono en la mano mostrando un perfil de Instagram de un centro de estética
con una cuadrícula cuidada y coherente. El contenido de la pantalla debe ser
real o una maqueta propia: **no fotografíes el perfil de otro negocio.**

### 5. `recepcion-salon.webp`

| | |
| --- | --- |
| Sección | Qué gestionamos · 02 Google y Maps |
| Proporción | 16:10 apaisada |
| Tamaño | 1240 × 775 px |
| Render real | 614 × 384 px en escritorio · 350 × 219 px en móvil |
| Dispositivos | Ambos |
| Texto alternativo | Recepción de un salón de belleza elegante y ordenado |

La entrada o el mostrador del salón, ordenado y con carácter. Es la imagen que
acompaña al bloque de Google y Maps, así que debe parecer «la foto de portada de
una ficha de empresa»: reconocible, bien iluminada, sin gente de espaldas.

### 6. `web-salon.webp`

| | |
| --- | --- |
| Sección | Qué gestionamos · 03 Página web |
| Proporción | 16:10 apaisada |
| Tamaño | 1240 × 775 px |
| Render real | 502 × 314 px en escritorio · 350 × 219 px en móvil |
| Dispositivos | Ambos |
| Texto alternativo | Página web de un centro de estética vista en un ordenador portátil |

Un portátil sobre una mesa cálida mostrando la web de un centro. Igual que
antes: la web de la pantalla debe ser nuestra o una maqueta propia.

### 7. `contenido-visual.webp`

| | |
| --- | --- |
| Sección | Qué gestionamos · 04 Contenido visual |
| Proporción | 16:10 apaisada |
| Tamaño | 1240 × 775 px |
| Render real | 614 × 384 px en escritorio · 350 × 219 px en móvil |
| Dispositivos | Ambos |
| Texto alternativo | Piezas de contenido visual de un centro de estética: carruseles e imágenes de tratamientos |

Un bodegón cenital: varias piezas gráficas impresas o en pantalla sobre una
superficie clara, con producto alrededor. Debe leerse como «así se presenta tu
trabajo», no como un collage de plantillas.

### 8. `profesional-clienta.webp`

| | |
| --- | --- |
| Sección | Qué gestionamos · 05 Mensajes y reseñas |
| Proporción | 16:10 apaisada |
| Tamaño | 1240 × 775 px |
| Render real | 502 × 314 px en escritorio · 350 × 219 px en móvil |
| Dispositivos | Ambos |
| Texto alternativo | Profesional de estética conversando con una clienta en el salón |

Trato cercano: la profesional escuchando a la clienta, ambas de frente o de
tres cuartos. Es la imagen más humana de la página. Hacen falta **cesiones de
imagen firmadas** de las dos personas.

### 9. `salon-cierre.webp`

| | |
| --- | --- |
| Sección | Cierre, marco en arco junto al CTA final |
| Proporción | 3:4 vertical en escritorio · **4:3 apaisada en móvil** |
| Tamaño | 1200 × 1600 px |
| Render real | 530 × 707 px en escritorio · 350 × 263 px en móvil |
| Dispositivos | Ambos |
| Texto alternativo | Salón de belleza cálido y cuidado, listo para recibir a una clienta |

**Atención: es la única que cambia de proporción.** En móvil se recorta a 4:3
desde el centro, así que el motivo principal debe estar **centrado
verticalmente**, con aire arriba y abajo que se pueda perder sin que la imagen
pierda sentido.

Además va sobre un fondo terracota degradado, así que conviene una toma con
tonos cálidos que no choque: evita azules y verdes dominantes.

## Imagen Open Graph

| | |
| --- | --- |
| Nombre | `og-salones-estetica.jpg` |
| Ubicación | `src/assets/img/` (se publica en `/salones-estetica/assets/img/`) |
| Dimensiones | **1200 × 630 px** (relación 1.91:1) |
| Formato | JPG calidad 82. **Máximo 300 KB.** |
| Dónde se usa | Vista previa al compartir el enlace en WhatsApp, Facebook, LinkedIn y X |
| Texto alternativo | Marketing para centros de estética, un servicio de Dania360 |

JPG y no WebP porque algunas plataformas sociales todavía no generan la vista
previa con WebP.

### Texto que debe aparecer

Solo dos líneas. En WhatsApp esta imagen se ve a unos 250 px de ancho: cualquier
texto por debajo de 30 px de altura (sobre el lienzo de 1200) es ilegible.

1. Titular, en la serif editorial de la landing, unos 78–86 px:
   **Marketing para centros de estética**
2. Línea de apoyo, en sans, unos 34 px, en gris cálido:
   **Web · Redes sociales · Google · Gestionado por Dania360**

Nada más. Sin precio, sin teléfono, sin URL: el precio cambia y el resto ya lo
muestra la propia vista previa.

### Composición recomendada

- Lienzo dividido: **55 % izquierda** en marfil `#FBF7F3` con el texto,
  **45 % derecha** con una fotografía del salón a sangre (sirve un recorte de
  `hero-salon`).
- Separación entre ambas mitades con una curva suave, no una línea recta, en
  coherencia con los marcos en arco de la página.
- Titular en `#2B2521`; la palabra **estética** en cursiva y en terracota
  `#94513A`, igual que los titulares de la landing.
- Logotipo de Dania360 abajo a la izquierda, unos 40 px de alto. Discreto.
- Filete champán `#C7A87C` de 4 px en el borde inferior.
- **Margen de seguridad de 60 px** por todos los lados: algunas plataformas
  recortan a 1.91:1 desde el centro y otras a cuadrado.
- Sin marcas de agua, sin bordes redondeados (se recortan), sin texto sobre la
  fotografía.

Mientras no exista, `config/sitio.json` apunta a `/og.png`, la imagen social
genérica del sitio, para que compartir el enlace no devuelva un 404.

## Criterios comunes a todas

- Luz natural, tonos cálidos, mucho aire. Deben convivir con el marfil `#FBF7F3`.
- Sin imágenes médicas ni invasivas.
- **Sin antes y después.** No se pueden mostrar resultados que no sean reales y
  verificables, y un montaje de ese tipo es además una práctica sancionable en
  publicidad de servicios estéticos.
- Preferible fotografía real de centros con **permiso por escrito**. Si se usa
  banco de imágenes, guarda la licencia junto al proyecto.
- Cesión de imagen firmada de cualquier persona reconocible.

## Optimización

Con `cwebp` (paquete `libwebp`):

```bash
cwebp -q 78 -resize 1200 0 original.jpg -o hero-salon.webp
```

## Carga

El hero entra en la primera pantalla. El resto son fondos CSS: el navegador solo
los descarga cuando el elemento se acerca al viewport, así que el aplazamiento
de la carga ya está resuelto sin `loading="lazy"` ni JavaScript adicional.
