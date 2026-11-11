import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    port: 5173,
    // Spring Boot на :8080 — поменяй, если порт другой
    proxy: { '/api': 'http://localhost:1488' },
  },
  build: {
    // собираем прямо в static Spring Boot'а
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
})
