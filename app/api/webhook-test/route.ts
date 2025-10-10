import { NextResponse } from 'next/server';

// Diagnostic endpoint to test webhook configuration
export async function POST(request: Request) {
  try {
    console.log('=== WEBHOOK TEST DIAGNOSTIC ===');

    
    console.log('Request Headers:', {
      'content-type': request.headers.get('content-type'),
      'stripe-signature': request.headers.get('stripe-signature') ? 'PRESENT' : 'MISSING',
      'user-agent': request.headers.get('user-agent'),
      'origin': request.headers.get('origin'),
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
    });

    // Get body details
    const body = await request.text();
    console.log('Body Length:', body.length);
    console.log('Body Preview:', body.substring(0, 200));

    // Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      URL: process.env.URL,
    };

    console.log('Environment Check:', envCheck);

    // Check request source
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    console.log('Client IP:', clientIP);

    // Try to construct Stripe event if signature present
    const signature = request.headers.get('stripe-signature');
    if (signature && process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('Signature format check:', {
        hasTimestamp: signature.includes('t='),
        hasScheme: signature.includes('v1='),
        signatureLength: signature.length,
      });
    }

    // Return diagnostic info
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      diagnostics: {
        headers: {
          contentType: request.headers.get('content-type'),
          stripeSignature: signature ? 'PRESENT' : 'MISSING',
          userAgent: request.headers.get('user-agent'),
          origin: request.headers.get('origin'),
        },
        environment: envCheck,
        body: {
          length: body.length,
          isEmpty: body.length === 0,
          isJson: request.headers.get('content-type')?.includes('application/json'),
        },
        request: {
          method: request.method,
          url: request.url,
          clientIP,
        },
        signature: signature ? {
          present: true,
          format: {
            hasTimestamp: signature.includes('t='),
            hasScheme: signature.includes('v1='),
            length: signature.length,
          }
        } : {
          present: false,
        }
      }
    });

  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Also support GET for basic connectivity test
export async function GET() {
  return NextResponse.json({
    status: 'Webhook test endpoint is active',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      URL: process.env.URL,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    },
    endpoints: {
      webhook: '/api/webhooks/stripe',
      test: '/api/webhook-test',
    }
  });
}