import { NextRequest, NextResponse } from 'next/server';

// CSRF token management
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly COOKIE_NAME = 'csrf-token';
  private static readonly HEADER_NAME = 'x-csrf-token';
  private static readonly FORM_FIELD = '_csrf';

  // Generate a cryptographically secure CSRF token using Web Crypto API
  static generateToken(): string {
    const array = new Uint8Array(this.TOKEN_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Set CSRF token in cookie
  static setTokenCookie(response: NextResponse, token: string): void {
    response.cookies.set(this.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
  }

  // Get CSRF token from request (header or form field)
  static getTokenFromRequest(request: NextRequest): string | null {
    // Try header first
    const headerToken = request.headers.get(this.HEADER_NAME);
    if (headerToken) return headerToken;

    // Try form field (for form submissions)
    const url = new URL(request.url);
    const formToken = url.searchParams.get(this.FORM_FIELD);
    return formToken;
  }

  // Get CSRF token from cookie
  static getTokenFromCookie(request: NextRequest): string | null {
    return request.cookies.get(this.COOKIE_NAME)?.value || null;
  }

  // Validate CSRF token
  static validateToken(request: NextRequest): boolean {
    const cookieToken = this.getTokenFromCookie(request);
    const requestToken = this.getTokenFromRequest(request);

    if (!cookieToken || !requestToken) {
      return false;
    }

    // Use timing-safe comparison to prevent timing attacks
    if (cookieToken.length !== requestToken.length) {
      return false;
    }
    
    // Convert hex strings to Uint8Arrays for comparison
    const cookieBytes = new Uint8Array(cookieToken.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    const requestBytes = new Uint8Array(requestToken.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    
    if (cookieBytes.length !== requestBytes.length) {
      return false;
    }
    
    // Timing-safe comparison
    let result = 0;
    for (let i = 0; i < cookieBytes.length; i++) {
      result |= cookieBytes[i] ^ requestBytes[i];
    }
    
    return result === 0;
  }

  // Middleware to check CSRF protection
  static middleware(request: NextRequest): NextResponse | null {
    const method = request.method;
    const pathname = request.nextUrl.pathname;

    // Skip CSRF protection for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return null;
    }

    // Skip CSRF protection for API routes that handle their own authentication
    if (pathname.startsWith('/api/webhooks/')) {
      return null;
    }

    // Validate CSRF token for state-changing requests
    if (!this.validateToken(request)) {
      console.warn(`CSRF validation failed for ${method} ${pathname}`);
      return NextResponse.json(
        { error: 'CSRF token validation failed' },
        { status: 403 }
      );
    }

    return null;
  }

  // Generate token for forms (to be used in React components)
  static async getTokenForForm(request: NextRequest): Promise<string> {
    let token = this.getTokenFromCookie(request);
    
    if (!token) {
      token = this.generateToken();
    }
    
    return token;
  }
}

// Rate limiting helper
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private static readonly MAX_REQUESTS = 100; // requests per window

  static isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;

    // Clean up old entries
    const entriesToDelete: string[] = [];
    this.requests.forEach((data, key) => {
      if (data.resetTime < windowStart) {
        entriesToDelete.push(key);
      }
    });
    entriesToDelete.forEach(key => this.requests.delete(key));

    const requestData = this.requests.get(identifier);

    if (!requestData) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.WINDOW_MS });
      return true;
    }

    if (requestData.resetTime < now) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.WINDOW_MS });
      return true;
    }

    if (requestData.count >= this.MAX_REQUESTS) {
      return false;
    }

    requestData.count++;
    return true;
  }

  static getRemainingRequests(identifier: string): number {
    const requestData = this.requests.get(identifier);
    if (!requestData || requestData.resetTime < Date.now()) {
      return this.MAX_REQUESTS;
    }
    return Math.max(0, this.MAX_REQUESTS - requestData.count);
  }
}

// Security headers helper
export class SecurityHeaders {
  static setSecurityHeaders(response: NextResponse): void {
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Enable XSS protection
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Control referrer information
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.stripe.com *.supabase.co js.stripe.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "img-src 'self' data: blob: *.stripe.com *.supabase.co",
      "font-src 'self' fonts.gstatic.com",
      "connect-src 'self' *.stripe.com *.supabase.co api.stripe.com",
      "frame-src 'self' *.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', csp);
    
    // HSTS in production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }
    
    // Permissions Policy
    const permissionsPolicy = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self "*.stripe.com")',
      'usb=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()'
    ].join(', ');
    
    response.headers.set('Permissions-Policy', permissionsPolicy);
  }
}