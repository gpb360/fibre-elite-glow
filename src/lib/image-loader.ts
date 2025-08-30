import { imageCache } from './performance-cache';

// Types for image loading system
export interface ImageSource {
  src: string;
  type: 'webp' | 'jpeg' | 'png' | 'svg';
  width?: number;
  height?: number;
  quality?: number;
}

export interface ImageSet {
  sources: ImageSource[];
  fallback: string;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export interface LoadImageOptions {
  retries?: number;
  timeout?: number;
  useCache?: boolean;
  quality?: number;
  format?: 'webp' | 'auto';
  sizes?: number[];
}

export interface ImageLoadResult {
  success: boolean;
  src: string;
  width?: number;
  height?: number;
  format?: string;
  error?: Error;
  fromCache?: boolean;
  loadTime?: number;
}

// Advanced image loading with WebP support and fallbacks
class ImageLoader {
  private static instance: ImageLoader;
  private loadingQueue = new Map<string, Promise<ImageLoadResult>>();
  private supportCache = new Map<string, boolean>();
  private intersectionObserver?: IntersectionObserver;
  private preloadObserver?: IntersectionObserver;

  public static getInstance(): ImageLoader {
    if (!ImageLoader.instance) {
      ImageLoader.instance = new ImageLoader();
    }
    return ImageLoader.instance;
  }

  constructor() {
    this.setupIntersectionObservers();
    this.detectFormatSupport();
  }

  // Detect browser format support
  private async detectFormatSupport(): Promise<void> {
    const formats = ['webp', 'avif', 'jpeg2000', 'jxl'];
    
    for (const format of formats) {
      try {
        const support = await this.testFormatSupport(format);
        this.supportCache.set(format, support);
      } catch (error) {
        this.supportCache.set(format, false);
      }
    }
  }

  private testFormatSupport(format: string): Promise<boolean> {
    return new Promise((resolve) => {
      const testImages = {
        webp: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
        jpeg2000: 'data:image/jp2;base64,/0//UQAyAAAAAAABAAAAAgAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAEBwEBBwEBBwEBBwEB/1IADAAAAAEAAAQEAAH/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAAX/2ANQAA=='
      };

      const testImage = testImages[format as keyof typeof testImages];
      if (!testImage) {
        resolve(false);
        return;
      }

      const img = new Image();
      img.onload = () => resolve(img.width === 1 && img.height === 1);
      img.onerror = () => resolve(false);
      img.src = testImage;
    });
  }

  // Setup intersection observers for lazy loading and preloading
  private setupIntersectionObservers(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    // Lazy loading observer
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              this.loadImage(src, { useCache: true }).then((result) => {
                if (result.success) {
                  img.src = result.src;
                  img.removeAttribute('data-src');
                  this.intersectionObserver?.unobserve(img);
                }
              });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Preloading observer (larger root margin)
    this.preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const preload = img.dataset.preload;
            if (preload) {
              this.preloadImage(preload);
              this.preloadObserver?.unobserve(img);
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '200px'
      }
    );
  }

  // Get optimal image source based on browser support and device capabilities
  public getOptimalSource(basePath: string, options: LoadImageOptions = {}): ImageSet {
    const { format = 'auto', quality = 80, sizes = [400, 800, 1200, 1600] } = options;
    
    const sources: ImageSource[] = [];
    const extension = basePath.split('.').pop()?.toLowerCase() || 'jpg';
    const baseName = basePath.replace(/\.[^/.]+$/, '');

    // Add WebP sources if supported
    if (format === 'auto' || format === 'webp') {
      if (this.supportCache.get('webp')) {
        sizes.forEach(width => {
          sources.push({
            src: `${baseName}-${width}w.webp`,
            type: 'webp',
            width,
            quality
          });
        });
      }
    }

    // Add AVIF sources if supported (better compression than WebP)
    if (this.supportCache.get('avif')) {
      sizes.forEach(width => {
        sources.push({
          src: `${baseName}-${width}w.avif`,
          type: 'webp', // TypeScript limitation - using webp type for modern formats
          width,
          quality
        });
      });
    }

    // Add fallback sources
    sizes.forEach(width => {
      sources.push({
        src: `${baseName}-${width}w.${extension}`,
        type: extension as any,
        width,
        quality
      });
    });

    return {
      sources,
      fallback: basePath,
      alt: '',
      sizes: `(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1600px`
    };
  }

  // Load single image with retries and caching
  public async loadImage(src: string, options: LoadImageOptions = {}): Promise<ImageLoadResult> {
    const {
      retries = 3,
      timeout = 10000,
      useCache = true,
      quality = 80
    } = options;

    const cacheKey = `img_${src}_${quality}`;

    // Check cache first
    if (useCache) {
      const cached = imageCache.get(cacheKey);
      if (cached) {
        return {
          success: true,
          src,
          fromCache: true,
          ...cached
        };
      }
    }

    // Check if already loading
    const existingPromise = this.loadingQueue.get(src);
    if (existingPromise) {
      return existingPromise;
    }

    // Start loading
    const loadPromise = this.loadImageInternal(src, { timeout, retries });
    this.loadingQueue.set(src, loadPromise);

    try {
      const result = await loadPromise;
      
      // Cache successful results
      if (result.success && useCache) {
        imageCache.set(cacheKey, {
          width: result.width,
          height: result.height,
          format: result.format,
          loadTime: result.loadTime
        });
      }

      return result;
    } finally {
      this.loadingQueue.delete(src);
    }
  }

  private async loadImageInternal(
    src: string, 
    options: { timeout: number; retries: number }
  ): Promise<ImageLoadResult> {
    const { timeout, retries } = options;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const startTime = performance.now();
        const result = await this.loadSingleImage(src, timeout);
        const endTime = performance.now();

        return {
          success: true,
          src,
          width: result.width,
          height: result.height,
          format: this.getImageFormat(src),
          loadTime: endTime - startTime
        };
      } catch (error) {
        lastError = error as Error;
        
        // Wait before retry with exponential backoff
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    return {
      success: false,
      src,
      error: lastError || new Error('Failed to load image')
    };
  }

  private loadSingleImage(src: string, timeout: number): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${src}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }

  // Preload images for better performance
  public async preloadImage(src: string): Promise<void> {
    try {
      await this.loadImage(src, { useCache: true });
    } catch (error) {
      console.warn('Image preload failed:', src, error);
    }
  }

  public preloadImages(srcs: string[]): Promise<void[]> {
    return Promise.all(srcs.map(src => this.preloadImage(src)));
  }

  // Generate responsive image markup
  public generatePictureElement(imageSet: ImageSet): string {
    const { sources, fallback, alt, sizes } = imageSet;
    
    let pictureHtml = '<picture>';
    
    // Group sources by type
    const sourcesByType = sources.reduce((acc, source) => {
      if (!acc[source.type]) {
        acc[source.type] = [];
      }
      acc[source.type].push(source);
      return acc;
    }, {} as Record<string, ImageSource[]>);

    // Generate source elements
    Object.entries(sourcesByType).forEach(([type, typeSources]) => {
      const srcset = typeSources
        .map(source => `${source.src} ${source.width}w`)
        .join(', ');
      
      pictureHtml += `<source type="image/${type}" srcset="${srcset}" sizes="${sizes || ''}" />`;
    });

    // Add fallback img element
    pictureHtml += `<img src="${fallback}" alt="${alt}" loading="${imageSet.loading || 'lazy'}" />`;
    pictureHtml += '</picture>';

    return pictureHtml;
  }

  // Enable lazy loading for an image element
  public enableLazyLoading(img: HTMLImageElement): void {
    if (this.intersectionObserver && img.dataset.src) {
      this.intersectionObserver.observe(img);
    }
  }

  // Enable preloading for an image element
  public enablePreloading(img: HTMLImageElement): void {
    if (this.preloadObserver && img.dataset.preload) {
      this.preloadObserver.observe(img);
    }
  }

  // Batch process images for lazy loading
  public processLazyImages(container: Element = document.body): void {
    if (!this.intersectionObserver) return;

    const lazyImages = container.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      this.intersectionObserver!.observe(img);
    });
  }

  // Utility methods
  private getImageFormat(src: string): string {
    const extension = src.split('.').pop()?.toLowerCase() || '';
    const formatMap: Record<string, string> = {
      jpg: 'jpeg',
      jpeg: 'jpeg',
      png: 'png',
      webp: 'webp',
      avif: 'avif',
      svg: 'svg+xml'
    };
    return formatMap[extension] || 'unknown';
  }

  // Get loading statistics
  public getStats() {
    return {
      queueSize: this.loadingQueue.size,
      supportedFormats: Array.from(this.supportCache.entries())
        .filter(([, supported]) => supported)
        .map(([format]) => format),
      cacheStats: imageCache.getStats()
    };
  }

  // Cleanup resources
  public cleanup(): void {
    this.intersectionObserver?.disconnect();
    this.preloadObserver?.disconnect();
    this.loadingQueue.clear();
  }
}

// Utility functions for image optimization
export const ImageOptimizer = {
  // Generate WebP version path
  getWebPPath: (originalPath: string): string => {
    return originalPath.replace(/\.(jpe?g|png)$/i, '.webp');
  },

  // Generate responsive image sizes
  generateSizes: (breakpoints: number[] = [400, 800, 1200, 1600]) => {
    return breakpoints
      .map((bp, index) => {
        if (index === breakpoints.length - 1) {
          return `${bp}px`;
        }
        return `(max-width: ${bp}px) ${bp}px`;
      })
      .join(', ');
  },

  // Calculate optimal quality based on image type and size
  getOptimalQuality: (format: string, width: number): number => {
    const baseQuality = format === 'webp' ? 85 : format === 'avif' ? 75 : 80;
    
    // Reduce quality for larger images
    if (width > 1600) return Math.max(baseQuality - 15, 60);
    if (width > 1200) return Math.max(baseQuality - 10, 65);
    if (width > 800) return Math.max(baseQuality - 5, 70);
    
    return baseQuality;
  },

  // Check if image should be lazy loaded
  shouldLazyLoad: (priority?: boolean, loading?: string): boolean => {
    return !priority && loading !== 'eager';
  }
};

// Export singleton instance
export const imageLoader = ImageLoader.getInstance();
export default imageLoader;