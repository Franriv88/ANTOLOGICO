import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDemo = mode === 'demo';

  return {
    plugins: [react()],
    resolve: {
      alias: isDemo
        ? {
            // En demo mode, redirige api.js → api.demo.js (localStorage, sin DataConnect)
            // Nota: sin .js al final — Vite resuelve sin extensión antes de comparar aliases
            [path.resolve(__dirname, 'src/services/api')]:
              path.resolve(__dirname, 'src/services/api.demo.js'),
          }
        : {},
    },
    server: {
      port: 5173,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'credentialless',
      },
      proxy: {
        '/api': { target: 'http://localhost:3001', changeOrigin: true },
      },
    },
    optimizeDeps: {
      exclude: ['@imgly/background-removal'],
    },
  };
});
