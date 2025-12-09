import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Para desarrollo local, deja 'base' comentado o en '/'.
  // Para desplegar en GitHub Pages, descomenta la línea siguiente y pon el nombre de tu repo.
  // base: '/nombre-de-tu-repositorio/',
  build: {
    outDir: 'dist',
  }
})