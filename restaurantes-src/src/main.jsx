import './index.css'
import './motion.js'

// El HTML se genera completo en el prerender. Menú y FAQ funcionan con
// <details> nativos incluso sin JS; aquí se añade el cierre cómodo del menú y
// motion.js añade el movimiento ligero (sin React ni librerías).
const mobileMenu = document.querySelector('[data-mobile-nav]')

mobileMenu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) mobileMenu.open = false
})

mobileMenu?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu.open) {
    mobileMenu.open = false
    mobileMenu.querySelector('summary').focus()
  }
})
