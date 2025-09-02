import React, { useState, useEffect, useCallback, useRef } from 'react';

// Types for caching system
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  size: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size in bytes
  maxEntries?: number; // Maximum number of entries
  enableCompression?: boolean;
  enablePersistence?: boolean;
  namespace?: string;
}

export interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  totalRequests: number;
  averageResponseTime: number;
  memoryUsage: number;
  compressionRatio: number;
}

// Advanced in-memory cache with LRU eviction
class PerformanceCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder = new Map<string, number>();
  private options: Required<CacheOptions>;
  private metrics: PerformanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    totalRequests: 0,
    averageResponseTime: 0,
    memoryUsage: 0,
    compressionRatio: 1
  };
  private accessCounter = 0;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB default
      maxEntries: options.maxEntries || 1000,
      enableCompression: options.enableCompression ?? true,
      enablePersistence: options.enablePersistence ?? false,
      namespace: options.namespace || 'default'
    };

    // Load from localStorage if persistence is enabled
    if (this.options.enablePersistence && typeof window !== 'undefined') {
      this.loadFromStorage();
    }

    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private generateKey(key: string): string {
    return `${this.options.namespace}:${key}`;
  }

  private calculateSize(data: T): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return JSON.stringify(data).length * 2; // Rough estimate
    }
  }

  private compress(data: T): string {
    if (!this.options.enableCompression) {
      return JSON.stringify(data);
    }

    try {
      // Simple compression using LZ-string-like approach
      const jsonString = JSON.stringify(data);
      return this.lzCompress(jsonString);
    } catch {
      return JSON.stringify(data);
    }
  }

  private decompress(compressedData: string): T {
    if (!this.options.enableCompression) {
      return JSON.parse(compressedData);
    }

    try {
      const decompressed = this.lzDecompress(compressedData);
      return JSON.parse(decompressed);
    } catch {
      return JSON.parse(compressedData);
    }
  }

  private lzCompress(str: string): string {
    // Simple RLE compression for demonstration
    return str.replace(/(.)\1+/g, (match, char) => `${char}${match.length}`);
  }

  private lzDecompress(str: string): string {
    // Simple RLE decompression
    return str.replace(/(.)\d+/g, (match, char) => {
      const count = parseInt(match.slice(1));
      return char.repeat(count);
    });
  }

  private evictLRU(): void {
    if (this.cache.size === 0) return;

    // Find least recently used entry
    let lruKey = '';
    let oldestAccess = Infinity;

    for (const [key, accessTime] of Array.from(this.accessOrder.entries())) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.delete(lruKey);
    }
  }

  private updateMetrics(hit: boolean, responseTime: number): void {
    this.metrics.totalRequests++;
    
    if (hit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }

    // Update average response time
    const totalTime = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime;
    this.metrics.averageResponseTime = totalTime / this.metrics.totalRequests;

    // Update memory usage
    let totalSize = 0;
    for (const entry of Array.from(this.cache.values())) {
      totalSize += entry.size;
    }
    this.metrics.memoryUsage = totalSize;
  }

  set(key: string, data: T, customTtl?: number): void {
    const startTime = performance.now();
    const fullKey = this.generateKey(key);
    const ttl = customTtl || this.options.ttl;
    const size = this.calculateSize(data);

    // Check if we need to evict entries
    while (
      this.cache.size >= this.options.maxEntries ||
      this.metrics.memoryUsage + size > this.options.maxSize
    ) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      size
    };

    this.cache.set(fullKey, entry);
    this.accessOrder.set(fullKey, ++this.accessCounter);

    // Persist to localStorage if enabled
    if (this.options.enablePersistence) {
      this.saveToStorage(fullKey, entry);
    }

    this.updateMetrics(false, performance.now() - startTime);
  }

  get(key: string): T | null {
    const startTime = performance.now();
    const fullKey = this.generateKey(key);
    const entry = this.cache.get(fullKey);

    if (!entry) {
      this.updateMetrics(false, performance.now() - startTime);
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      this.updateMetrics(false, performance.now() - startTime);
      return null;
    }

    // Update access order and hit count
    entry.hits++;
    this.accessOrder.set(fullKey, ++this.accessCounter);
    this.cache.set(fullKey, entry);

    this.updateMetrics(true, performance.now() - startTime);
    return entry.data;
  }

  delete(key: string): boolean {
    const fullKey = this.generateKey(key);
    const deleted = this.cache.delete(fullKey);
    this.accessOrder.delete(fullKey);

    if (this.options.enablePersistence && typeof window !== 'undefined') {
      localStorage.removeItem(fullKey);
    }

    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;

    if (this.options.enablePersistence && typeof window !== 'undefined') {
      // Clear all entries with this namespace
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.options.namespace}:`)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      if (this.options.enablePersistence && typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    });
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getStats() {
    const hitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.cacheHits / this.metrics.totalRequests) * 100 
      : 0;

    return {
      size: this.cache.size,
      hitRate: hitRate.toFixed(2) + '%',
      memoryUsage: this.formatBytes(this.metrics.memoryUsage),
      totalRequests: this.metrics.totalRequests,
      averageResponseTime: this.metrics.averageResponseTime.toFixed(2) + 'ms'
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private saveToStorage(key: string, entry: CacheEntry<T>): void {
    if (typeof window === 'undefined') return;

    try {
      const compressed = JSON.stringify(entry);
      localStorage.setItem(key, compressed);
    } catch (error) {
      console.warn('Failed to save cache entry to storage:', error);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.options.namespace}:`)) {
          const compressed = localStorage.getItem(key);
          if (compressed) {
            const entry = this.decompress(compressed) as CacheEntry<T>;
            // Check if still valid
            if (Date.now() - entry.timestamp <= entry.ttl) {
              this.cache.set(key, entry);
            } else {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }
}

// Global cache instances for different data types
const apiCache = new PerformanceCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 5 * 1024 * 1024, // 5MB
  namespace: 'api',
  enablePersistence: true
});

const imageCache = new PerformanceCache({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 20 * 1024 * 1024, // 20MB
  namespace: 'images',
  enablePersistence: false
});

const componentCache = new PerformanceCache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 2 * 1024 * 1024, // 2MB
  namespace: 'components',
  enablePersistence: false
});

// React hooks for caching
export function useCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchInProgress = useRef(false);

  const cache = options.namespace === 'images' ? imageCache : 
                options.namespace === 'components' ? componentCache : 
                apiCache;

  const fetchData = useCallback(async () => {
    if (fetchInProgress.current) return;
    
    const startTime = performance.now();
    
    // Try cache first
    const cached = cache.get(key);
    if (cached) {
      setData(cached);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch fresh data
    setLoading(true);
    fetchInProgress.current = true;

    try {
      const result = await fetchFn();
      cache.set(key, result, options.ttl);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [key, fetchFn, cache, options.ttl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    cache.delete(key);
    fetchData();
  }, [key, cache, fetchData]);

  return { data, loading, error, refresh };
}

// Hook for image preloading with caching
export function useImagePreloader(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImage = (url: string) => {
      return new Promise<void>((resolve, reject) => {
        // Check cache first
        const cached = imageCache.get(url);
        if (cached) {
          setLoadedImages(prev => new Set(prev).add(url));
          resolve();
          return;
        }

        const img = new Image();
        img.onload = () => {
          imageCache.set(url, { loaded: true, url }, 30 * 60 * 1000);
          setLoadedImages(prev => new Set(prev).add(url));
          resolve();
        };
        img.onerror = () => {
          setFailedImages(prev => new Set(prev).add(url));
          reject(new Error(`Failed to load image: ${url}`));
        };
        img.src = url;
      });
    };

    const preloadAll = async () => {
      const promises = urls.map(url => 
        preloadImage(url).catch(error => {
          console.warn('Image preload failed:', error);
        })
      );
      
      await Promise.allSettled(promises);
    };

    if (urls.length > 0) {
      preloadAll();
    }
  }, [urls]);

  return {
    loadedImages: Array.from(loadedImages),
    failedImages: Array.from(failedImages),
    isImageLoaded: (url: string) => loadedImages.has(url),
    isImageFailed: (url: string) => failedImages.has(url)
  };
}

// Bundle size optimization utilities
export const BundleOptimizer = {
  // Lazy load components
  lazyComponent: <T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ) => {
    const LazyComponent = React.lazy(importFn);

    const LazyWrapper = React.forwardRef<
      React.ComponentRef<T>,
      React.ComponentPropsWithoutRef<T>
    >((props, ref) =>
      React.createElement(React.Suspense,
        { fallback: fallback ? React.createElement(fallback) : React.createElement('div', {}, 'Loading...') },
        React.createElement(LazyComponent, { ...props, ref } as any)
      )
    );

    LazyWrapper.displayName = `LazyComponent(Component)`;

    return LazyWrapper;
  },

  // Preload critical components
  preloadComponent: (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        importFn().catch(console.error);
      });
    }
  },

  // Check if feature should be loaded based on device capabilities
  shouldLoadFeature: (feature: 'animations' | 'highres' | 'video') => {
    if (typeof window === 'undefined') return true;

    switch (feature) {
      case 'animations':
        return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      case 'highres':
        return window.devicePixelRatio > 1 &&
          ('connection' in navigator && (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType !== '2g');
      case 'video':
        return !window.matchMedia('(prefers-reduced-data: reduce)').matches;
      default:
        return true;
    }
  }
};

// Cache management utilities
export const CacheManager = {
  clearAll: () => {
    apiCache.clear();
    imageCache.clear();
    componentCache.clear();
  },

  getStats: () => ({
    api: apiCache.getStats(),
    images: imageCache.getStats(),
    components: componentCache.getStats()
  }),

  getMetrics: () => ({
    api: apiCache.getMetrics(),
    images: imageCache.getMetrics(),
    components: componentCache.getMetrics()
  }),

  cleanup: () => {
    apiCache.cleanup();
    imageCache.cleanup();
    componentCache.cleanup();
  }
};

export { PerformanceCache, apiCache, imageCache, componentCache };
export default PerformanceCache;