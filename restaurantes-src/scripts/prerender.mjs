import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { render } from '../ssr-dist/entry-server.js'

const outputUrl = new URL('../../gestion-redes-sociales-restaurantes/index.html', import.meta.url)
const ssrOutputUrl = new URL('../ssr-dist/', import.meta.url)
const marker = '<!--app-html-->'
const brandStylesheet = '<link rel="stylesheet" href="/brand-orange.css?v=20261001" />'
const html = await readFile(outputUrl, 'utf8')

if (!html.includes(marker)) {
  throw new Error(`No se encontró el marcador ${marker} en ${fileURLToPath(outputUrl)}`)
}

const rendered = render('/gestion-redes-sociales-restaurantes/')
const finalHtml = html
  .replace(marker, rendered)
  .replace(/^[ \t]*<link rel="stylesheet" href="\/brand-orange\.css\?v=20261001" \/>[ \t]*\r?\n/m, '')
  .replace('</head>', `    ${brandStylesheet}\n  </head>`)
  .replace(/\r\n/g, '\n')
await writeFile(outputUrl, finalHtml, 'utf8')
await rm(ssrOutputUrl, { recursive: true, force: true })

console.log(`HTML prerenderizado: ${fileURLToPath(outputUrl)}`)
