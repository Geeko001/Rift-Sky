import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Rift Sky',
        short_name: 'Sky',
        description: 'Hyper-local Rift Ecosystem weather app.',
        theme_color: '#08080A',
        background_color: '#08080A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Cache Open-Meteo API requests for 15 minutes
        runtimeCaching: [{
          urlPattern: /^https:\/\/api\.open-meteo\.com\/v1\/forecast/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'weather-data',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 15 // 15 minutes
            }
          }
        }]
      }
    })
  ],
})
