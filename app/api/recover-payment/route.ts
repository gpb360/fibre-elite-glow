import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Validation schema for payment recovery
const recoverySchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  customerEmail: z.string().email('Valid email is required'),
  expectedAmount: z.number().min(0, 'Expected amount must be positive'),
  currentStatus: z.enum(['pending', 'succeeded', 'failed', 'canceled', 'requires_action']),
  retryCount: z.number().min(0).max(5, 'Maximum 5 retry attempts allowed'),
  timestamp: z.number().min(0, 'Valid timestamp is required')
});

// Rate limiting for recovery requests
const recoveryAttempts = new Map<string, { count: number; lastAttempt: number; sessionIds: Set<string> }>();

function isRateLimited(clientId: string, sessionId: string): boolean {
  const now = Date.now();
  const attempt = recoveryAttempts.get(clientId);
  
  if (!attempt) {
    recoveryAttempts.set(clientId, { 
      count: 1, 
      lastAttempt: now, 
      sessionIds: new Set([sessionId]) 
    });
    return false;
  }
  
  // Reset counter every hour
  if (now - attempt.lastAttempt > 60 * 60 * 1000) {
    recoveryAttempts.set(clientId, { 
      count: 1, 
      lastAttempt: now, 
      sessionIds: new Set([sessionId]) 
    });
    return false;
  }
  
  // Allow max 3 recovery attempts per session per hour
  if (attempt.sessionIds.has(sessionId) && attempt.count >= 3) {
    return true;
  }
  
  attempt.count++;
  attempt.lastAttempt = now;
  attempt.sessionIds.add(sessionId);
  recoveryAttempts.set(clientId, attempt);
  return false;
}

async function attemptPaymentIntentRecovery(paymentIntentId: string, customerEmail: string) {
  try {
    console.log('🔄 Attempting payment intent recovery:', paymentIntentId);
    
    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Check if recovery is possible
    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        transaction: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: 'succeeded' as const,
          customerEmail,
          createdAt: new Date(paymentIntent.created * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        nextSteps: ['Payment has already been completed successfully']
      };
    }
    
    if (paymentIntent.status === 'requires_action') {
      return {
        success: false,
        requiresAction: true,
        actionUrl: paymentIntent.next_action?.redirect_to_url?.url,
        nextSteps: [
          'Complete the required authentication with your bank',
          'Return to complete the payment process',
          'Contact support if you need assistance'
        ]
      };
    }
    
    if (paymentIntent.status === 'requires_payment_method') {
      // Try to create a new setup intent for the customer
      return {
        success: false,
        nextSteps: [
          'Please return to checkout and try a different payment method',
          'Verify your card details are correct',
          'Contact your bank if the issue persists'
        ]
      };
    }
    
    if (['canceled', 'payment_failed'].includes(paymentIntent.status)) {
      return {
        success: false,
        nextSteps: [
          'The original payment has failed and cannot be recovered',
          'Please return to checkout to try again',
          'Consider using a different payment method',
          'Contact support if you continue to experience issues'
        ]
      };
    }
    
    return {
      success: false,
      nextSteps: [
        'Payment recovery is not possible for this transaction',
        'Please start a new checkout process',
        'Contact support for assistance'
      ]
    };
    
  } catch (error) {
    console.error('❌ Payment intent recovery error:', error);
    return {
      success: false,
      error: 'Failed to recover payment intent',
      nextSteps: [
        'Unable to access payment details',
        'Please contact customer support',
        'Have your order reference ready'
      ]
    };
  }
}

async function attemptSessionRecovery(sessionId: string, customerEmail: string) {
  try {
    console.log('🔄 Attempting session recovery:', sessionId);
    
    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });
    
    // Check session status
    if (session.status === 'complete' && session.payment_status === 'paid') {
      return {
        success: true,
        transaction: {
          id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || session.id,
          sessionId: session.id,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'succeeded' as const,
          customerEmail,
          createdAt: new Date(session.created * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        nextSteps: ['Payment was already completed successfully']
      };
    }
    
    // If session has a payment intent, try to recover it
    if (session.payment_intent) {
      const paymentIntentId = typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent.id;
      
      return await attemptPaymentIntentRecovery(paymentIntentId, customerEmail);
    }
    
    // Check if session is expired
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      return {
        success: false,
        nextSteps: [
          'The checkout session has expired',
          'Please return to your cart and start checkout again',
          'Your cart items should still be saved'
        ]
      };
    }
    
    // Session is still active but payment failed
    return {
      success: false,
      nextSteps: [
        'The payment session is still active',
        'You can return to complete the payment',
        'Try a different payment method if the original failed'
      ]
    };
    
  } catch (error) {
    console.error('❌ Session recovery error:', error);
    return {
      success: false,
      error: 'Failed to recover session',
      nextSteps: [
        'Unable to access session details',
        'Please start a new checkout process',
        'Contact support if you continue to have issues'
      ]
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const clientIp = forwardedFor?.split(',')[0] || 'unknown';
    
    const body = await request.json();
    console.log('🚨 Payment recovery request:', { 
      sessionId: body.sessionId,
      customerEmail: body.customerEmail?.substring(0, 5) + '***',
      currentStatus: body.currentStatus,
      retryCount: body.retryCount
    });

    // Validate input
    const validation = recoverySchema.safeParse(body);
    if (!validation.success) {
      console.error('❌ Validation error:', validation.error.errors);
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors,
          success: false
        },
        { status: 400 }
      );
    }

    const { sessionId, customerEmail, expectedAmount, currentStatus, retryCount, timestamp } = validation.data;

    // Rate limiting
    if (isRateLimited(clientIp, sessionId)) {
      return NextResponse.json(
        { 
          error: 'Too many recovery attempts for this session. Please wait before trying again.',
          success: false,
          nextSteps: [
            'Wait at least 1 hour before attempting recovery again',
            'Contact customer support for immediate assistance',
            'Check if the payment was actually processed'
          ]
        },
        { status: 429 }
      );
    }

    // Check request freshness (prevent replay attacks)
    const requestAge = Date.now() - timestamp;
    if (requestAge > 10 * 60 * 1000) { // 10 minutes for recovery requests
      return NextResponse.json(
        { 
          error: 'Request too old',
          success: false
        },
        { status: 400 }
      );
    }

    // If payment already succeeded, no recovery needed
    if (currentStatus === 'succeeded') {
      return NextResponse.json({
        success: true,
        nextSteps: ['Payment has already been completed successfully'],
        transaction: {
          sessionId,
          status: 'succeeded',
          customerEmail,
          updatedAt: new Date().toISOString()
        }
      });
    }

    // Attempt recovery based on current status
    let recoveryResult;
    
    switch (currentStatus) {
      case 'failed':
      case 'canceled':
      case 'pending':
      case 'requires_action':
        recoveryResult = await attemptSessionRecovery(sessionId, customerEmail);
        break;
      
      default:
        recoveryResult = {
          success: false,
          error: `Cannot recover payment with status: ${currentStatus}`,
          nextSteps: [
            'Please start a new checkout process',
            'Contact support if you believe this is an error'
          ]
        };
    }

    // Add retry information to response
    const response = {
      ...recoveryResult,
      retryCount: retryCount + 1,
      recoveredAt: new Date().toISOString(),
      sessionId
    };

    console.log('✅ Recovery attempt completed:', { 
      success: response.success, 
      sessionId,
      retryCount: response.retryCount
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Payment recovery error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error during recovery',
        success: false,
        nextSteps: [
          'Please try again in a few minutes',
          'Contact customer support if the issue persists',
          'Have your session ID ready for support'
        ]
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