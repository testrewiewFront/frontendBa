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
        target: 'https://api.international-payments.cc/api',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://api.international-payments.cc/api',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
