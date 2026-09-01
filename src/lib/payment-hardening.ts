import { createHash, randomBytes, timingSafeEqual } from 'crypto';

const CHECKOUT_IDEMPOTENCY_PREFIX = 'checkout-session:v1:';

export function getStripeCheckoutIdempotencyKey(checkoutRequestId: string): string {
  return `${CHECKOUT_IDEMPOTENCY_PREFIX}${checkoutRequestId}`;
}

export function orderNumberForCheckoutRequest(checkoutRequestId: string): string {
  const compactId = checkoutRequestId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `FEG-${compactId.slice(0, 20)}`;
}

export function createCheckoutReceiptToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashCheckoutReceiptToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function verifyCheckoutReceiptToken(token: string, expectedDigest: string): boolean {
  if (!token || !/^[a-f0-9]{64}$/i.test(expectedDigest)) return false;

  const actual = Buffer.from(hashCheckoutReceiptToken(token), 'hex');
  const expected = Buffer.from(expectedDigest, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

interface StripeReceiptLineItem {
  description?: string | null;
  quantity?: number | null;
  amount_subtotal?: number | null;
  amount_total?: number | null;
}

export interface StripeReceiptSession {
  id: string;
  amount_subtotal?: number | null;
  amount_total?: number | null;
  currency?: string | null;
  payment_status?: string | null;
  status?: string | null;
  created: number;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  total_details?: {
    amount_discount?: number | null;
    amount_shipping?: number | null;
    amount_tax?: number | null;
  } | null;
  automatic_tax?: { status?: string | null } | null;
  line_items?: { data?: StripeReceiptLineItem[] } | null;
}

export interface CheckoutReceiptItem {
  name: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
}

export interface CheckoutReceipt {
  id: string;
  amount: number;
  amountSubtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  currency: string;
  paymentStatus: string;
  status: string;
  customerEmail: string;
  automaticTaxStatus: string | null;
  items: CheckoutReceiptItem[];
  createdAt: string;
}

export function buildCheckoutReceipt(session: StripeReceiptSession): CheckoutReceipt {
  const items = (session.line_items?.data || []).map(item => {
    const quantity = Math.max(1, item.quantity || 1);
    const lineAmount = item.amount_subtotal ?? item.amount_total ?? 0;

    return {
      name: item.description || 'Product',
      quantity,
      unitAmount: Math.round(lineAmount / quantity),
      lineAmount,
    };
  });

  return {
    id: session.id,
    amount: session.amount_total ?? 0,
    amountSubtotal: session.amount_subtotal ?? 0,
    taxAmount: session.total_details?.amount_tax ?? 0,
    shippingAmount: session.total_details?.amount_shipping ?? 0,
    discountAmount: session.total_details?.amount_discount ?? 0,
    currency: session.currency || 'cad',
    paymentStatus: session.payment_status || 'unpaid',
    status: session.status || 'open',
    customerEmail: session.customer_details?.email || session.customer_email || '',
    automaticTaxStatus: session.automatic_tax?.status || null,
    items,
    createdAt: new Date(session.created * 1000).toISOString(),
  };
}
