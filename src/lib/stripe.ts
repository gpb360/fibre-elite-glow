import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === 'true';

// Get the appropriate Stripe keys based on environment
let _cachedSecretKey: string | undefined;
/**
 * Retrieve Stripe secret key.
 *
 * In production, this should come from **Supabase Secrets**, which automatically
 * injects the secret as an environment variable with the *same name* that was
 * stored (`STRIPE_SECRET_KEY`). In local development we still fall back to the
 * regular `.env.local` file so the DX remains unchanged.
 */
const getStripeSecretKey = (): string => {
  if (_cachedSecretKey) return _cachedSecretKey;

  // 1. Prefer the value that Supabase Secrets injects
  const keyFromEnv = process.env.STRIPE_SECRET_KEY;

  if (!keyFromEnv) {
    const err =
      '❌ Stripe secret key not found. ' +
      'Make sure you have stored `STRIPE_SECRET_KEY` in Supabase Secrets or ' +
      'added it to your local .env file for development.';
    throw new Error(err);
  }

  // Warn if we are in test mode but a live key is supplied
  if (isTestMode && !keyFromEnv.startsWith('sk_test_')) {
    // eslint-disable-next-line no-console
    console.warn(
      '⚠️  Using a LIVE Stripe secret key while test-mode is enabled. ' +
        'Consider switching to a test key (sk_test_...).'
    );
  }

  _cachedSecretKey = keyFromEnv;
  return keyFromEnv;
};

const getStripePublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
  }

  // Validate that we're using test keys in test mode
  if (isTestMode && !key.startsWith('pk_test_')) {
    console.warn('Warning: Using live Stripe key in test mode. Consider using test keys for testing.');
  }

  return key;
};

// Server-side Stripe instance
export const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(getStripePublishableKey());
};

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card'] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
  mode: 'payment' as const,
  success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,

  // Test mode configuration
  testMode: isTestMode,

  // Webhook configuration
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};

// Helper function to create a checkout session
export async function createCheckoutSession(params: {
  lineItems: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  customerEmail?: string;
  metadata?: Record<string, string>;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: params.lineItems,
      mode: STRIPE_CONFIG.mode,
      success_url: STRIPE_CONFIG.success_url,
      cancel_url: STRIPE_CONFIG.cancel_url,
      customer_email: params.customerEmail,
      metadata: params.metadata,

      // Enable test mode features if in test environment
      ...(isTestMode && {
        payment_intent_data: {
          metadata: {
            test_mode: 'true',
          },
        },
      }),
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Helper function to format amount for Stripe (convert dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper function to format amount for display (convert cents to dollars)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
