// /client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['esbuild'], // ✅ add this line to avoid internalizing esbuild
    },
  },
});

