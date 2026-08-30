# Fotografías pendientes

Ninguna de estas imágenes está incluida todavía. **No se ha descargado ni
enlazado ninguna fotografía de terceros**: hacerlo sin licencia expone al
negocio a una reclamación, y enlazar a un servidor ajeno (hotlink) añade
además una dependencia que puede romperse cualquier día.

Mientras falten, la landing **no se ve rota**. Cada hueco es un contenedor con
la imagen declarada en la variable CSS `--foto`; si el archivo no existe, esa
capa no pinta y queda debajo un degradado cálido con una trama fina, que forma
parte del diseño. No aparece ningún icono de imagen rota ni ningún hueco vacío.

## Cómo sustituirlas

1. Guarda el archivo en esta carpeta con **exactamente** el nombre indicado.
2. Formato **WebP** (o AVIF, cambiando la extensión también en el HTML).
3. Vuelve a generar el sitio: `npm run build`.

No hay que tocar el HTML si se respeta el nombre y la extensión.

## Listado

| Archivo | Dónde aparece | Proporción | Ancho recomendado | Qué debe mostrar |
| --- | --- | --- | --- | --- |
| `hero-salon.webp` | Hero, marco en arco | 4:5 | 1200 px | Interior luminoso del centro con una profesional atendiendo a una clienta. Es la primera imagen: la más cuidada. |
| `tratamiento-facial.webp` | Resultados, marco alto | 3:4 | 900 px | Tratamiento facial o de belleza en curso. Manos, producto, calma. Sin nada invasivo ni clínico. |
| `detalle-espacio.webp` | Resultados, marco cuadrado superpuesto | 1:1 | 600 px | Detalle del espacio: recepción, producto, flores, textura. |
| `redes-sociales-movil.webp` | Servicios 01 | 16:10 | 1100 px | Un teléfono mostrando un perfil de redes profesional y activo de un centro de estética. |
| `recepcion-salon.webp` | Servicios 02 | 16:10 | 1100 px | Recepción del salón, elegante y ordenada. |
| `web-salon.webp` | Servicios 03 | 16:10 | 1100 px | La web del centro vista en un portátil, en un entorno cálido. |
| `contenido-visual.webp` | Servicios 04 | 16:10 | 1100 px | Piezas de contenido: carruseles, fotografías de tratamientos, composición sobre superficie clara. |
| `profesional-clienta.webp` | Servicios 05 | 16:10 | 1100 px | Profesional conversando con una clienta. Trato cercano. |
| `salon-cierre.webp` | Cierre, marco en arco | 3:4 | 1000 px | Salón cálido y cuidado, listo para recibir. Debe funcionar sobre fondo terracota. |
| `og-salones-estetica.jpg` | Open Graph y Twitter Card | 1200 × 630 | 1200 px | Imagen de presentación al compartir el enlace. JPG por compatibilidad con las plataformas sociales. |

## Criterios

- Luz natural, tonos cálidos, mucho aire. Deben convivir con el marfil de la
  página.
- Sin imágenes médicas ni invasivas.
- **Sin antes y después.** No se pueden mostrar resultados que no sean reales y
  verificables, y un montaje de ese tipo es además una práctica sancionable en
  publicidad sanitaria y estética.
- Preferible fotografía real de centros con permiso por escrito. Si se usa banco
  de imágenes, guardar la licencia junto al proyecto.
- Optimizar antes de subir: WebP con calidad 75–80 y el ancho de la tabla es
  suficiente. Ninguna imagen debería superar los 250 KB.

## Optimización

Con `cwebp` (paquete `libwebp`):

```bash
cwebp -q 78 -resize 1200 0 original.jpg -o hero-salon.webp
```

## Carga

El hero se carga de inmediato porque entra en la primera pantalla. El resto de
huecos son fondos CSS: el navegador solo los descarga cuando el elemento se
aproxima al viewport, de modo que el aplazamiento de la carga ya está resuelto
sin `loading="lazy"` ni JavaScript adicional.
