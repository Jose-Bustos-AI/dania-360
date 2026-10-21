import './index.css'

// El HTML se genera completo en el prerender. Menú y FAQ funcionan con
// <details> nativos incluso sin JS; solo se añade cierre cómodo del menú.
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
