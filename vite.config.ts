import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  preview: {
    allowedHosts: [
      'aarc-intentx-deposit.onrender.com',
      '.onrender.com' // This will allow all subdomains on render.com
    ]
  },
  server: {
    proxy: {
      '/api/onebalance': {
        target: 'https://be.onebalance.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/onebalance/, '')
      }
    }
  }
})
