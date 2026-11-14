// Movimiento ligero y sin librerías sobre el HTML ya prerenderizado.
// Con "reducir movimiento" el CSS cambia desplazamientos por fundidos; la
// página sigue viva (chat, pizarra, pestañas y contadores), sin inclinaciones.
const root = document.documentElement
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const IO = window.IntersectionObserver
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)]
const once = (elements, run, options) => {
  if (!IO) return elements.forEach(run)
  const observer = new IO((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { observer.unobserve(entry.target); run(entry.target) }
  }), options)
  elements.forEach((element) => observer.observe(element))
}
root.classList.add('js')
if (reduce) root.classList.add('calm')

// Barra de progreso de lectura.
const bar = document.querySelector('.progress span')
if (bar) {
  let frame = 0
  const update = () => {
    const max = root.scrollHeight - innerHeight
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`
    frame = 0
  }
  addEventListener('scroll', () => { frame ||= requestAnimationFrame(update) }, { passive: true })
  update()
}

// WhatsApp flotante: aparece al pasar el hero y enseña su texto un momento.
const float = document.querySelector('.wa-float')
const hero = document.querySelector('.hero')
if (float && hero && IO) {
  let shown = false
  new IO(([entry]) => {
    float.classList.toggle('is-on', !entry.isIntersecting)
    if (!entry.isIntersecting && !shown) {
      shown = true
      float.classList.add('is-open')
      setTimeout(() => float.classList.remove('is-open'), 4500)
    }
  }, { threshold: 0.15 }).observe(hero)
} else float?.classList.add('is-on')

// Elementos que cambian solos: publicaciones, plato del día, día de la
// pizarra y chat de reservas (este último acumula mensajes y vuelve a empezar).
$$('[data-cycle]').forEach((box) => {
  const items = [...box.children]
  const stack = box.dataset.cycle === 'stack'
  const set = (index, on) => items[index]?.classList.toggle('on', on)
  let current = 0
  const tick = () => {
    if (document.hidden) return
    if (!stack) { set(current, false); current = (current + 1) % items.length; set(current, true); return }
    if (current > items.length + 1) { items.forEach((_, index) => set(index, false)); current = 0 }
    if (items[current - 1]?.hasAttribute('data-typing')) set(current - 1, false)
    set(current++, true)
  }
  stack ? tick() : set(0, true)
  setInterval(tick, Number(box.dataset.ms) || 2600)
})

// Pestañas por tipo de local: rotan solas hasta que alguien las toca.
$$('[data-tabs]').forEach((box) => {
  const tabs = $$('[role="tab"]', box)
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')))
  let current = 0
  let timer = 0
  const select = (index, focus) => {
    current = index
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index))
      tab.tabIndex = i === index ? 0 : -1
      panels[i].hidden = i !== index
    })
    box.classList.remove('run')
    void box.offsetWidth
    box.classList.add('run')
    if (focus) tabs[index].focus()
  }
  const stop = () => { clearInterval(timer); timer = 0; box.classList.add('is-manual') }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { stop(); select(i) })
    tab.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
      if (!step) return
      event.preventDefault()
      stop()
      select((i + step + tabs.length) % tabs.length, true)
    })
  })
  box.addEventListener('focusin', stop)
  select(0)
  if (IO) new IO(([entry]) => {
    if (entry.isIntersecting && !timer && !box.classList.contains('is-manual')) {
      box.classList.add('is-auto')
      timer = setInterval(() => select((current + 1) % tabs.length), 6500)
    } else if (!entry.isIntersecting && timer) {
      clearInterval(timer); timer = 0; box.classList.remove('is-auto')
    }
  }, { threshold: 0.35 }).observe(box)
})

// Inclinación suave hacia el ratón (solo con ratón y sin reducir movimiento).
if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  $$('.tilt').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`
    })
    card.addEventListener('pointerleave', () => { card.style.transform = '' })
  })
}

// Aparición al entrar en pantalla (solo fundido si se reduce el movimiento).
once($$('.reveal'), (element) => element.classList.add('is-visible'), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

// Contadores: cuentan hasta el valor real, que ya está escrito en el HTML.
once($$('[data-count]'), (element) => {
  const target = Number(element.dataset.count)
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / 1200)
    element.textContent = String(Math.round(target * (1 - (1 - t) ** 3)))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}, { threshold: 0.6 })
