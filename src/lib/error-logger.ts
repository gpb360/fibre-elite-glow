import { performanceCache } from './performance-cache';

// Types for error logging system
export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: keyof LogLevel;
  message: string;
  context?: Record<string, any>;
  stack?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  buildId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  url?: string;
  userAgent?: string;
  buildId?: string;
  additional?: Record<string, any>;
}

export interface LoggerConfig {
  maxLogs?: number;
  maxLogSize?: number;
  enableConsole?: boolean;
  enableStorage?: boolean;
  enableStackTrace?: boolean;
  logRotation?: boolean;
  rotationSize?: number;
  compressionEnabled?: boolean;
  sensitiveFields?: string[];
}

// Default configuration
const DEFAULT_CONFIG: Required<LoggerConfig> = {
  maxLogs: 1000,
  maxLogSize: 5 * 1024 * 1024, // 5MB
  enableConsole: process.env.NODE_ENV === 'development',
  enableStorage: true,
  enableStackTrace: true,
  logRotation: true,
  rotationSize: 2 * 1024 * 1024, // 2MB
  compressionEnabled: true,
  sensitiveFields: ['password', 'token', 'apiKey', 'creditCard', 'ssn', 'email']
};

// Log levels hierarchy
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
} as const;

class ProductionErrorLogger {
  private static instance: ProductionErrorLogger;
  private config: Required<LoggerConfig>;
  private logs: LogEntry[] = [];
  private storageKey = 'fibre-elite-glow-logs';
  private sessionId: string;
  private buildId: string;
  private logBuffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;

  public static getInstance(): ProductionErrorLogger {
    if (!ProductionErrorLogger.instance) {
      ProductionErrorLogger.instance = new ProductionErrorLogger();
    }
    return ProductionErrorLogger.instance;
  }

  constructor(config: LoggerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
    this.buildId = this.getBuildId();
    
    if (typeof window !== 'undefined') {
      this.loadLogsFromStorage();
      this.setupGlobalErrorHandlers();
      this.setupUnloadHandler();
    }
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getBuildId(): string {
    // Try to get build ID from environment or generate one
    return process.env.NEXT_PUBLIC_BUILD_ID || `build-${Date.now()}`;
  }

  private sanitizeData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = Array.isArray(data) ? [] : {};
    
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      
      // Check if field is sensitive
      if (this.config.sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()))) {
        (sanitized as any)[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        (sanitized as any)[key] = this.sanitizeData(value);
      } else {
        (sanitized as any)[key] = value;
      }
    }
    
    return sanitized;
  }

  private compressLogs(logs: LogEntry[]): string {
    if (!this.config.compressionEnabled) {
      return JSON.stringify(logs);
    }

    try {
      // Simple compression: remove redundant data and compact JSON
      const compressed = logs.map(log => ({
        i: log.id,
        t: log.timestamp,
        l: log.level,
        m: log.message,
        ...(log.context && { c: log.context }),
        ...(log.stack && { s: log.stack.substring(0, 500) }), // Truncate stack traces
        ...(log.component && { cmp: log.component }),
        ...(log.action && { act: log.action })
      }));

      return JSON.stringify(compressed);
    } catch (error) {
      console.warn('Log compression failed:', error);
      return JSON.stringify(logs);
    }
  }

  private decompressLogs(compressed: string): LogEntry[] {
    try {
      const data = JSON.parse(compressed);
      
      // Check if data is compressed format
      if (Array.isArray(data) && data[0] && 'i' in data[0]) {
        return data.map((log: any) => ({
          id: log.i,
          timestamp: log.t,
          level: log.l,
          message: log.m,
          context: log.c,
          stack: log.s,
          component: log.cmp,
          action: log.act,
          sessionId: this.sessionId,
          buildId: this.buildId
        }));
      }

      // Fallback to uncompressed format
      return data;
    } catch (error) {
      console.warn('Log decompression failed:', error);
      return [];
    }
  }

  private loadLogsFromStorage(): void {
    if (!this.config.enableStorage || typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.logs = this.decompressLogs(stored);
        this.enforceLogLimits();
      }
    } catch (error) {
      console.warn('Failed to load logs from storage:', error);
    }
  }

  private saveLogsToStorage(): void {
    if (!this.config.enableStorage || typeof window === 'undefined') {
      return;
    }

    try {
      const compressed = this.compressLogs(this.logs);
      
      // Check storage quota
      if (compressed.length > this.config.maxLogSize) {
        this.rotateLogs();
        const rotatedCompressed = this.compressLogs(this.logs);
        localStorage.setItem(this.storageKey, rotatedCompressed);
      } else {
        localStorage.setItem(this.storageKey, compressed);
      }
    } catch (error) {
      console.warn('Failed to save logs to storage:', error);
      // If storage is full, try rotating logs
      this.rotateLogs();
      try {
        const compressed = this.compressLogs(this.logs);
        localStorage.setItem(this.storageKey, compressed);
      } catch (secondError) {
        console.warn('Failed to save logs after rotation:', secondError);
      }
    }
  }

  private rotateLogs(): void {
    if (!this.config.logRotation) {
      return;
    }

    // Keep only the most recent logs
    const maxLogs = Math.floor(this.config.maxLogs * 0.7); // Keep 70% of max
    if (this.logs.length > maxLogs) {
      this.logs = this.logs.slice(-maxLogs);
    }

    // Also archive old logs if needed
    this.archiveOldLogs();
  }

  private archiveOldLogs(): void {
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const cutoffTime = Date.now() - (7 * ONE_DAY); // Archive logs older than 7 days

    const recentLogs = this.logs.filter(log => log.timestamp > cutoffTime);
    const oldLogs = this.logs.filter(log => log.timestamp <= cutoffTime);

    if (oldLogs.length > 0) {
      // Save archived logs to a separate storage key
      try {
        const archiveKey = `${this.storageKey}-archive-${Date.now()}`;
        const compressed = this.compressLogs(oldLogs);
        localStorage.setItem(archiveKey, compressed);
        
        // Clean up old archives (keep only last 3)
        this.cleanupOldArchives();
      } catch (error) {
        console.warn('Failed to archive old logs:', error);
      }
    }

    this.logs = recentLogs;
  }

  private cleanupOldArchives(): void {
    if (typeof window === 'undefined') return;

    try {
      const archiveKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${this.storageKey}-archive-`))
        .sort()
        .reverse(); // Most recent first

      // Keep only the 3 most recent archives
      archiveKeys.slice(3).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to cleanup old archives:', error);
    }
  }

  private enforceLogLimits(): void {
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(-this.config.maxLogs);
    }
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Global JavaScript errors
    window.addEventListener('error', (event) => {
      this.error('Global JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString(),
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    });

    // React error boundaries (if available)
    if (typeof window !== 'undefined' && (window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__) {
      (window as any).__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.onBuildError = (error: Error) => {
        this.error('React Build Error', {
          message: error.message,
          stack: error.stack
        });
      };
    }
  }

  private setupUnloadHandler(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Save logs before page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }

  private createLogEntry(
    level: keyof LogLevel,
    message: string,
    context?: ErrorContext
  ): LogEntry {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      level,
      message,
      sessionId: this.sessionId,
      buildId: this.buildId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };

    if (context) {
      entry.context = this.sanitizeData(context);
      entry.component = context.component;
      entry.action = context.action;
      entry.userId = context.userId;
    }

    // Add stack trace for errors
    if (level === 'error' && this.config.enableStackTrace) {
      entry.stack = new Error().stack;
    }

    return entry;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    this.logBuffer.push(entry);
    
    // Console output in development
    if (this.config.enableConsole) {
      const consoleMethod = entry.level === 'error' ? 'error' : 
                           entry.level === 'warn' ? 'warn' : 
                           entry.level === 'info' ? 'info' : 'debug';
      
      console[consoleMethod](`[${entry.level.toUpperCase()}] ${entry.message}`, entry.context || '');
    }

    this.enforceLogLimits();
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }

    // Flush logs every 10 seconds or when buffer gets large
    const delay = this.logBuffer.length > 50 ? 1000 : 10000;
    this.flushTimer = setTimeout(() => {
      this.flush();
    }, delay);
  }

  private flush(): void {
    if (this.logBuffer.length === 0) {
      return;
    }

    this.saveLogsToStorage();
    this.logBuffer = [];

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  // Public logging methods
  public error(message: string, context?: ErrorContext): void {
    const entry = this.createLogEntry('error', message, context);
    this.addLog(entry);
  }

  public warn(message: string, context?: ErrorContext): void {
    const entry = this.createLogEntry('warn', message, context);
    this.addLog(entry);
  }

  public info(message: string, context?: ErrorContext): void {
    const entry = this.createLogEntry('info', message, context);
    this.addLog(entry);
  }

  public debug(message: string, context?: ErrorContext): void {
    if (process.env.NODE_ENV === 'development') {
      const entry = this.createLogEntry('debug', message, context);
      this.addLog(entry);
    }
  }

  // Specialized logging methods
  public logUserAction(action: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      action,
      component: 'user-interaction',
      additional: context
    });
  }

  public logAPIError(endpoint: string, error: Error, context?: Record<string, any>): void {
    this.error(`API Error: ${endpoint}`, {
      action: 'api-call',
      component: 'api-client',
      additional: {
        endpoint,
        error: error.message,
        stack: error.stack,
        ...context
      }
    });
  }

  public logPerformance(metric: string, value: number, context?: Record<string, any>): void {
    this.info(`Performance: ${metric}`, {
      action: 'performance-metric',
      component: 'performance-monitor',
      additional: {
        metric,
        value,
        unit: 'ms',
        ...context
      }
    });
  }

  public logPaymentError(error: string, context?: Record<string, any>): void {
    this.error(`Payment Error: ${error}`, {
      action: 'payment-error',
      component: 'payment-system',
      additional: this.sanitizeData(context || {})
    });
  }

  // Log retrieval and management
  public getLogs(filter?: {
    level?: keyof LogLevel;
    component?: string;
    fromTime?: number;
    toTime?: number;
    limit?: number;
  }): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (filter) {
      if (filter.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level);
      }
      
      if (filter.component) {
        filteredLogs = filteredLogs.filter(log => log.component === filter.component);
      }
      
      if (filter.fromTime) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.fromTime!);
      }
      
      if (filter.toTime) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.toTime!);
      }
      
      if (filter.limit) {
        filteredLogs = filteredLogs.slice(-filter.limit);
      }
    }

    return filteredLogs.sort((a, b) => b.timestamp - a.timestamp);
  }

  public getLogSummary(): {
    total: number;
    byLevel: Record<string, number>;
    byComponent: Record<string, number>;
    recentErrors: LogEntry[];
    oldestLog?: LogEntry;
    newestLog?: LogEntry;
  } {
    const byLevel: Record<string, number> = {};
    const byComponent: Record<string, number> = {};

    this.logs.forEach(log => {
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;
      if (log.component) {
        byComponent[log.component] = (byComponent[log.component] || 0) + 1;
      }
    });

    const recentErrors = this.logs
      .filter(log => log.level === 'error')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    const sortedLogs = [...this.logs].sort((a, b) => a.timestamp - b.timestamp);

    return {
      total: this.logs.length,
      byLevel,
      byComponent,
      recentErrors,
      oldestLog: sortedLogs[0],
      newestLog: sortedLogs[sortedLogs.length - 1]
    };
  }

  public exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'message', 'component', 'action', 'url'];
      const csvRows = [headers.join(',')];
      
      this.logs.forEach(log => {
        const row = [
          new Date(log.timestamp).toISOString(),
          log.level,
          `"${log.message.replace(/"/g, '""')}"`,
          log.component || '',
          log.action || '',
          log.url || ''
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    }

    return JSON.stringify(this.logs, null, 2);
  }

  public clearLogs(): void {
    this.logs = [];
    this.logBuffer = [];
    
    if (typeof window !== 'undefined' && this.config.enableStorage) {
      localStorage.removeItem(this.storageKey);
    }
  }

  public getStats(): {
    totalLogs: number;
    bufferSize: number;
    storageSize: number;
    sessionId: string;
    buildId: string;
    config: Required<LoggerConfig>;
  } {
    let storageSize = 0;
    
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        storageSize = stored ? stored.length : 0;
      } catch (error) {
        // Ignore storage errors
      }
    }

    return {
      totalLogs: this.logs.length,
      bufferSize: this.logBuffer.length,
      storageSize,
      sessionId: this.sessionId,
      buildId: this.buildId,
      config: this.config
    };
  }
}

// Export singleton instance
export const logger = ProductionErrorLogger.getInstance();

// Export convenience functions
export const logError = (message: string, context?: ErrorContext) => logger.error(message, context);
export const logWarn = (message: string, context?: ErrorContext) => logger.warn(message, context);
export const logInfo = (message: string, context?: ErrorContext) => logger.info(message, context);
export const logDebug = (message: string, context?: ErrorContext) => logger.debug(message, context);

// Specialized logging functions
export const logUserAction = (action: string, context?: Record<string, any>) => logger.logUserAction(action, context);
export const logAPIError = (endpoint: string, error: Error, context?: Record<string, any>) => logger.logAPIError(endpoint, error, context);
export const logPerformance = (metric: string, value: number, context?: Record<string, any>) => logger.logPerformance(metric, value, context);
export const logPaymentError = (error: string, context?: Record<string, any>) => logger.logPaymentError(error, context);

export default ProductionErrorLogger;