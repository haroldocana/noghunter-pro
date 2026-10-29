import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige todas las llamadas de React que empiecen con /api hacia tu backend
      '/api': {
        target: 'http://localhost:10000', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
