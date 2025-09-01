import { logger, ErrorContext } from './error-logger';

// Types for context collection
export interface BrowserContext {
  userAgent: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  onlineStatus: boolean;
  screenResolution: string;
  viewportSize: string;
  colorDepth: number;
  timezone: string;
  memory?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
}

export interface PerformanceContext {
  loadTime: number;
  domContentLoaded: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
}

export interface UserInteractionContext {
  clickPosition?: { x: number; y: number };
  scrollPosition?: { x: number; y: number };
  keyboardEvents?: string[];
  formData?: Record<string, any>;
  lastActions?: string[];
  timeOnPage?: number;
  elementsInteracted?: string[];
}

export interface ApplicationContext {
  currentRoute: string;
  previousRoute?: string;
  routeParams?: Record<string, string>;
  searchParams?: Record<string, string>;
  authStatus?: 'authenticated' | 'unauthenticated' | 'pending';
  cartItemCount?: number;
  selectedProducts?: string[];
  currentStep?: string;
  featureFlags?: Record<string, boolean>;
}

export interface NetworkContext {
  apiCalls: Array<{
    url: string;
    method: string;
    status?: number;
    duration?: number;
    timestamp: number;
  }>;
  failedRequests: Array<{
    url: string;
    error: string;
    timestamp: number;
  }>;
  networkSpeed?: string;
  isOffline: boolean;
}

export interface ErrorContextData {
  browser: BrowserContext;
  performance: PerformanceContext;
  userInteraction: UserInteractionContext;
  application: ApplicationContext;
  network: NetworkContext;
  customData?: Record<string, any>;
}

class ErrorContextCollector {
  private static instance: ErrorContextCollector;
  private contextData: Partial<ErrorContextData> = {};
  private recentActions: string[] = [];
  private apiCallHistory: NetworkContext['apiCalls'] = [];
  private failedRequests: NetworkContext['failedRequests'] = [];
  private performanceObserver?: PerformanceObserver;
  private isCollecting = false;

  public static getInstance(): ErrorContextCollector {
    if (!ErrorContextCollector.instance) {
      ErrorContextCollector.instance = new ErrorContextCollector();
    }
    return ErrorContextCollector.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeCollection();
    }
  }

  private initializeCollection(): void {
    if (this.isCollecting) return;
    this.isCollecting = true;

    // Collect initial browser context
    this.collectBrowserContext();
    
    // Set up performance monitoring
    this.setupPerformanceMonitoring();
    
    // Set up user interaction tracking
    this.setupUserInteractionTracking();
    
    // Set up network monitoring
    this.setupNetworkMonitoring();
    
    // Set up periodic updates
    this.setupPeriodicUpdates();
  }

  private collectBrowserContext(): void {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    try {
      const browserContext: BrowserContext = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      // Add memory info if available
      if ('memory' in performance && (performance as any).memory) {
        browserContext.memory = (performance as any).memory.usedJSHeapSize;
      }

      // Add connection info if available
      if ('connection' in navigator && (navigator as any).connection) {
        const conn = (navigator as any).connection;
        browserContext.connection = {
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt
        };
      }

      this.contextData.browser = browserContext;
    } catch (error) {
      logger.warn('Failed to collect browser context', { error: error });
    }
  }

  private setupPerformanceMonitoring(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Collect initial navigation timing
      this.collectNavigationTiming();

      // Set up performance observer for web vitals
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              this.updatePerformanceContext({
                [entry.name === 'first-paint' ? 'firstPaint' : 'firstContentfulPaint']: entry.startTime
              });
              break;
            
            case 'largest-contentful-paint':
              this.updatePerformanceContext({
                largestContentfulPaint: entry.startTime
              });
              break;
            
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                const currentCLS = this.contextData.performance?.cumulativeLayoutShift || 0;
                this.updatePerformanceContext({
                  cumulativeLayoutShift: currentCLS + (entry as any).value
                });
              }
              break;
            
            case 'first-input':
              this.updatePerformanceContext({
                firstInputDelay: (entry as any).processingStart - entry.startTime
              });
              break;
          }
        }
      });

      // Observe different performance entry types
      const entryTypes = ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'];
      entryTypes.forEach(type => {
        try {
          this.performanceObserver!.observe({ entryTypes: [type] });
        } catch (error) {
          // Some entry types might not be supported
        }
      });

    } catch (error) {
      logger.warn('Failed to set up performance monitoring', { error: error });
    }
  }

  private collectNavigationTiming(): void {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const performanceContext: PerformanceContext = {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart
        };

        // Add memory usage if available
        if ('memory' in performance && (performance as any).memory) {
          const memory = (performance as any).memory;
          performanceContext.memoryUsage = {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          };
        }

        this.contextData.performance = performanceContext;
      }
    } catch (error) {
      logger.warn('Failed to collect navigation timing', { error: error });
    }
  }

  private updatePerformanceContext(updates: Partial<PerformanceContext>): void {
    this.contextData.performance = {
      ...this.contextData.performance,
      ...updates
    } as PerformanceContext;
  }

  private setupUserInteractionTracking(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const startTime = Date.now();
    const elementsInteracted = new Set<string>();

    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as Element;
      const elementInfo = this.getElementInfo(target);
      
      elementsInteracted.add(elementInfo);
      this.addRecentAction(`Click: ${elementInfo}`);
      
      this.updateUserInteractionContext({
        clickPosition: { x: event.clientX, y: event.clientY },
        elementsInteracted: Array.from(elementsInteracted)
      });
    }, { passive: true });

    // Track scroll
    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.updateUserInteractionContext({
          scrollPosition: { x: window.scrollX, y: window.scrollY }
        });
      }, 100);
    }, { passive: true });

    // Track form interactions
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const elementInfo = this.getElementInfo(target);
        this.addRecentAction(`Input: ${elementInfo}`);
        elementsInteracted.add(elementInfo);
      }
    }, { passive: true });

    // Update time on page periodically
    setInterval(() => {
      this.updateUserInteractionContext({
        timeOnPage: Date.now() - startTime,
        elementsInteracted: Array.from(elementsInteracted)
      });
    }, 30000); // Every 30 seconds
  }

  private getElementInfo(element: Element): string {
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const text = element.textContent?.substring(0, 20) || '';
    
    return `${tag}${id}${className}${text ? ` "${text}"` : ''}`.trim();
  }

  private addRecentAction(action: string): void {
    this.recentActions.push(`${new Date().toISOString()}: ${action}`);
    
    // Keep only last 20 actions
    if (this.recentActions.length > 20) {
      this.recentActions = this.recentActions.slice(-20);
    }
    
    this.updateUserInteractionContext({
      lastActions: [...this.recentActions]
    });
  }

  private updateUserInteractionContext(updates: Partial<UserInteractionContext>): void {
    this.contextData.userInteraction = {
      ...this.contextData.userInteraction,
      ...updates
    } as UserInteractionContext;
  }

  private setupNetworkMonitoring(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Override fetch to monitor API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      const method = args[1]?.method || 'GET';

      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;

        this.recordAPICall({
          url,
          method,
          status: response.status,
          duration,
          timestamp: startTime
        });

        return response;
      } catch (error) {
        this.recordFailedRequest({
          url,
          error: error instanceof Error ? error.message : 'Network error',
          timestamp: startTime
        });
        throw error;
      }
    };

    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.updateNetworkContext({ isOffline: false });
    });

    window.addEventListener('offline', () => {
      this.updateNetworkContext({ isOffline: true });
    });

    // Initialize network context
    this.contextData.network = {
      apiCalls: [],
      failedRequests: [],
      isOffline: !navigator.onLine
    };
  }

  private recordAPICall(call: NetworkContext['apiCalls'][0]): void {
    this.apiCallHistory.push(call);
    
    // Keep only last 50 API calls
    if (this.apiCallHistory.length > 50) {
      this.apiCallHistory = this.apiCallHistory.slice(-50);
    }
    
    this.updateNetworkContext({
      apiCalls: [...this.apiCallHistory]
    });
  }

  private recordFailedRequest(request: NetworkContext['failedRequests'][0]): void {
    this.failedRequests.push(request);
    
    // Keep only last 20 failed requests
    if (this.failedRequests.length > 20) {
      this.failedRequests = this.failedRequests.slice(-20);
    }
    
    this.updateNetworkContext({
      failedRequests: [...this.failedRequests]
    });
  }

  private updateNetworkContext(updates: Partial<NetworkContext>): void {
    this.contextData.network = {
      ...this.contextData.network,
      ...updates
    } as NetworkContext;
  }

  private setupPeriodicUpdates(): void {
    // Update browser context periodically
    setInterval(() => {
      this.collectBrowserContext();
    }, 60000); // Every minute

    // Update performance context
    setInterval(() => {
      this.collectNavigationTiming();
    }, 30000); // Every 30 seconds
  }

  // Public methods
  public updateApplicationContext(context: Partial<ApplicationContext>): void {
    this.contextData.application = {
      ...this.contextData.application,
      ...context
    } as ApplicationContext;
  }

  public addCustomData(key: string, value: any): void {
    if (!this.contextData.customData) {
      this.contextData.customData = {};
    }
    this.contextData.customData[key] = value;
  }

  public getFullContext(): Partial<ErrorContextData> {
    return {
      ...this.contextData,
      // Add current timestamp
      timestamp: Date.now()
    };
  }

  public getContextForError(): ErrorContext {
    const fullContext = this.getFullContext();
    
    return {
      component: fullContext.application?.currentRoute || 'unknown',
      action: fullContext.userInteraction?.lastActions?.[0] || 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: fullContext.browser?.userAgent,
      additional: {
        performance: fullContext.performance,
        userInteraction: fullContext.userInteraction,
        network: fullContext.network,
        application: fullContext.application,
        custom: fullContext.customData
      }
    };
  }

  public logContextualError(message: string, additionalContext?: Record<string, any>): void {
    const errorContext = this.getContextForError();
    
    if (additionalContext) {
      errorContext.additional = {
        ...errorContext.additional,
        ...additionalContext
      };
    }
    
    logger.error(message, errorContext);
  }

  public cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    this.contextData = {};
    this.recentActions = [];
    this.apiCallHistory = [];
    this.failedRequests = [];
    this.isCollecting = false;
  }
}

// Export singleton instance
export const contextCollector = ErrorContextCollector.getInstance();

// Export utility functions
export const updateApplicationContext = (context: Partial<ApplicationContext>) => 
  contextCollector.updateApplicationContext(context);

export const addCustomErrorData = (key: string, value: any) => 
  contextCollector.addCustomData(key, value);

export const logContextualError = (message: string, additionalContext?: Record<string, any>) => 
  contextCollector.logContextualError(message, additionalContext);

export const getErrorContext = () => contextCollector.getContextForError();

export default ErrorContextCollector;