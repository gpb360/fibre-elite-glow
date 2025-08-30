import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isActive: boolean;
  registration: ServiceWorkerRegistration | null;
  error: string | null;
}

interface CacheStats {
  [cacheName: string]: number;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isActive: false,
    registration: null,
    error: null
  });

  const [cacheStats, setCacheStats] = useState<CacheStats>({});
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      setState(prev => ({ ...prev, isSupported: false }));
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));

    const registerServiceWorker = async () => {
      try {
        console.log('🔄 Registering service worker...');
        
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });

        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration
        }));

        // Handle service worker states
        if (registration.installing) {
          setState(prev => ({ ...prev, isInstalling: true }));
          trackServiceWorkerState(registration.installing);
        } else if (registration.waiting) {
          setState(prev => ({ ...prev, isWaiting: true }));
          setUpdateAvailable(true);
        } else if (registration.active) {
          setState(prev => ({ ...prev, isActive: true }));
        }

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('🆕 Service worker update found');
          const newWorker = registration.installing;
          if (newWorker) {
            setState(prev => ({ ...prev, isInstalling: true }));
            trackServiceWorkerState(newWorker);
          }
        });

        console.log('✅ Service worker registered successfully');

      } catch (error) {
        console.error('❌ Service worker registration failed:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed'
        }));
      }
    };

    registerServiceWorker();

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    // Listen for controller change (new service worker took control)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service worker controller changed');
      window.location.reload();
    });

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);

  const trackServiceWorkerState = (worker: ServiceWorker) => {
    worker.addEventListener('statechange', () => {
      console.log('🔄 Service worker state changed:', worker.state);
      
      setState(prev => ({
        ...prev,
        isInstalling: worker.state === 'installing',
        isWaiting: worker.state === 'installed',
        isActive: worker.state === 'activated'
      }));

      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        setUpdateAvailable(true);
      }
    });
  };

  const handleServiceWorkerMessage = (event: MessageEvent) => {
    if (event.data?.type === 'CACHE_STATS_RESPONSE') {
      setCacheStats(event.data.stats);
    }
  };

  const skipWaiting = () => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    }
  };

  const clearCache = async () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }
  };

  const getCacheStats = () => {
    if (navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = handleServiceWorkerMessage;
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'CACHE_STATS' }, 
        [messageChannel.port2]
      );
    }
  };

  const unregister = async () => {
    if (state.registration) {
      const result = await state.registration.unregister();
      if (result) {
        setState(prev => ({
          ...prev,
          isRegistered: false,
          registration: null
        }));
      }
      return result;
    }
    return false;
  };

  return {
    ...state,
    cacheStats,
    updateAvailable,
    skipWaiting,
    clearCache,
    getCacheStats,
    unregister
  };
}

// React component for service worker management
export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const sw = useServiceWorker();

  // Auto-register on production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && sw.isSupported && !sw.isRegistered) {
      console.log('🚀 Production mode: Service worker will be registered automatically');
    }
  }, [sw.isSupported, sw.isRegistered]);

  return (
    <>
      {children}
      {sw.updateAvailable && <UpdateNotification onUpdate={sw.skipWaiting} />}
    </>
  );
}

// Update notification component
function UpdateNotification({ onUpdate }: { onUpdate: () => void }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-medium">Update Available</h3>
          <p className="text-sm opacity-90 mt-1">
            A new version of the app is available. Update now for the latest features and improvements.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                onUpdate();
                setVisible(false);
              }}
              className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Update
            </button>
            <button
              onClick={() => setVisible(false)}
              className="text-white opacity-75 hover:opacity-100 px-3 py-1 rounded text-sm transition-opacity"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 text-white opacity-75 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Hook for offline/online status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show reconnection message
        console.log('🌐 Back online! Syncing data...');
        // Trigger sync events here
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      console.log('📴 Gone offline. Using cached content...');
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return {
    isOnline,
    wasOffline,
    isSupported: typeof window !== 'undefined' && 'navigator' in window && 'onLine' in navigator
  };
}

// Cache management utilities
export const CacheUtils = {
  // Preload critical resources
  preloadCriticalResources: async (urls: string[]) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      for (const url of urls) {
        try {
          await fetch(url, { mode: 'no-cors' });
        } catch (error) {
          console.warn(`Failed to preload ${url}:`, error);
        }
      }
    }
  },

  // Force cache update for specific resource
  updateCache: async (url: string) => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        await cache.delete(url);
      }
      // Fetch fresh version
      await fetch(url, { cache: 'reload' });
    }
  },

  // Get cache size
  getCacheSize: async () => {
    if (!('caches' in window)) return 0;
    
    let totalSize = 0;
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  }
};

export default useServiceWorker;