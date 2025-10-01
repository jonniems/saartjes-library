import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/saartjes-library/',
  build: {
    // standaard is 4 KB
    assetsInlineLimit: 100000, // bijv. 100 KB
  },
});
