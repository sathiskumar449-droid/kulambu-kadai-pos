import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Simple plugin to run Vercel serverless functions in Vite dev server
const vercelApiDevPlugin = () => {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()

        try {
          const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
          let handlerPath = urlObj.pathname
          let modulePath = path.join(__dirname, handlerPath + '.js')

          if (!fs.existsSync(modulePath)) {
            return next()
          }

          // Inject env vars if missing
          const env = loadEnv(server.config.mode, process.cwd(), '')
          process.env.SUPABASE_URL = process.env.SUPABASE_URL || env.VITE_SUPABASE_URL
          process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY

          console.log(`[Proxy] Executing ${handlerPath}, SUPABASE_URL: ${process.env.SUPABASE_URL}`)

          // Dynamic import (appended timestamp to avoid caching issues during dev)
          const moduleUrl = 'file://' + modulePath.replace(/\\/g, '/') + '?t=' + Date.now()
          const module = await import(moduleUrl)
          const handler = module.default

          if (typeof handler !== 'function') return next()

          // Parse body for POST/PUT/PATCH
          let body = {}
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            body = await new Promise((resolve) => {
              let data = ''
              req.on('data', chunk => { data += chunk })
              req.on('end', () => {
                try { resolve(data ? JSON.parse(data) : {}) }
                catch (e) { resolve({}) }
              })
            })
          }
          req.body = body

          // Mock req.query
          req.query = Object.fromEntries(urlObj.searchParams.entries())

          // Mock Express-like response methods used in Vercel functions
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
          }
          res.send = (data) => {
            res.end(data)
          }

          await handler(req, res)
        } catch (e) {
          console.error('API proxy error:', e)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e.message }))
          }
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  server: {
    port: 3002,
    strictPort: false
  },
  define: {
    'process.env': {}
  }
})
