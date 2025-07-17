/**
 * Performance Optimizer Utility
 * 
 * Provides performance optimization features for reducing main thread tasks
 * and deferring non-critical operations
 */

// Singleton intersection observer for all images
class GlobalIntersectionObserver {
  private static instance: GlobalIntersectionObserver;
  private observer: IntersectionObserver | null = null;
  private callbacks: Map<Element, (isIntersecting: boolean) => void> = new Map();

  private constructor() {
    this.initializeObserver();
  }

  public static getInstance(): GlobalIntersectionObserver {
    if (!GlobalIntersectionObserver.instance) {
      GlobalIntersectionObserver.instance = new GlobalIntersectionObserver();
    }
    return GlobalIntersectionObserver.instance;
  }

  private initializeObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = this.callbacks.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );
  }

  public observe(element: Element, callback: (isIntersecting: boolean) => void): void {
    if (!this.observer) {
      // Fallback: call callback immediately if IntersectionObserver is not available
      callback(true);
      return;
    }

    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  public unobserve(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }
    this.callbacks.delete(element);
  }

  public disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.callbacks.clear();
  }
}

// Utility for deferring non-critical operations
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private pendingTasks: Array<() => void> = [];
  private isProcessing = false;

  private constructor() {}

  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Defer non-critical operations until the browser is idle
   */
  public deferTask(task: () => void, priority: 'low' | 'medium' | 'high' = 'low'): void {
    if (priority === 'high') {
      // High priority tasks run immediately
      this.runWhenIdle(task);
    } else {
      // Medium and low priority tasks are queued
      this.pendingTasks.push(task);
      this.processPendingTasks();
    }
  }

  /**
   * Run a task when the browser is idle
   */
  private runWhenIdle(task: () => void): void {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(task, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(task, 0);
    }
  }

  /**
   * Process pending tasks during idle time
   */
  private processPendingTasks(): void {
    if (this.isProcessing || this.pendingTasks.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.runWhenIdle(() => {
      const task = this.pendingTasks.shift();
      if (task) {
        task();
      }
      this.isProcessing = false;
      
      // Process next task if available
      if (this.pendingTasks.length > 0) {
        this.processPendingTasks();
      }
    });
  }

  /**
   * Debounce function calls to reduce frequency
   */
  public debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function calls to limit frequency
   */
  public throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let lastFunc: NodeJS.Timeout;
    let lastRan: number;
    return (...args: Parameters<T>) => {
      if (!lastRan) {
        func(...args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  /**
   * Observe element visibility with the global intersection observer
   */
  public observeElement(element: Element, callback: (isIntersecting: boolean) => void): void {
    const globalObserver = GlobalIntersectionObserver.getInstance();
    globalObserver.observe(element, callback);
  }

  /**
   * Stop observing element visibility
   */
  public unobserveElement(element: Element): void {
    const globalObserver = GlobalIntersectionObserver.getInstance();
    globalObserver.unobserve(element);
  }

  /**
   * Measure and report performance metrics
   */
  public measurePerformance<T>(name: string, fn: () => T): T {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    
    if (typeof window !== 'undefined' && 'console' in window) {
      console.debug(`Performance: ${name} took ${endTime - startTime}ms`);
    }
    
    return result;
  }

  /**
   * Optimize image loading with lazy loading
   */
  public optimizeImageLoading(img: HTMLImageElement): void {
    // Use the global intersection observer
    this.observeElement(img, (isIntersecting) => {
      if (isIntersecting) {
        const dataSrc = img.dataset.src;
        if (dataSrc) {
          img.src = dataSrc;
          img.removeAttribute('data-src');
        }
        this.unobserveElement(img);
      }
    });
  }

  /**
   * Reduce animation frequency during high load
   */
  public createOptimizedAnimationFrame(callback: () => void): number {
    // Check if the page is visible to avoid unnecessary animations
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return -1;
    }

    return requestAnimationFrame(callback);
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.pendingTasks.length = 0;
    this.isProcessing = false;
    const globalObserver = GlobalIntersectionObserver.getInstance();
    globalObserver.disconnect();
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Export utility functions
export const deferTask = (task: () => void, priority: 'low' | 'medium' | 'high' = 'low') => {
  performanceOptimizer.deferTask(task, priority);
};

export const observeElement = (element: Element, callback: (isIntersecting: boolean) => void) => {
  performanceOptimizer.observeElement(element, callback);
};

export const unobserveElement = (element: Element) => {
  performanceOptimizer.unobserveElement(element);
};

export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  return performanceOptimizer.debounce(func, wait);
};

export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
  return performanceOptimizer.throttle(func, limit);
};