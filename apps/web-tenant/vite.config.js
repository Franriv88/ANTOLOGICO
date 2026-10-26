import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDemo = mode === 'demo';

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          id: '/',
          name: 'Antológico',
          short_name: 'Antológico',
          description: 'Descubrí y reservá talleres y workshops cerca tuyo',
          theme_color: '#E85D4A',
          background_color: '#FAF7F2',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/inicio',
          scope: '/',
          categories: ['education', 'lifestyle'],
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icon-1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'any maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
            },
          ],
        },
      }),
    ],
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
