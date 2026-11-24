import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => ({
  // Yerel geliştirmede "/", GitHub Pages derlemesinde "/<repo-adi>/" kullanılır.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      // GitHub Pages SPA fallback: bilinmeyen yollar (örn. /book/OL82563W) index.html'i açar.
      name: 'spa-404-fallback',
      apply: 'build',
      closeBundle() {
        const dist = resolve(process.cwd(), 'dist')
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      },
    },
  ],
}))
