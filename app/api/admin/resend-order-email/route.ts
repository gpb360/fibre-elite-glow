import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { simpleEmailService } from '@/lib/simple-email-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  packageSize?: string;
  totalBoxes?: number;
  product_type?: string;
};

function parseOrderItems(session: Stripe.Checkout.Session): OrderItem[] {
  const rawItems = session.metadata?.order_items;
  if (rawItems) {
    try {
      const parsed = JSON.parse(rawItems);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          name: String(item.name || item.productName || 'Product'),
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0),
          packageSize: item.package_size ? String(item.package_size) : undefined,
          totalBoxes: item.total_boxes ? Number(item.total_boxes) : undefined,
          product_type: item.product_type,
        }));
      }
    } catch {
      // Fall through to line_items.
    }
  }

  return (session.line_items?.data || []).map((item) => ({
    name: item.description || 'Product',
    quantity: item.quantity || 1,
    price: item.amount_subtotal ? item.amount_subtotal / 100 : 0,
  }));
}

function parseShippingAddress(session: Stripe.Checkout.Session) {
  const rawAddress = session.metadata?.shipping_address;
  const customerName = session.metadata?.customer_name || session.customer_details?.name || '';
  const [firstName = '', ...lastParts] = customerName.split(' ');
  const stripeAddress = session.customer_details?.address;

  if (stripeAddress) {
    return {
      firstName,
      lastName: lastParts.join(' '),
      addressLine1: stripeAddress.line1 || '',
      addressLine2: stripeAddress.line2 || '',
      city: stripeAddress.city || '',
      state: stripeAddress.state || '',
      postalCode: stripeAddress.postal_code || '',
      country: stripeAddress.country || 'CA',
    };
  }

  if (rawAddress) {
    try {
      const parsed = JSON.parse(rawAddress);
      return {
        firstName,
        lastName: lastParts.join(' '),
        addressLine1: parsed.line1 || '',
        addressLine2: parsed.line2 || '',
        city: parsed.city || '',
        state: parsed.state || '',
        postalCode: parsed.postal_code || '',
        country: parsed.country || 'CA',
      };
    } catch {
      // Fall through to Stripe customer details.
    }
  }

  return {
    firstName,
    lastName: lastParts.join(' '),
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'CA',
  };
}

function resolveTimeZone(session: Stripe.Checkout.Session): string {
  const metadataZone = session.metadata?.client_timezone;
  if (metadataZone) return metadataZone;

  const address = session.customer_details?.address;
  const country = address?.country || session.metadata?.shipping_country;
  const state = address?.state || session.metadata?.shipping_state;

  if (country === 'CA') {
    if (state === 'BC') return 'America/Vancouver';
    if (state === 'AB') return 'America/Edmonton';
    if (state === 'MB') return 'America/Winnipeg';
    if (state === 'SK') return 'America/Regina';
    if (['NB', 'NS', 'PE'].includes(state || '')) return 'America/Halifax';
    if (state === 'NL') return 'America/St_Johns';
    return 'America/Toronto';
  }

  if (country === 'US') {
    if (['CA', 'WA', 'OR', 'NV'].includes(state || '')) return 'America/Los_Angeles';
    if (['AZ', 'CO', 'ID', 'MT', 'NM', 'UT', 'WY'].includes(state || '')) return 'America/Denver';
    if (['AL', 'AR', 'IL', 'IA', 'LA', 'MN', 'MS', 'MO', 'OK', 'TX', 'WI'].includes(state || '')) return 'America/Chicago';
    return 'America/New_York';
  }

  return 'America/Toronto';
}

export async function POST(request: Request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId } = await request.json();
    if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      return NextResponse.json({ error: 'Valid Stripe checkout session ID required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    if (session.status !== 'complete' || session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Checkout session is not complete and paid', status: session.status, paymentStatus: session.payment_status },
        { status: 400 }
      );
    }

    const customerEmail = session.customer_details?.email || session.customer_email || session.metadata?.customer_email;
    if (!customerEmail) {
      return NextResponse.json({ error: 'Checkout session has no customer email' }, { status: 400 });
    }

    const customerName = session.metadata?.customer_name || session.customer_details?.name || 'Valued Customer';
    const orderNumber = session.metadata?.order_number || `STRIPE-${session.id.slice(-10)}`;
    const items = parseOrderItems(session);
    const subtotalAmount = (session.amount_subtotal || 0) / 100;
    const shippingAmount = (session.total_details?.amount_shipping || 0) / 100;
    const taxAmount = (session.total_details?.amount_tax || 0) / 100;
    const totalAmount = (session.amount_total || 0) / 100;
    const currency = session.currency?.toUpperCase() || 'CAD';
    const shippingAddress = parseShippingAddress(session);
    const orderDate = new Date(session.created * 1000);
    const timeZone = resolveTimeZone(session);
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;

    console.log(`📧 Admin resend requested for Stripe session ${session.id}, order ${orderNumber}`);

    const orderConfirmationSent = await simpleEmailService.sendOrderConfirmation({
      orderNumber,
      customerEmail,
      customerName,
      items,
      orderDate,
      subtotalAmount,
      shippingAmount,
      taxAmount,
      totalAmount,
      currency,
      timeZone,
      customerPhone: session.customer_details?.phone || undefined,
      shippingAddress,
    });

    const adminNotificationSent = await simpleEmailService.sendAdminNotification({
      orderNumber,
      customerEmail,
      customerName,
      items,
      orderDate,
      subtotalAmount,
      shippingAmount,
      taxAmount,
      totalAmount,
      currency,
      timeZone,
      customerPhone: session.customer_details?.phone || undefined,
      shippingAddress,
      paymentIntentId,
    });

    return NextResponse.json({
      success: orderConfirmationSent && adminNotificationSent,
      orderNumber,
      customerEmail,
      results: {
        orderConfirmationSent,
        adminNotificationSent,
      },
    });
  } catch (error) {
    console.error('Resend order email failed:', error);
    return NextResponse.json({ error: 'Failed to resend order email' }, { status: 500 });
  }
}
