/**
 * Servidor estático mínimo para revisar el sitio generado en local.
 * Solo para desarrollo: sin caché, sin compresión y sin cabeceras de
 * seguridad. En producción sirve el hosting de dania360.com.
 *
 *   npm run build && npm run serve      →  http://localhost:4173/salones-estetica/
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const puerto = Number(process.env.PORT) || 4173;

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

createServer(async (peticion, respuesta) => {
  try {
    const url = new URL(peticion.url, 'http://localhost');
    /* normalize + el prefijo comprobado evitan salir de site/ con "..". */
    let ruta = join(raiz, normalize(decodeURIComponent(url.pathname)));
    if (!ruta.startsWith(raiz)) {
      respuesta.writeHead(403).end('Prohibido');
      return;
    }

    const info = await stat(ruta).catch(() => null);
    if (info?.isDirectory()) ruta = join(ruta, 'index.html');

    const contenido = await readFile(ruta);
    respuesta.writeHead(200, {
      'Content-Type': tipos[extname(ruta)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    respuesta.end(contenido);
  } catch {
    respuesta.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    respuesta.end('<h1>404</h1><p>Prueba con /salones-estetica/</p>');
  }
}).listen(puerto, () => {
  console.log(`http://localhost:${puerto}/salones-estetica/`);
});
