import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // Auto-open browser on server start
    hmr: {
      overlay: true, // Show errors as overlay
    },
    watch: {
      usePolling: true, // Better file watching on Windows
    }
  },
  build: {
    sourcemap: true, // Enable source maps for debugging
  }
})
