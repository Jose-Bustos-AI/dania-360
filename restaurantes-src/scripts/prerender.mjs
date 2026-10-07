import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { render } from '../ssr-dist/entry-server.js'

const outputUrl = new URL('../../gestion-redes-sociales-restaurantes/index.html', import.meta.url)
const ssrOutputUrl = new URL('../ssr-dist/', import.meta.url)
const sectorStylesUrl = new URL('../../sector-seo.css', import.meta.url)
const brandStylesUrl = new URL('../../brand-orange.css', import.meta.url)
const marker = '<!--app-html-->'
const html = await readFile(outputUrl, 'utf8')
const [sectorStyles, brandStyles] = await Promise.all([
  readFile(sectorStylesUrl, 'utf8'),
  readFile(brandStylesUrl, 'utf8'),
])

if (!html.includes(marker)) {
  throw new Error(`No se encontró el marcador ${marker} en ${fileURLToPath(outputUrl)}`)
}

const rendered = render('/gestion-redes-sociales-restaurantes/')
const sectorStylesheet = '<link rel="stylesheet" href="/sector-seo.css?v=20260914">'
if (!html.includes(sectorStylesheet)) {
  throw new Error(`No se encontró la hoja sectorial en ${fileURLToPath(outputUrl)}`)
}

const finalHtml = html
  .replace(marker, rendered)
  .replace(sectorStylesheet, `<style data-inline-styles="sector-seo">\n${sectorStyles}\n</style>`)
  .replace(/^[ \t]*<link rel="stylesheet" href="\/brand-orange\.css\?v=[^"]+" \/>[ \t]*\r?\n/gm, '')
  .replace('</head>', `    <style data-inline-styles="brand-orange">\n${brandStyles}\n</style>\n  </head>`)
  .replace(/\r\n/g, '\n')
await writeFile(outputUrl, finalHtml, 'utf8')
await rm(ssrOutputUrl, { recursive: true, force: true })

console.log(`HTML prerenderizado: ${fileURLToPath(outputUrl)}`)
