// Service Worker for Enhanced Caching Strategy
// Version 1.0.0 - Error-free Fiber Elite Glow

const CACHE_NAME = 'fiber-elite-glow-v1';
const OFFLINE_CACHE = 'fiber-elite-glow-offline-v1';
const CRITICAL_CACHE = 'fiber-elite-glow-critical-v1';
const API_CACHE = 'fiber-elite-glow-api-v1';
const IMAGE_CACHE = 'fiber-elite-glow-images-v1';

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/products',
  '/cart',
  '/checkout',
  '/manifest.json',
  '/_next/static/css/app.css',
  '/_next/static/chunks/framework.js',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// API endpoints to cache with different strategies
const API_CACHE_PATTERNS = [
  { pattern: /^\/api\/products/, strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE, ttl: 300000 }, // 5 minutes
  { pattern: /^\/api\/checkout-session/, strategy: CACHE_STRATEGIES.NETWORK_FIRST, ttl: 60000 }, // 1 minute
  { pattern: /^\/api\/verify-transaction/, strategy: CACHE_STRATEGIES.NETWORK_ONLY, ttl: 0 },
  { pattern: /^\/api\/recover-payment/, strategy: CACHE_STRATEGIES.NETWORK_ONLY, ttl: 0 }
];

// Image patterns for optimized caching
const IMAGE_PATTERNS = [
  /\.(png|jpg|jpeg|webp|avif|svg|ico)$/i,
  /\/_next\/image/,
  /\/assets\//
];

// Utility functions
const isNavigationRequest = (event) => {
  return event.request.mode === 'navigate';
};

const isImageRequest = (request) => {
  return IMAGE_PATTERNS.some(pattern => pattern.test(request.url));
};

const isAPIRequest = (request) => {
  return request.url.includes('/api/');
};

const getAPIStrategy = (url) => {
  const pattern = API_CACHE_PATTERNS.find(p => p.pattern.test(new URL(url).pathname));
  return pattern || { strategy: CACHE_STRATEGIES.NETWORK_FIRST, ttl: 60000 };
};

// Cache management utilities
const addToCache = async (cacheName, request, response) => {
  if (response.status === 200 && response.type === 'basic') {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
};

const getCachedResponse = async (cacheName, request) => {
  const cache = await caches.open(cacheName);
  return await cache.match(request);
};

const isCacheExpired = (response, ttl) => {
  if (!response || !ttl) return false;
  
  const cachedTime = response.headers.get('sw-cached-time');
  if (!cachedTime) return true;
  
  return Date.now() - parseInt(cachedTime) > ttl;
};

const addCacheTimestamp = (response) => {
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers,
      'sw-cached-time': Date.now().toString()
    }
  });
  return newResponse;
};

// Cache strategies implementation
const cacheFirst = async (request, cacheName, fallback = null) => {
  const cachedResponse = await getCachedResponse(cacheName, request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    await addToCache(cacheName, request, networkResponse);
    return networkResponse;
  } catch (error) {
    if (fallback) {
      return await getCachedResponse(OFFLINE_CACHE, fallback);
    }
    throw error;
  }
};

const networkFirst = async (request, cacheName, ttl = 60000) => {
  try {
    const networkResponse = await fetch(request);
    const timestampedResponse = addCacheTimestamp(networkResponse);
    await addToCache(cacheName, request, timestampedResponse);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await getCachedResponse(cacheName, request);
    if (cachedResponse && !isCacheExpired(cachedResponse, ttl)) {
      return cachedResponse;
    }
    throw error;
  }
};

const staleWhileRevalidate = async (request, cacheName, ttl = 300000) => {
  const cachedResponse = await getCachedResponse(cacheName, request);
  
  // Fetch from network in background
  const networkPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.status === 200) {
      const timestampedResponse = addCacheTimestamp(networkResponse);
      await addToCache(cacheName, request, timestampedResponse);
    }
    return networkResponse;
  }).catch(() => null);

  // Return cached version if available and not expired
  if (cachedResponse && !isCacheExpired(cachedResponse, ttl)) {
    networkPromise.catch(() => {}); // Prevent unhandled promise rejection
    return cachedResponse;
  }

  // Wait for network if no cache or expired
  return await networkPromise || cachedResponse;
};

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    (async () => {
      // Cache critical resources
      const criticalCache = await caches.open(CRITICAL_CACHE);
      await criticalCache.addAll(CRITICAL_RESOURCES.filter(url => url.startsWith('/')));
      
      // Cache offline fallback page
      const offlineCache = await caches.open(OFFLINE_CACHE);
      await offlineCache.add('/offline.html');
      
      console.log('[SW] Critical resources cached');
      self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const validCaches = [CACHE_NAME, OFFLINE_CACHE, CRITICAL_CACHE, API_CACHE, IMAGE_CACHE];
      
      // Delete old caches
      await Promise.all(
        cacheNames.map(cacheName => {
          if (!validCaches.includes(cacheName)) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
      
      // Take control of all clients
      await self.clients.claim();
      console.log('[SW] Service worker activated');
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Handle different request types with appropriate strategies
        
        // Navigation requests (pages)
        if (isNavigationRequest(event)) {
          return await handleNavigationRequest(request);
        }
        
        // API requests
        if (isAPIRequest(request)) {
          return await handleAPIRequest(request);
        }
        
        // Image requests
        if (isImageRequest(request)) {
          return await handleImageRequest(request);
        }
        
        // Static assets (_next/static)
        if (url.pathname.startsWith('/_next/static/')) {
          return await cacheFirst(request, CACHE_NAME);
        }
        
        // Other assets
        return await staleWhileRevalidate(request, CACHE_NAME);
        
      } catch (error) {
        console.error('[SW] Fetch error:', error);
        
        // Return offline fallback for navigation requests
        if (isNavigationRequest(event)) {
          return await getCachedResponse(OFFLINE_CACHE, '/offline.html');
        }
        
        // Re-throw for other requests
        throw error;
      }
    })()
  );
});

// Handle navigation requests
const handleNavigationRequest = async (request) => {
  try {
    // Try network first for fresh content
    const networkResponse = await fetch(request);
    await addToCache(CACHE_NAME, request, networkResponse);
    return networkResponse;
  } catch (error) {
    // Fall back to cache
    const cachedResponse = await getCachedResponse(CACHE_NAME, request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fall back to critical cache
    const criticalResponse = await getCachedResponse(CRITICAL_CACHE, request);
    if (criticalResponse) {
      return criticalResponse;
    }
    
    // Ultimate fallback to offline page
    return await getCachedResponse(OFFLINE_CACHE, '/offline.html');
  }
};

// Handle API requests with specific strategies
const handleAPIRequest = async (request) => {
  const { strategy, ttl } = getAPIStrategy(request.url);
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return await cacheFirst(request, API_CACHE);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return await networkFirst(request, API_CACHE, ttl);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return await staleWhileRevalidate(request, API_CACHE, ttl);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return await fetch(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return await getCachedResponse(API_CACHE, request);
    
    default:
      return await networkFirst(request, API_CACHE, ttl);
  }
};

// Handle image requests with optimized caching
const handleImageRequest = async (request) => {
  // Images use cache-first strategy with long TTL
  const cachedResponse = await getCachedResponse(IMAGE_CACHE, request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Only cache successful image responses
    if (networkResponse.status === 200 && networkResponse.headers.get('content-type')?.startsWith('image/')) {
      await addToCache(IMAGE_CACHE, request, networkResponse);
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached version if network fails
    return cachedResponse || Promise.reject(error);
  }
};

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'offline-analytics') {
    event.waitUntil(sendOfflineAnalytics());
  }
});

// Send offline analytics when connection is restored
const sendOfflineAnalytics = async () => {
  try {
    // This would send queued analytics data
    console.log('[SW] Sending offline analytics...');
  } catch (error) {
    console.error('[SW] Failed to send offline analytics:', error);
  }
};

// Push notification handling (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    data: data.data,
    actions: data.actions
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      
      case 'CLEAR_CACHE':
        event.waitUntil(clearAllCaches());
        break;
      
      case 'CACHE_STATS':
        event.waitUntil(getCacheStats().then(stats => {
          event.ports[0].postMessage({ type: 'CACHE_STATS_RESPONSE', stats });
        }));
        break;
    }
  }
});

// Clear all caches
const clearAllCaches = async () => {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('[SW] All caches cleared');
};

// Get cache statistics
const getCacheStats = async () => {
  const cacheNames = await caches.keys();
  const stats = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    stats[name] = keys.length;
  }
  
  return stats;
};

console.log('[SW] Service Worker loaded and ready');