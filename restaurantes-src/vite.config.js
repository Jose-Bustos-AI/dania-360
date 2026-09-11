import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/gestion-redes-sociales-restaurantes/',
  build: {
    outDir: '../gestion-redes-sociales-restaurantes',
    emptyOutDir: true,
  },
})
