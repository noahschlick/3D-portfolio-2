import { defineConfig } from 'vite'

export default defineConfig({
  root: 'static',
  server: {
    port: 3000,
    // Removed proxy configuration - serve static files directly
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
