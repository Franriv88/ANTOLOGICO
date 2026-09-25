import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDemo = mode === 'demo';

  return {
    plugins: [react()],
    resolve: {
      // Regex alias: cualquier import que termine en /services/api → api.demo.js
      alias: isDemo
        ? [{ find: /^.*\/services\/api$/, replacement: path.resolve(__dirname, 'src/services/api.demo.js') }]
        : [],
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
