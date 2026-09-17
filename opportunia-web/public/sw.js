// Opportunia Progressive Web App (PWA) Service Worker
const CACHE_NAME = 'opportunia-v1'

const PRECACHE_ASSETS = [
  '/',
  '/profil',
  '/dashboard',
  '/opportunites',
  '/sauvegardees',
  '/manifest.webmanifest',
  '/data/opportunities.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install event: Pre-cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA SW] Pre-caching partial error:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate event: clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event: Network-first for dynamic navigation, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return
  }

  // Handle data requests and navigation with stale-while-revalidate or cache fallback
  if (request.headers.get('accept')?.includes('text/html') || request.url.includes('/data/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return networkResponse
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request)
          if (cachedResponse) return cachedResponse
          // Fallback to offline home page
          return caches.match('/')
        })
    )
    return
  }

  // Cache-first for images, fonts, scripts, stylesheets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached and update in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse))
            }
          })
          .catch(() => {})
        return cachedResponse
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return networkResponse
      })
    })
  )
})
