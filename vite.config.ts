import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const ghToken = env.VITE_GITHUB_TOKEN || ''

  return {
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'nexus-token-injector',
      // Dev: intercept requests and inject token
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = decodeURIComponent(req.url || '')
          if (url.includes('/nexus/GitHub Nexus.html') || url === '/nexus/' || url === '/nexus') {
            const filePath = path.resolve(__dirname, 'public/nexus/GitHub Nexus.html')
            const html = fs.readFileSync(filePath, 'utf-8')
            const injected = html.replace(
              "window.__GH_TOKEN__ = '';",
              `window.__GH_TOKEN__ = '${ghToken}';`
            )
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(injected)
          } else {
            next()
          }
        })
      },
      // Build: patch the copied static file in dist/
      closeBundle() {
        const outFile = path.resolve(__dirname, 'dist/nexus/GitHub Nexus.html')
        if (fs.existsSync(outFile)) {
          const html = fs.readFileSync(outFile, 'utf-8')
          const patched = html.replace(
            "window.__GH_TOKEN__ = '';",
            `window.__GH_TOKEN__ = '${ghToken}';`
          )
          fs.writeFileSync(outFile, patched)
        }
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  }
})
