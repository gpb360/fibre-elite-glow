import { NextResponse } from 'next/server';
import { 
  createCheckoutSession,
  formatAmountForStripe,
  STRIPE_CONFIG 
} from '@/lib/stripe';
import { supabaseAdmin } from '@/integrations/supabase/client';

// Define types for the request body
interface CartItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface CheckoutRequestBody {
  items: CartItem[];
  customerInfo: CustomerInfo;
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: CheckoutRequestBody = await request.json();
    
    // Validate request data
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: Cart is empty or items are not provided' },
        { status: 400 }
      );
    }

    if (!body.customerInfo || !body.customerInfo.email) {
      return NextResponse.json(
        { error: 'Invalid request: Customer information is required' },
        { status: 400 }
      );
    }

    // Format line items for Stripe
    const lineItems = body.items.map(item => ({
      price_data: {
        currency: STRIPE_CONFIG.currency,
        product_data: {
          name: item.productName,
          description: `Quantity: ${item.quantity}`,
          images: item.imageUrl ? [item.imageUrl] : undefined,
        },
        unit_amount: formatAmountForStripe(item.price), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Generate order number
    const orderNumber = `FEG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create metadata for the order
    const metadata = {
      order_number: orderNumber,
      customer_name: `${body.customerInfo.firstName} ${body.customerInfo.lastName}`,
      customer_email: body.customerInfo.email,
      shipping_address: JSON.stringify(body.customerInfo.address),
      order_items: JSON.stringify(body.items.map(item => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        product_type: item.productName.toLowerCase().includes('plus') ? 'total_essential_plus' : 'total_essential'
      }))),
    };

    // Create checkout session
    const session = await createCheckoutSession({
      lineItems,
      customerEmail: body.customerInfo.email,
      metadata,
    });

    // Try to store checkout session info in Supabase if available
    try {
      if (supabaseAdmin) {
        const { error } = await supabaseAdmin
          .from('checkout_sessions')
          .insert({
            session_id: session.id,
            customer_email: body.customerInfo.email,
            amount_total: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
            currency: session.currency || 'USD',
            payment_intent: session.payment_intent as string,
            metadata: metadata,
            status: session.status,
            payment_status: 'pending',
            test_mode: session.livemode === false,
            expires_at: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
            created_at: new Date().toISOString(),
          });
        
        if (error) {
          console.error('Error storing checkout session in Supabase:', error);
          // Continue with checkout even if storage fails
        } else {
          console.log(`Checkout session stored: ${session.id}`);
        }
      } else {
        console.warn('Supabase admin client not available - skipping session storage');
      }
    } catch (dbError) {
      // Log but don't fail the checkout if database storage fails
      console.error('Failed to store checkout session:', dbError);
    }

    // Return the checkout session URL
    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id
    });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}