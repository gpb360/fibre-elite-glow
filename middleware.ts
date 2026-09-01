import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CSRFProtection } from '@/lib/csrf';

// Define old routes that should be redirected
const REDIRECTS: Record<string, string> = {
  // Example: '/old-path': '/new-path',
  '/ingredients/apple': '/ingredients/apple-fiber',
  '/ingredients/aloe': '/ingredients/soothing-aloe-vera-powder',
  '/essential': '/products/total-essential',
  '/essential-plus': '/products/total-essential-plus',
};

/**
 * Middleware for handling:
 * 1. Consistent trailing slash behavior (removing them)
 * 2. Redirecting legacy URLs to new locations
 * 3. Preventing access to dev routes in production
 * 4. Normalizing URL casing (lowercase)
 */
export function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl.clone();
    const { pathname } = url;
    
    // 0. CSRF protection for state-changing page requests. API routes enforce
    // their own authorization and are excluded by the matcher below.
    const csrfResponse = CSRFProtection.middleware(request);
    if (csrfResponse) {
      return csrfResponse;
    }
    
    // 1. Handle trailing slashes - remove them for consistency
    if (pathname !== '/' && pathname.endsWith('/')) {
      url.pathname = pathname.slice(0, -1);
      return NextResponse.redirect(url, 308); // 308 = Permanent Redirect
    }
    
    // 2. Redirect old routes to new ones
    if (REDIRECTS[pathname]) {
      url.pathname = REDIRECTS[pathname];
      return NextResponse.redirect(url, 308);
    }
    
    // Customer auth lives in the Supabase browser session, and protected data
    // APIs verify the bearer token. Do not redirect a valid local-storage
    // session based on cookies this application never writes.

    // 3. Block access to dev routes in production
    if (
      process.env.NODE_ENV === 'production' &&
      (pathname.startsWith('/dev/') || pathname === '/dev')
    ) {
      url.pathname = '/404';
      return NextResponse.rewrite(url);
    }
    
    // 4. Handle case sensitivity - redirect uppercase URLs to lowercase
    const isPublicFile = /\/[^/]+\.[^/]+$/.test(pathname);
    const lowercasePath = pathname.toLowerCase();
    if (!isPublicFile && pathname !== lowercasePath) {
      url.pathname = lowercasePath;
      return NextResponse.redirect(url, 308);
    }
    
    // 5. Add security headers to all responses
    const response = NextResponse.next();
    
    // Security Headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Content Security Policy
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.stripe.com *.supabase.co js.stripe.com",
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
        "img-src 'self' data: blob: *.stripe.com *.supabase.co",
        "font-src 'self' fonts.gstatic.com",
        "connect-src 'self' *.stripe.com *.supabase.co api.stripe.com http://127.0.0.1:* http://localhost:*",
        "frame-src 'self' *.stripe.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests"
      ].join('; ')
    );
    
    // HSTS in production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }
    
    // Permissions Policy
    response.headers.set(
      'Permissions-Policy',
      [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=(self "https://js.stripe.com")',
        'usb=()',
        'magnetometer=()',
        'accelerometer=()',
        'gyroscope=()'
      ].join(', ')
    );
    
    return response;
  } catch (error) {
    // Log error and return next response to prevent crashes
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    // Apply to all paths except for:
    // - API routes
    // - Static files (images, etc.)
    // - Favicon
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
