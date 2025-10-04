import { defineConfig } from 'vite'

export default defineConfig({
  root: 'static',
  server: {
    port: 3000,
    proxy: {
      // Proxy API calls to your FastAPI server
      '/api': 'http://localhost:8000',
      '/blog': 'http://localhost:8000',
      '/portfolio-stage': 'http://localhost:8000'
    }
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: 'static/js/portfolio-3d.js'
      }
    }
  }
})
