import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,  // Enable source maps for debugging in production
    minify: false,    // Disable minification (optional, useful for debugging)
  },
})
