import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
       tailwindcss()],
  server: {
    // Dev proxy to avoid CORS when calling the remote API during development.
    // Requests to /Login will be forwarded to the real API host. If you prefer
    // to use a different path (e.g. /api), adjust both the proxy and the code.
    proxy: {
      '/Login': {
        target: 'https://mgmtapi.nagarkaryavalinewuat.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/Login/, '/Login')
      }
    }
  }
})
