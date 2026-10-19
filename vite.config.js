import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-to-server-public',
      closeBundle() {
        const distDir = path.resolve(process.cwd(), 'dist')
        const serverPublicDir = path.resolve(process.cwd(), 'server/public')
        if (fs.existsSync(distDir)) {
          fs.cpSync(distDir, serverPublicDir, { recursive: true })
        }
      }
    }
  ],
})
