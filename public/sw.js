// Service Worker for La Belle Vie PWA
const CACHE_NAME = 'la-belle-vie-v1';
const RUNTIME_CACHE = 'la-belle-vie-runtime-v1';

// Assets to cache immediately for offline functionality (only files that actually exist)
const STATIC_CACHE_ASSETS = [
  '/',
  '/products',
  '/ingredients',
  '/contact',
  '/site.webmanifest',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/robots.txt',
  // Critical CSS and JS files will be cached dynamically
];

// API endpoints to cache with network-first strategy
const API_CACHE_PATTERNS = [
  '/api/health',
  '/api/products',
];

// Install event - cache static assets with better error handling
self.addEventListener('install', (event) => {
  console.log('[SW] Install event triggered');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        // Cache assets individually to handle failures gracefully
        return Promise.allSettled(
          STATIC_CACHE_ASSETS.map(async (asset) => {
            try {
              await cache.add(asset);
              console.log('[SW] Cached:', asset);
            } catch (error) {
              console.warn('[SW] Failed to cache:', asset, error);
              // Continue with other assets even if one fails
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Install completed, activating service worker');
        // Skip waiting to activate the new service worker immediately
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error);
        // Still activate the service worker even if caching fails
        self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event triggered');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) =>
              cacheName !== CACHE_NAME &&
              cacheName !== RUNTIME_CACHE
            )
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all open pages immediately
        self.clients.claim();
      })
  );
});

// Network-first strategy for API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful API responses
    if (request.url.startsWith('/api/')) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', request.url);

    // Return cached response if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return a fallback response for API failures
    if (request.url.startsWith('/api/')) {
      return new Response(
        JSON.stringify({
          error: 'Service unavailable',
          offline: true
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    throw error;
  }
}

// Cache-first strategy for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses for static assets
    if (networkResponse.ok && shouldCache(request)) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache and network failed for:', request.url);

    // Return offline fallback for HTML pages
    if (request.destination === 'document') {
      return caches.match('/') || new Response('Offline', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    throw error;
  }
}

// Determine if we should cache this request
function shouldCache(request) {
  const url = new URL(request.url);

  // Don't cache non-GET requests
  if (request.method !== 'GET') return false;

  // Don't cache external API calls
  if (url.hostname !== location.hostname) return false;

  // Cache static assets and pages
  if (
    request.destination === 'document' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/lovable-uploads/')
  ) {
    return true;
  }

  return false;
}

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first strategy for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first strategy for everything else
  event.respondWith(cacheFirst(request));
});

// Background sync for offline actions (optional enhancement)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'background-sync-cart') {
    event.waitUntil(
      // Implement cart synchronization logic here
      console.log('[SW] Syncing cart data in background')
    );
  }
});

// Push notification handling (optional enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const options = {
    body: event.data.text(),
    icon: '/apple-touch-icon.png',
    badge: '/apple-touch-icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Products',
        icon: '/apple-touch-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/apple-touch-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('La Belle Vie', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/products')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync (optional)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync event:', event.tag);

  if (event.tag === 'sync-products') {
    event.waitUntil(
      // Implement periodic product data sync
      console.log('[SW] Syncing product data periodically')
    );
  }
});

console.log('[SW] Service Worker loaded successfully');