import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/integrations/supabase/admin';
import {
  buildCheckoutReceipt,
  verifyCheckoutReceiptToken,
} from '@/lib/payment-hardening';
import Stripe from 'stripe';

async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  const authorization = request.headers.get('authorization');
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  return error ? null : data.user?.id || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  if (!/^cs_(?:test_|live_)?[A-Za-z0-9_]+$/.test(sessionId) || sessionId.length > 255) {
    return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
  }

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items', 'invoice'],
    });

    const receiptToken = request.headers.get('x-receipt-token') || '';
    const expectedReceiptDigest = stripeSession.metadata?.receipt_access_hash || '';
    const hasValidReceiptToken = verifyCheckoutReceiptToken(receiptToken, expectedReceiptDigest);
    const authenticatedUserId = await getAuthenticatedUserId(request);

    const checkoutResult = supabaseAdmin
      ? await supabaseAdmin
          .from('checkout_sessions')
          .select('user_id')
          .eq('session_id', sessionId)
          .maybeSingle()
      : { data: null, error: null };

    if (checkoutResult.error) {
      console.error('Unable to verify checkout session owner:', checkoutResult.error);
    }

    const isAuthenticatedOwner = Boolean(
      authenticatedUserId &&
      checkoutResult.data?.user_id &&
      checkoutResult.data.user_id === authenticatedUserId
    );

    if (!hasValidReceiptToken && !isAuthenticatedOwner) {
      return NextResponse.json({ error: 'Receipt access denied' }, { status: 403 });
    }

    if (!['paid', 'no_payment_required'].includes(stripeSession.payment_status)) {
      return NextResponse.json({ error: 'Payment is not complete' }, { status: 409 });
    }

    const orderResult = supabaseAdmin
      ? await supabaseAdmin
          .from('orders')
          .select('id, order_number, created_at, status')
          .eq('session_id', sessionId)
          .maybeSingle()
      : { data: null, error: null };

    if (orderResult.error) {
      console.error('Unable to load persisted order:', orderResult.error);
    }

    const receipt = buildCheckoutReceipt(stripeSession);
    const invoice = stripeSession.invoice && typeof stripeSession.invoice !== 'string'
      ? stripeSession.invoice as Stripe.Invoice
      : null;

    return NextResponse.json(
      {
        ...receipt,
        id: orderResult.data?.id || receipt.id,
        orderNumber:
          orderResult.data?.order_number ||
          stripeSession.metadata?.order_number ||
          `ORD-${sessionId.slice(-8)}`,
        status: orderResult.data?.status || receipt.status,
        createdAt: orderResult.data?.created_at || receipt.createdAt,
        invoiceUrl: invoice?.hosted_invoice_url || null,
        invoicePdfUrl: invoice?.invoice_pdf || null,
      },
      {
        headers: {
          'Cache-Control': 'private, no-store, max-age=0',
          Pragma: 'no-cache',
        },
      }
    );
  } catch (error) {
    if (
      error instanceof Stripe.errors.StripeError &&
      error.type === 'StripeInvalidRequestError'
    ) {
      return NextResponse.json(
        { error: 'Invalid session ID or session expired' },
        { status: 404 }
      );
    }

    console.error('Failed to retrieve checkout receipt:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order details' },
      { status: 500 }
    );
  }
}
