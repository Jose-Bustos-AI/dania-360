import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { gzipSync } from 'node:zlib'

const html = readFileSync(new URL('../../gestion-redes-sociales-restaurantes/index.html', import.meta.url), 'utf8')
const entry = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8').replace(/^import[^\n]+\n/gm, '')
const plain = (value) => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
const faqs = [...html.matchAll(/<details name="restaurant-faq"([^>]*)>([\s\S]*?)<\/details>/g)]

test('Contenido comercial y preguntas completas en HTML, sin hidratación', () => {
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
  assert.match(plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]), /^Gestión de redes sociales para restaurantes\.$/)
  assert.match(html, /<details class="mobile-nav" data-mobile-nav="">/)
  assert.match(html, /<summary class="menu-button" aria-label="Menú de navegación">/)
  assert.equal(faqs.length, 11)
  assert.equal(faqs.filter(([, attributes]) => /\bopen(?:=|\s|$)/.test(attributes)).length, 1)
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph']
  const faqSchema = graph.find((entity) => entity['@type'] === 'FAQPage')
  assert.equal(faqSchema.mainEntity.length, faqs.length)
  for (const [index, [, , detail]] of faqs.entries()) {
    assert.equal(plain(detail.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)[1]), faqSchema.mainEntity[index].name)
    assert.equal(plain(detail.match(/<p>([\s\S]*?)<\/p>/)[1]), faqSchema.mainEntity[index].acceptedAnswer.text)
  }
})

test('Presupuesto del cliente: menos de 5 KB y 2 KB gzip, sin React', () => {
  const path = html.match(/<script type="module" crossorigin src="(\/gestion-redes-sociales-restaurantes\/assets\/[^\"]+\.js)">/)[1]
  const file = new URL(`../..${path}`, import.meta.url)
  const code = readFileSync(file)
  assert.ok(statSync(file).size < 5000, 'El JS no debe volver a incluir el framework')
  assert.ok(gzipSync(code).length < 2000, 'Presupuesto de transferencia comprimida')
  assert.doesNotMatch(entry, /react-dom|hydrateRoot|createRoot/)
})

function menuHarness() {
  const listeners = new Map()
  let focused = false
  const menu = {
    open: true,
    addEventListener: (name, listener) => listeners.set(name, listener),
    querySelector: () => ({ focus: () => { focused = true } }),
  }
  runInNewContext(entry, { document: { querySelector: () => menu } })
  return { menu, listeners, focused: () => focused }
}

test('Elegir un enlace cierra el menú, otros clics no', () => {
  const h = menuHarness()
  h.listeners.get('click')({ target: { closest: () => null } })
  assert.equal(h.menu.open, true)
  h.listeners.get('click')({ target: { closest: () => ({}) } })
  assert.equal(h.menu.open, false)
})

test('Escape cierra y devuelve foco al control, sin interferir al estar cerrado', () => {
  const h = menuHarness()
  h.listeners.get('keydown')({ key: 'Enter' })
  assert.equal(h.menu.open, true)
  h.listeners.get('keydown')({ key: 'Escape' })
  assert.equal(h.menu.open, false)
  assert.equal(h.focused(), true)
  const closed = menuHarness()
  closed.menu.open = false
  closed.listeners.get('keydown')({ key: 'Escape' })
  assert.equal(closed.focused(), false)
})

test('Entrada segura si no existe menú móvil', () => {
  assert.doesNotThrow(() => runInNewContext(entry, { document: { querySelector: () => null } }))
})
