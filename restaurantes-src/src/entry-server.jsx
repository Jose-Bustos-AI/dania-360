import { renderToString } from 'react-dom/server'
import App from './App.jsx'

export function render(pathname = '/gestion-redes-sociales-restaurantes/') {
  return renderToString(<App initialPath={pathname} />)
}
