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
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    minify: 'terser', // Terser often produces smaller bundles than esbuild
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs
        drop_debugger: true,
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['axios', 'framer-motion', 'lucide-react'],
        }
      }
    }
  }
})
