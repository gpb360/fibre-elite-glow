import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase, supabaseAdmin } from '@/integrations/supabase/client';
import Stripe from 'stripe';

// Define response types for better type safety
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetailsResponse {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  items: OrderItem[];
  createdAt: string;
}

/**
 * GET handler for retrieving checkout session details
 * 
 * @param request - The incoming request
 * @param params - The route parameters containing sessionId
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
): Promise<NextResponse> {
  const { sessionId } = params;

  // Validate session ID
  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json(
      { error: 'Invalid session ID' },
      { status: 400 }
    );
  }

  try {
    // Get user session if available (for authorization)
    const authHeader = request.headers.get('authorization');
    const userSession = authHeader ? 
      await supabase.auth.getSession() : null;
    const userId = userSession?.data?.session?.user?.id;

    // Retrieve checkout session from Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ['payment_intent', 'line_items'] }
    );

    if (!stripeSession) {
      return NextResponse.json(
        { error: 'Checkout session not found' },
        { status: 404 }
      );
    }

    // Check if we have a record of this session in our database
    const { data: checkoutSession, error: sessionError } = await supabaseAdmin
      ?.from('checkout_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single() || { data: null, error: new Error('Supabase admin client not available') };

    if (sessionError && sessionError.code !== 'PGRST116') { // Not found is not a critical error
      console.error('Error retrieving checkout session from database:', sessionError);
    }

    // If user is authenticated, verify they own this session
    if (userId && checkoutSession?.user_id && checkoutSession.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to checkout session' },
        { status: 403 }
      );
    }

    // Get order information from database if available
    const { data: orderData, error: orderError } = await supabaseAdmin
      ?.from('orders')
      .select('*')
      .eq('session_id', sessionId)
      .single() || { data: null, error: null };

    if (orderError && orderError.code !== 'PGRST116') {
      console.error('Error retrieving order from database:', orderError);
    }

    // Parse metadata from Stripe session
    let orderItems: OrderItem[] = [];
    let customerEmail = stripeSession.customer_details?.email || '';

    try {
      if (stripeSession.metadata?.order_items) {
        orderItems = JSON.parse(stripeSession.metadata.order_items);
      }
    } catch (error) {
      console.error('Error parsing order items from session metadata:', error);
    }

    // If we have no items from metadata, try to extract from line_items
    if (orderItems.length === 0 && stripeSession.line_items?.data) {
      orderItems = stripeSession.line_items.data.map(item => ({
        name: item.description || 'Product',
        quantity: item.quantity || 1,
        price: item.amount_subtotal ? item.amount_subtotal / 100 : 0
      }));
    }

    // Format order details for response
    const orderDetails: OrderDetailsResponse = {
      id: orderData?.id || stripeSession.id,
      orderNumber: orderData?.order_number || `ORD-${sessionId.substring(0, 8)}`,
      amount: stripeSession.amount_total || 0,
      currency: stripeSession.currency || 'usd',
      status: orderData?.status || stripeSession.status || 'completed',
      customerEmail: customerEmail,
      items: orderItems,
      createdAt: orderData?.created_at || new Date(stripeSession.created * 1000).toISOString()
    };

    return NextResponse.json(orderDetails);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    
    // Determine appropriate error response
    if (error instanceof Stripe.errors.StripeError) {
      if (error.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          { error: 'Invalid session ID or session expired' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to retrieve order details' },
      { status: 500 }
    );
  }
}
