import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8042',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:1234',
        changeOrigin: true,
        ws: true,
        rewrite: (path: string) => path.replace('/ws', ''),
      }
    },
  },
});
