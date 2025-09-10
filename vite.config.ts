import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
   build: {
    outDir: 'dist'
  },
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://backendba-oqfl.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://backendba-oqfl.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
