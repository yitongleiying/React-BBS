import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    hmr: true,
    port: 3004,
    proxy: {
      '/api': {
        target: 'http://localhost:7070',
        changeOrigin: true,
        pathRewrite: {
          '^api': '/api'
        }
      }
    }
  }
})
