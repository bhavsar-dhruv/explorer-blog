import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/explorer-blog/',
  build: {
    chunkSizeWarningLimit: 1500, // Increases the warning limit to 1500 kB
  }
})
