import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'node:path';
import TanStackRouterVite from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  base: '/cms/',

  server: {
    host: '0.0.0.0',
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
