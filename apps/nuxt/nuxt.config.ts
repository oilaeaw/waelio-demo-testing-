// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '@waelio Demo — Nuxt 3',
      short_name: 'waelio-nuxt',
      description: 'All @waelio packages in Nuxt 3 — installable PWA',
      theme_color: '#00DC82',
      background_color: '#0a0a0f',
      display: 'standalone',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}']
    },
    client: { installPrompt: true },
    devOptions: { enabled: true, suppressWarnings: true, type: 'module' }
  },
  app: {
    head: {
      title: '@waelio packages — Nuxt 3 Demo',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap' }
      ],
      meta: [
        { name: 'theme-color', content: '#00DC82' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' }
      ]
    }
  },
  runtimeConfig: {
    public: { framework: 'nuxt' }
  }
})
