// @waelio Demo — Vanilla JS Service Worker
// Cache-first for static assets, network-first for everything else

const CACHE_NAME = 'waelio-vanilla-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
]

// Install — cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Installing — caching static assets')
      return cache.addAll(STATIC_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
  console.log('[SW] Active — controlling all clients')
})

// Fetch — cache-first for same-origin, network-first for cross-origin
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET and chrome-extension
  if (event.request.method !== 'GET') return
  if (url.protocol === 'chrome-extension:') return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request).then((response) => {
        // Cache successful same-origin responses
        if (response && response.status === 200 && url.origin === location.origin) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      }).catch(() => {
        // Offline fallback for HTML navigation
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html')
        }
      })
    })
  )
})

// Message: skipWaiting from app
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
