import { NextResponse } from 'next/server';

// Error types for classification
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Security-focused error sanitizer
export class ErrorSanitizer {
  // Sensitive patterns that should never be exposed
  private static readonly SENSITIVE_PATTERNS = [
    /password/i,
    /secret/i,
    /token/i,
    /key/i,
    /api[_\-]?key/i,
    /auth/i,
    /session/i,
    /cookie/i,
    /jwt/i,
    /bearer/i,
    /database/i,
    /connection/i,
    /localhost/i,
    /127\.0\.0\.1/i,
    /192\.168\./i,
    /10\.\d+\.\d+\.\d+/i,
    /172\.(1[6-9]|2[0-9]|3[01])\./i,
    /file:\/\//i,
    /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i, // Email patterns
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/i, // Credit card patterns
    /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/i, // SSN patterns
  ];

  // Database-specific error patterns
  private static readonly DB_ERROR_PATTERNS = [
    /duplicate key/i,
    /foreign key/i,
    /constraint/i,
    /violation/i,
    /relation.*does not exist/i,
    /column.*does not exist/i,
    /permission denied/i,
    /authentication failed/i,
  ];

  // Sanitize error message for client consumption
  static sanitizeMessage(error: any): string {
    let message = typeof error === 'string' ? error : error?.message || 'An error occurred';

    // Remove sensitive information
    for (const pattern of this.SENSITIVE_PATTERNS) {
      message = message.replace(pattern, '[REDACTED]');
    }

    // Handle database errors
    for (const pattern of this.DB_ERROR_PATTERNS) {
      if (pattern.test(message)) {
        return 'Database operation failed';
      }
    }

    // Handle common error patterns
    if (message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
      return 'External service unavailable';
    }

    if (message.includes('timeout')) {
      return 'Request timeout';
    }

    if (message.includes('Invalid JSON')) {
      return 'Invalid request format';
    }

    // Limit message length
    return message.length > 200 ? message.substring(0, 200) + '...' : message;
  }

  // Sanitize stack trace (only in development)
  static sanitizeStackTrace(error: any): string | undefined {
    if (process.env.NODE_ENV === 'production') {
      return undefined;
    }

    let stack = error?.stack || '';
    
    // Remove sensitive file paths
    stack = stack.replace(/\/Users\/[^\/]+/g, '/user');
    stack = stack.replace(/\/home\/[^\/]+/g, '/user');
    stack = stack.replace(/C:\\Users\\[^\\]+/g, 'C:\\user');
    
    // Remove node_modules paths
    stack = stack.replace(/node_modules\/[^\/]+/g, 'node_modules/[package]');
    
    return stack;
  }

  // Determine if error details should be exposed
  static shouldExposeDetails(error: any): boolean {
    if (process.env.NODE_ENV === 'production') {
      return false;
    }

    // Don't expose sensitive errors even in development
    const message = error?.message || '';
    return !this.SENSITIVE_PATTERNS.some(pattern => pattern.test(message));
  }
}

// Global error handler
export class GlobalErrorHandler {
  // Handle API errors
  static handleApiError(error: any): NextResponse {
    console.error('API Error:', {
      message: error?.message,
      type: error?.type,
      statusCode: error?.statusCode,
      stack: ErrorSanitizer.sanitizeStackTrace(error),
      timestamp: new Date().toISOString(),
    });

    // Determine status code
    let statusCode = 500;
    let type = ErrorType.INTERNAL;

    if (error instanceof AppError) {
      statusCode = error.statusCode;
      type = error.type;
    } else if (error?.name === 'ValidationError') {
      statusCode = 400;
      type = ErrorType.VALIDATION;
    } else if (error?.message?.includes('Unauthorized')) {
      statusCode = 401;
      type = ErrorType.AUTHENTICATION;
    } else if (error?.message?.includes('Forbidden')) {
      statusCode = 403;
      type = ErrorType.AUTHORIZATION;
    } else if (error?.message?.includes('Not Found')) {
      statusCode = 404;
      type = ErrorType.NOT_FOUND;
    }

    // Sanitize error for response
    const sanitizedMessage = ErrorSanitizer.sanitizeMessage(error);
    
    const errorResponse: any = {
      error: sanitizedMessage,
      type,
      timestamp: new Date().toISOString(),
    };

    // Add details only if safe to expose
    if (ErrorSanitizer.shouldExposeDetails(error)) {
      errorResponse.details = error?.details;
      errorResponse.stack = ErrorSanitizer.sanitizeStackTrace(error);
    }

    return NextResponse.json(errorResponse, { status: statusCode });
  }

  // Log security events
  static logSecurityEvent(event: string, details: any): void {
    console.warn('SECURITY EVENT:', {
      event,
      details: ErrorSanitizer.sanitizeMessage(JSON.stringify(details)),
      timestamp: new Date().toISOString(),
      userAgent: details?.userAgent,
      ip: details?.ip,
    });

    // In production, you would send this to a security monitoring service
    // Example: SecurityMonitoring.alert(event, details);
  }
}

// Common error factory functions
export const createValidationError = (message: string, details?: any) =>
  new AppError(message, ErrorType.VALIDATION, 400, true, details);

export const createAuthenticationError = (message: string = 'Authentication required') =>
  new AppError(message, ErrorType.AUTHENTICATION, 401, true);

export const createAuthorizationError = (message: string = 'Insufficient permissions') =>
  new AppError(message, ErrorType.AUTHORIZATION, 403, true);

export const createNotFoundError = (message: string = 'Resource not found') =>
  new AppError(message, ErrorType.NOT_FOUND, 404, true);

export const createRateLimitError = (message: string = 'Too many requests') =>
  new AppError(message, ErrorType.RATE_LIMIT, 429, true);

export const createInternalError = (message: string = 'Internal server error') =>
  new AppError(message, ErrorType.INTERNAL, 500, true);

export const createExternalServiceError = (message: string = 'External service error') =>
  new AppError(message, ErrorType.EXTERNAL_SERVICE, 502, true);

// Error boundary helper for React components
export const handleClientError = (error: any, errorInfo?: any) => {
  console.error('Client Error:', {
    message: ErrorSanitizer.sanitizeMessage(error),
    stack: ErrorSanitizer.sanitizeStackTrace(error),
    errorInfo,
    timestamp: new Date().toISOString(),
  });

  // In production, send to error monitoring service
  // Example: ErrorMonitoring.captureException(error, errorInfo);
};