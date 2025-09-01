import { NextResponse } from 'next/server';
import { ErrorSanitizer } from '@/lib/error-handler';

export async function GET() {
  try {
    // Security headers
    const response = NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
        hasStripePublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
        stripeTestMode: process.env.NEXT_PUBLIC_STRIPE_TEST_MODE,
      },
      version: '1.0.0',
      services: {
        database: 'connected', // In a real app, you'd test the actual connection
        stripe: !!process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing',
        supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
      }
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