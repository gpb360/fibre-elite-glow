import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
    
    // 5. Return response with minimal processing
    return NextResponse.next();
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
