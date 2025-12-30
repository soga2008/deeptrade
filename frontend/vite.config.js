import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for Electron
  server: {
    port: 5173,
    strictPort: false, // Allow using next available port if 5173 is busy
    host: true, // Listen on all addresses
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // Fix CJS deprecation warning
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
})
