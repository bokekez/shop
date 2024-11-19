import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/shop/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html', 
      },
    },
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
  resolve: {
    alias: {
      '@': '/src', 
    },
  },
});
