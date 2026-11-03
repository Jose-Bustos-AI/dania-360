import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { gzipSync } from 'node:zlib'
import { inlineLocalStyles } from './inline-styles.mjs'

test('Inserta estilos locales en su posición y conserva las hojas externas', async () => {
  const input = '<head><link rel="stylesheet" href="/first.css"><link rel="stylesheet" href="https://fonts.example/style.css"><link rel="stylesheet" href="/last.css?v=1"></head>'
  const output = await inlineLocalStyles(input, async (href) => `/* ${href} */ h1{color:#111}p::after{content:"$&"}`)
  assert.ok(output.indexOf('data-source="/first.css"') < output.indexOf('https://fonts.example/style.css'))
  assert.ok(output.indexOf('data-source="/last.css?v=1"') > output.indexOf('https://fonts.example/style.css'))
  assert.match(output, /<link rel="stylesheet" href="https:\/\/fonts.example\/style.css">/)
  assert.equal((output.match(/<style /g) ?? []).length, 2)
  assert.ok(output.includes('content:"$&"'), 'El reemplazo no debe interpretar texto CSS como sustitución de String.replace')
})

test('Rechaza duplicados, cierres de style, imports y URL relativas', async () => {
  const tag = '<link rel="stylesheet" href="/test.css">'
  await assert.rejects(inlineLocalStyles(tag + tag, async () => 'h1{color:red}'), /duplicada/)
  await assert.rejects(inlineLocalStyles(tag, async () => '</style>'), /no apto/)
  await assert.rejects(inlineLocalStyles(tag, async () => '@import "other.css";'), /no apto/)
  await assert.rejects(inlineLocalStyles(tag, async () => 'div{background:url(./image.webp)}'), /relativa/)
})

test('HTML generado sin CSS local bloqueante y sincronizado con las fuentes', () => {
  const html = readFileSync(new URL('../../gestion-redes-sociales-restaurantes/index.html', import.meta.url), 'utf8')
  const styles = [...html.matchAll(/<style data-source="([^"]+)">\n([\s\S]*?)\n<\/style>/g)]
  assert.equal(styles.length, 4)
  assert.deepEqual(styles.map(([, href]) => href.split('?')[0]).filter((href) => !href.includes('/assets/')), ['/sector-seo.css', '/sector-offer.css', '/brand-orange.css'])
  assert.equal(styles.at(-1)[1], '/brand-orange.css?v=20261003-1', 'La marca sigue siendo la última capa')
  assert.doesNotMatch(html, /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="\/)[^>]*>/)
  for (const [, href, css] of styles) {
    const source = readFileSync(new URL(`../..${href.split('?')[0]}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n').trim()
    assert.equal(css, source, `No debe quedar una copia desactualizada de ${href}`)
  }
  assert.ok(Buffer.byteLength(html) < 150000, 'Presupuesto del HTML sin comprimir')
  assert.ok(gzipSync(html).length < 30000, 'Presupuesto del HTML comprimido')
})
