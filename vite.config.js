// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000', // <-- set to your backend port
        changeOrigin: true,
        secure: false
      }
    }
  }
})