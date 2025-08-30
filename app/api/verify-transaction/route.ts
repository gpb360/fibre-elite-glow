import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Validation schema for transaction verification
const verificationSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  expectedAmount: z.number().min(0, 'Expected amount must be positive'),
  customerEmail: z.string().email('Valid email is required'),
  timestamp: z.number().min(0, 'Valid timestamp is required')
});

// Rate limiting for verification requests
const verificationAttempts = new Map<string, { count: number; lastAttempt: number }>();

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const attempt = verificationAttempts.get(clientId);
  
  if (!attempt) {
    verificationAttempts.set(clientId, { count: 1, lastAttempt: now });
    return false;
  }
  
  // Reset counter every hour
  if (now - attempt.lastAttempt > 60 * 60 * 1000) {
    verificationAttempts.set(clientId, { count: 1, lastAttempt: now });
    return false;
  }
  
  // Allow max 10 verification attempts per hour
  if (attempt.count >= 10) {
    return true;
  }
  
  attempt.count++;
  attempt.lastAttempt = now;
  verificationAttempts.set(clientId, attempt);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const clientIp = forwardedFor?.split(',')[0] || 'unknown';
    
    // Rate limiting
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { 
          error: 'Too many verification requests. Please try again later.',
          isValid: false,
          status: 'rate_limited'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    console.log('🔍 Transaction verification request:', { ...body, customerEmail: body.customerEmail?.substring(0, 5) + '***' });

    // Validate input
    const validation = verificationSchema.safeParse(body);
    if (!validation.success) {
      console.error('❌ Validation error:', validation.error.errors);
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors,
          isValid: false,
          status: 'invalid_request'
        },
        { status: 400 }
      );
    }

    const { sessionId, expectedAmount, customerEmail, timestamp } = validation.data;

    // Check request freshness (prevent replay attacks)
    const requestAge = Date.now() - timestamp;
    if (requestAge > 5 * 60 * 1000) { // 5 minutes
      return NextResponse.json(
        { 
          error: 'Request too old',
          isValid: false,
          status: 'expired_request'
        },
        { status: 400 }
      );
    }

    // Retrieve checkout session from Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent', 'customer']
      });
      console.log('✅ Retrieved session:', { 
        id: session.id, 
        status: session.status,
        payment_status: session.payment_status 
      });
    } catch (error) {
      console.error('❌ Failed to retrieve session:', error);
      return NextResponse.json(
        { 
          error: 'Session not found',
          isValid: false,
          status: 'session_not_found'
        },
        { status: 404 }
      );
    }

    // Verify session details
    const discrepancies: string[] = [];
    let isValid = true;

    // Check customer email
    if (session.customer_details?.email !== customerEmail) {
      discrepancies.push('Customer email does not match');
      isValid = false;
    }

    // Check amount (convert to cents for comparison)
    const sessionAmount = session.amount_total || 0;
    if (Math.abs(sessionAmount - expectedAmount) > 1) { // Allow 1 cent difference for rounding
      discrepancies.push(`Amount mismatch: expected ${expectedAmount}, got ${sessionAmount}`);
      isValid = false;
    }

    // Check session expiration
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      discrepancies.push('Session has expired');
    }

    // Determine transaction status
    let transactionStatus: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'requires_action' = 'pending';
    
    if (session.payment_status === 'paid') {
      transactionStatus = 'succeeded';
    } else if (session.payment_status === 'unpaid') {
      if (session.status === 'expired') {
        transactionStatus = 'canceled';
      } else {
        transactionStatus = 'pending';
      }
    } else if (session.payment_status === 'no_payment_required') {
      transactionStatus = 'succeeded';
    }

    // Get payment intent details if available
    let paymentIntentStatus = null;
    if (session.payment_intent && typeof session.payment_intent === 'object') {
      paymentIntentStatus = session.payment_intent.status;
      
      // Override transaction status based on payment intent
      switch (paymentIntentStatus) {
        case 'succeeded':
          transactionStatus = 'succeeded';
          break;
        case 'processing':
          transactionStatus = 'pending';
          break;
        case 'requires_action':
        case 'requires_confirmation':
          transactionStatus = 'requires_action';
          break;
        case 'canceled':
          transactionStatus = 'canceled';
          break;
        case 'payment_failed':
          transactionStatus = 'failed';
          break;
      }
    }

    // Create transaction object
    const transaction = {
      id: session.payment_intent?.id || session.id,
      sessionId: session.id,
      amount: sessionAmount,
      currency: session.currency || 'usd',
      status: transactionStatus,
      paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
      customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
      customerEmail: session.customer_details?.email || customerEmail,
      createdAt: new Date(session.created * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        sessionStatus: session.status,
        paymentStatus: session.payment_status,
        paymentIntentStatus,
        mode: session.mode,
        url: session.url
      }
    };

    console.log('✅ Transaction verification completed:', { 
      isValid, 
      status: transactionStatus, 
      discrepancies: discrepancies.length 
    });

    return NextResponse.json({
      isValid: isValid && discrepancies.length === 0,
      status: transactionStatus,
      transaction,
      discrepancies: discrepancies.length > 0 ? discrepancies : undefined,
      verifiedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Transaction verification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during verification',
        isValid: false,
        status: 'verification_error'
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}