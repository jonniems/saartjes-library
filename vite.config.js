import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true, // Voegt een width/height van 1em toe
      },
    }),
  ],
  build: {
    // standaard is 4 KB
    assetsInlineLimit: 100000, // bijv. 100 KB
  },
});
