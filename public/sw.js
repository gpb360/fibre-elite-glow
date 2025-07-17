// Service Worker for Performance Optimization
const CACHE_NAME = 'fibre-elite-glow-v1';
const STATIC_CACHE_NAME = 'static-v1';

// Cache critical assets
const urlsToCache = [
  '/',
  '/products',
  '/cart',
  '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp',
  '/lovable-uploads/webp/5f8f72e3-397f-47a4-8bce-f15924c32a34.webp',
  '/_next/static/css/app/layout.css'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Cache strategy for different types of requests
  if (event.request.destination === 'image') {
    // Cache images aggressively
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  } else if (event.request.destination === 'document') {
    // Network first for HTML pages
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  } else {
    // Cache first for other resources
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});