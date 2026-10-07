import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { render } from '../ssr-dist/entry-server.js'

const outputUrl = new URL('../../gestion-redes-sociales-restaurantes/index.html', import.meta.url)
const ssrOutputUrl = new URL('../ssr-dist/', import.meta.url)
const marker = '<!--app-html-->'
const brandStylesheet = '<link rel="stylesheet" href="/brand-orange.css?v=20261003-1" />'
const html = await readFile(outputUrl, 'utf8')

if (!html.includes(marker)) {
  throw new Error(`No se encontró el marcador ${marker} en ${fileURLToPath(outputUrl)}`)
}

const rendered = render('/gestion-redes-sociales-restaurantes/')
let finalHtml = html
  .replace(marker, rendered)
  .replace(/^[ \t]*<link rel="stylesheet" href="\/brand-orange\.css\?v=[^"]+" \/>[ \t]*\r?\n/gm, '')
  .replace('</head>', `    ${brandStylesheet}\n  </head>`)
  .replace(/\r\n/g, '\n')

// Esta landing se prerenderiza: incluir sus tres hojas locales en el HTML evita
// tres solicitudes que bloquean la aparición del H1 en conexiones móviles lentas.
// Conservamos el orden original para que la cascada CSS no cambie.
const localStyleLinks = [...finalHtml.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="(\/[^"?]+\.css(?:\?[^\"]*)?)"[^>]*>/g)]
if (localStyleLinks.length !== 3) {
  throw new Error(`Se esperaban 3 hojas CSS locales y se encontraron ${localStyleLinks.length}`)
}

for (const [link, href] of localStyleLinks) {
  const path = href.split('?')[0]
  const cssUrl = new URL(`../../${path.slice(1)}`, import.meta.url)
  const css = await readFile(cssUrl, 'utf8')
  if (css.includes('</style>')) {
    throw new Error(`La hoja ${fileURLToPath(cssUrl)} contiene un cierre de <style>`)
  }
  finalHtml = finalHtml.replace(link, `<style data-inline-source="${path}">${css}</style>`)
}

await writeFile(outputUrl, finalHtml, 'utf8')
await rm(ssrOutputUrl, { recursive: true, force: true })

console.log(`HTML prerenderizado: ${fileURLToPath(outputUrl)}`)
