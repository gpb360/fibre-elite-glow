import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CSRFProtection, RateLimiter } from '@/lib/csrf';

// Define old routes that should be redirected
const REDIRECTS: Record<string, string> = {
  // Example: '/old-path': '/new-path',
  '/ingredients/apple': '/ingredients/apple-fiber',
  '/ingredients/aloe': '/ingredients/soothing-aloe-vera-powder',
  '/essential': '/products/total-essential',
  '/essential-plus': '/products/total-essential-plus',
};

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/account',
  '/account/',
  '/orders',
  '/orders/',
  '/dev',
  '/dev/',
];

// Define admin routes that require elevated permissions
const ADMIN_ROUTES = [
  '/admin',
  '/admin/',
  '/dev/auth-setup',
];

// Simple auth token validation for Edge Runtime compatibility
function validateAuthToken(request: NextRequest): boolean {
  const token = request.cookies.get('sb-access-token')?.value;
  const refreshToken = request.cookies.get('sb-refresh-token')?.value;
  
  // Basic token presence check (in production, you'd validate JWT structure)
  return !!(token && refreshToken);
}

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
    
    // 0. Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.headers.get('cf-connecting-ip') ||
                     'unknown';
    if (!RateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    // 0.5. CSRF Protection
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
    
    // 2.5. Authentication checks for protected routes
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname === route || pathname.startsWith(route)
    );
    const isAdminRoute = ADMIN_ROUTES.some(route => 
      pathname === route || pathname.startsWith(route)
    );
    
    if (isProtectedRoute || isAdminRoute) {
      // Check authentication using simple token validation
      if (!validateAuthToken(request)) {
        // Not authenticated, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // For admin routes, additional checks would go here
      // (In production, you'd validate admin role from the JWT token)
      if (isAdminRoute) {
        // For now, just ensure they're authenticated
        // In production, decode JWT and check roles
      }
    }
    
    // 3. Block access to dev routes in production
    if (
      process.env.NODE_ENV === 'production' &&
      (pathname.startsWith('/dev/') || pathname === '/dev')
    ) {
      url.pathname = '/404';
      return NextResponse.rewrite(url);
    }
    
    // 4. Handle case sensitivity - redirect uppercase URLs to lowercase
    const lowercasePath = pathname.toLowerCase();
    if (pathname !== lowercasePath) {
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
    
    // Content Security Policy - Updated to fix Netlify frame blocking
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.stripe.com *.supabase.co js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
        "img-src 'self' data: blob: *.stripe.com *.supabase.co https://www.google-analytics.com",
        "font-src 'self' fonts.gstatic.com data:",
        "connect-src 'self' *.stripe.com *.supabase.co api.stripe.com https://www.google-analytics.com https://analytics.google.com",
        "frame-src 'self' *.stripe.com *.netlify.com *.netlify.app https://app.netlify.com",
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
        'payment=(self "*.stripe.com")',
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
