import { NextResponse } from 'next/server';
import { ErrorSanitizer } from '@/lib/error-handler';

export async function GET() {
  try {
    // Security headers
    const response = NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    return response;
    
  } catch (error) {
    console.error('Health check error:', error);
    
    const errorResponse = NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: ErrorSanitizer.sanitizeMessage(error),
        code: 'HEALTH_CHECK_FAILED'
      },
      { status: 500 }
    );
    
    // Add security headers even for error responses
    errorResponse.headers.set('X-Content-Type-Options', 'nosniff');
    errorResponse.headers.set('X-Frame-Options', 'DENY');
    errorResponse.headers.set('X-XSS-Protection', '1; mode=block');
    
    return errorResponse;
  }
}
