import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
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
  };

  return NextResponse.json(healthCheck);
}