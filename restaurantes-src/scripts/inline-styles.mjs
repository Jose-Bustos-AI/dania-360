// Mantiene la cascada original. Solo el generador decide qué ficheros locales
// permite leer; las hojas externas (por ejemplo Google Fonts) no se modifican.
export async function inlineLocalStyles(document, loadStyle) {
  let result = document
  const seen = new Set()
  for (const [tag] of document.matchAll(/<link\b(?=[^>]*\brel="stylesheet")[^>]*>/g)) {
    const href = tag.match(/\bhref="([^"]+)"/)?.[1]
    if (!href?.startsWith('/') || href.startsWith('//')) continue
    if (seen.has(href)) throw new Error(`Hoja local duplicada: ${href}`)
    seen.add(href)
    const css = (await loadStyle(href)).replace(/\r\n/g, '\n').trim()
    if (/<\/style/i.test(css) || /@import\s/i.test(css)) {
      throw new Error(`CSS no apto para insertar en HTML: ${href}`)
    }
    for (const [, reference] of css.matchAll(/url\(([^)]+)\)/g)) {
      const url = reference.trim().replace(/^['"]|['"]$/g, '')
      if (!/^(?:\/|https?:|data:|#)/i.test(url)) {
        throw new Error(`URL relativa que cambiaría de base al insertar ${href}: ${url}`)
      }
    }
    result = result.replace(tag, () => `<style data-source="${href}">\n${css}\n</style>`)
  }
  return result
}
