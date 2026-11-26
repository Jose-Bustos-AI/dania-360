import {packageOffers} from '../../package-src/render.mjs'
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { render } from '../ssr-dist/entry-server.js'
import { inlineLocalStyles } from './inline-styles.mjs'

const outputUrl = new URL('../../gestion-redes-sociales-restaurantes/index.html', import.meta.url)
const ssrOutputUrl = new URL('../ssr-dist/', import.meta.url)
const marker = '<!--app-html-->'
const brandStylesheet = '<link rel="stylesheet" href="/brand-orange.css?v=20261003-1" />'
const html = await readFile(outputUrl, 'utf8')

if (!html.includes(marker)) {
  throw new Error(`No se encontró el marcador ${marker} en ${fileURLToPath(outputUrl)}`)
}

const rendered = render('/gestion-redes-sociales-restaurantes/')
const renderedHtml = html
  .replace(marker, rendered)
  .replace(/^[ \t]*<link rel="stylesheet" href="\/brand-orange\.css\?v=[^"]+" \/>[ \t]*\r?\n/gm, '')
  .replace('</head>', `    ${brandStylesheet}\n  </head>`)
  .replace(/\r\n/g, '\n')
const finalHtml = await inlineLocalStyles(renderedHtml, async (href) => {
  const path = new URL(href, 'https://dania360.com').pathname
  const shared = ['/sector-seo.css', '/sector-offer.css', '/brand-orange.css', '/packages.css']
  if (!shared.includes(path) && !/^\/gestion-redes-sociales-restaurantes\/assets\/[\w-]+\.css$/.test(path)) {
    throw new Error(`Hoja local fuera del alcance del generador: ${path}`)
  }
  return readFile(new URL(`../..${path}`, import.meta.url), 'utf8')
})
const faq = JSON.parse(await readFile(new URL('../src/faq.json', import.meta.url), 'utf8'))
const syncedHtml = finalHtml.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (_, raw) => {
  const data = JSON.parse(raw)
  for (const entity of data['@graph'] ?? []) {
    if (entity['@type'] === 'Service') entity.offers = packageOffers('https://dania360.com/gestion-redes-sociales-restaurantes/')
    if (entity['@type'] === 'FAQPage') entity.mainEntity = faq.map(([name,text]) => ({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))
  }
  return '<script type="application/ld+json">'+JSON.stringify(data)+'</script>'
})
await writeFile(outputUrl, syncedHtml, 'utf8')
await rm(ssrOutputUrl, { recursive: true, force: true })

console.log(`HTML prerenderizado: ${fileURLToPath(outputUrl)}`)
