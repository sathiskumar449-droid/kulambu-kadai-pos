import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    // Allow Vite to fall back to the next free port if 3001 is busy
    strictPort: false
  },
  define: {
    'process.env': {}
  }
})
