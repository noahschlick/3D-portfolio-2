import { defineConfig } from 'vite'

export default defineConfig({
  root: 'static',
  server: {
    port: 3000,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'static/index.html',
        blog: 'static/blog.html',
        'blog-fluthered': 'static/blog-fluthered.html',
        'blog-stoic-philosopher': 'static/blog-stoic-philosopher.html',
        'blog-tic-tac-toe': 'static/blog-tic-tac-toe.html',
        'blog-event-scout': 'static/blog-event-scout.html'
      }
    },
    copyPublicDir: true
  },
  publicDir: 'assets'
})
