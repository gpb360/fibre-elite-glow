import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import {
  buildCheckoutReceipt,
  createCheckoutReceiptToken,
  getStripeCheckoutIdempotencyKey,
  hashCheckoutReceiptToken,
  orderNumberForCheckoutRequest,
  verifyCheckoutReceiptToken,
} from '../src/lib/payment-hardening';
import { getCheckoutBaseUrl } from '../src/lib/base-url';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  verifyAdminRequest,
} from '../src/lib/admin-auth';

test.describe('payment hardening contracts', () => {
  test('derives stable Stripe and order identities from one client request id', () => {
    const requestId = '3c42ec64-3372-4a5d-8d5d-340a6da11db8';

    expect(getStripeCheckoutIdempotencyKey(requestId)).toBe(
      'checkout-session:v1:3c42ec64-3372-4a5d-8d5d-340a6da11db8'
    );
    expect(orderNumberForCheckoutRequest(requestId)).toBe('FEG-3C42EC6433724A5D8D5D');
  });

  test('receipt access token validates without storing the plaintext token', () => {
    const token = createCheckoutReceiptToken();
    const digest = hashCheckoutReceiptToken(token);

    expect(token).toHaveLength(43);
    expect(digest).toMatch(/^[a-f0-9]{64}$/);
    expect(verifyCheckoutReceiptToken(token, digest)).toBe(true);
    expect(verifyCheckoutReceiptToken(`${token.slice(0, -1)}x`, digest)).toBe(false);
    expect(verifyCheckoutReceiptToken('', digest)).toBe(false);
  });

  test('maps Stripe returned subtotal, tax, shipping, discount and total in cents', () => {
    const receipt = buildCheckoutReceipt({
      id: 'cs_test_receipt',
      amount_subtotal: 10_000,
      amount_total: 12_430,
      currency: 'cad',
      payment_status: 'paid',
      status: 'complete',
      created: 1_725_000_000,
      customer_details: { email: 'buyer@example.com' },
      total_details: {
        amount_discount: 500,
        amount_shipping: 1_200,
        amount_tax: 1_730,
      },
      automatic_tax: { status: 'complete' },
      line_items: {
        data: [
          {
            description: 'Total Essential',
            quantity: 2,
            amount_subtotal: 10_000,
            amount_total: 10_000,
          },
        ],
      },
    });

    expect(receipt.amountSubtotal).toBe(10_000);
    expect(receipt.taxAmount).toBe(1_730);
    expect(receipt.shippingAmount).toBe(1_200);
    expect(receipt.discountAmount).toBe(500);
    expect(receipt.amount).toBe(12_430);
    expect(receipt.items[0]).toEqual({
      name: 'Total Essential',
      quantity: 2,
      unitAmount: 5_000,
      lineAmount: 10_000,
    });
  });

  test('keeps Stripe return URLs on the Vercel demo instead of a stale base URL', () => {
    const previous = {
      nodeEnv: process.env.NODE_ENV,
      checkoutBaseUrl: process.env.CHECKOUT_BASE_URL,
      publicCheckoutBaseUrl: process.env.NEXT_PUBLIC_CHECKOUT_BASE_URL,
      vercelProjectUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL,
      vercelUrl: process.env.VERCEL_URL,
      publicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      allowedHosts: process.env.CHECKOUT_ALLOWED_HOSTS,
    };

    try {
      process.env.NODE_ENV = 'production';
      delete process.env.CHECKOUT_BASE_URL;
      delete process.env.NEXT_PUBLIC_CHECKOUT_BASE_URL;
      delete process.env.VERCEL_URL;
      delete process.env.CHECKOUT_ALLOWED_HOSTS;
      process.env.VERCEL_PROJECT_PRODUCTION_URL = 'fibre-elite-glow.vercel.app';
      process.env.NEXT_PUBLIC_BASE_URL = 'https://lbve.ca';

      expect(getCheckoutBaseUrl('https://attacker.example/checkout')).toBe(
        'https://fibre-elite-glow.vercel.app'
      );

      process.env.CHECKOUT_BASE_URL = 'https://shop.client.example';
      expect(getCheckoutBaseUrl('https://attacker.example/checkout')).toBe(
        'https://shop.client.example'
      );
    } finally {
      setOrDeleteEnv('NODE_ENV', previous.nodeEnv);
      setOrDeleteEnv('CHECKOUT_BASE_URL', previous.checkoutBaseUrl);
      setOrDeleteEnv('NEXT_PUBLIC_CHECKOUT_BASE_URL', previous.publicCheckoutBaseUrl);
      setOrDeleteEnv('VERCEL_PROJECT_PRODUCTION_URL', previous.vercelProjectUrl);
      setOrDeleteEnv('VERCEL_URL', previous.vercelUrl);
      setOrDeleteEnv('NEXT_PUBLIC_BASE_URL', previous.publicBaseUrl);
      setOrDeleteEnv('CHECKOUT_ALLOWED_HOSTS', previous.allowedHosts);
    }
  });

  test('webhook side effects are migration-backed and the public affiliate writer is removed', () => {
    const root = path.resolve(__dirname, '..');
    const webhook = readFileSync(path.join(root, 'app/api/webhooks/stripe/route.ts'), 'utf8');
    const affiliate = readFileSync(path.join(root, 'app/api/affiliate/validate/route.ts'), 'utf8');
    const migration = readFileSync(path.join(root, 'supabase/stripe-payment-hardening.sql'), 'utf8');

    expect(webhook).toContain("'claim_stripe_webhook_event'");
    expect(webhook).toContain("'apply_paid_order_inventory'");
    expect(webhook).toContain("'record_verified_affiliate_sale'");
    expect(affiliate).not.toContain('export async function POST');
    expect(migration).toContain('event_id TEXT PRIMARY KEY');
    expect(migration).toContain('CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliate_sales_stripe_session');
    expect(migration).toContain('GRANT EXECUTE ON FUNCTION apply_paid_order_inventory');
    expect(migration).toContain('CREATE OR REPLACE FUNCTION payment_checkout_ready()');
    expect(migration).toContain('COALESCE(package.stock_quantity, 0) >= quantities.quantity');
    expect(migration).not.toContain('GREATEST(0, COALESCE(package.stock_quantity, 0)');

    const checkoutRoute = readFileSync(
      path.join(root, 'app/api/create-checkout-session/route.ts'),
      'utf8'
    );
    expect(checkoutRoute).toContain('idempotencyKey: getStripeCheckoutIdempotencyKey');
    expect(checkoutRoute).toContain('Math.floor(body.checkoutRequestedAt / 1000)');
    expect(checkoutRoute).toContain("'payment_checkout_ready'");
    expect(checkoutRoute).toContain('stripe.checkout.sessions.expire(session.id)');
    expect(checkoutRoute).toContain("process.env.ENABLE_LIVE_CHECKOUT !== 'true'");
    expect(checkoutRoute).toContain("code: 'LIVE_CHECKOUT_DISABLED'");

    expect(webhook).toContain('session.collected_information?.shipping_details');
    expect(webhook).toContain('const billingAddress =');
    expect(webhook).toContain('const fullSession = session;');
  });

  test('success receipt refresh always refetches through its secure token', () => {
    const root = path.resolve(__dirname, '..');
    const successPage = readFileSync(path.join(root, 'app/checkout/success/page.tsx'), 'utf8');

    expect(successPage).toContain('receipt_token');
    expect(successPage).toContain('X-Receipt-Token');
    expect(successPage).toContain('replaceState');
    expect(successPage).toContain("cache: 'no-store'");
    expect(successPage).not.toContain("sessionStorage.getItem(processedKey)");
    expect(successPage).toContain('data-testid="order-tax"');

    const receiptRoute = readFileSync(
      path.join(root, 'app/api/checkout-session/[sessionId]/route.ts'),
      'utf8'
    );
    expect(receiptRoute).toContain("request.headers.get('x-receipt-token')");
    expect(receiptRoute).not.toContain("searchParams.get('receipt_token')");
  });

  test('daily summary requires the signed admin session and ignores query API keys', () => {
    const previousSecret = process.env.ADMIN_SESSION_SECRET;
    process.env.ADMIN_SESSION_SECRET = 'test-only-admin-session-secret';

    try {
      const unsignedRequest = new Request('https://demo.example/api/admin/daily-summary?api_key=forged');
      expect(verifyAdminRequest(unsignedRequest)).toBe(false);

      const signedValue = createAdminSessionValue();
      const signedRequest = new Request('https://demo.example/api/admin/daily-summary', {
        headers: { cookie: `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(signedValue)}` },
      });
      expect(verifyAdminRequest(signedRequest)).toBe(true);

      const root = path.resolve(__dirname, '..');
      const dailySummary = readFileSync(
        path.join(root, 'app/api/admin/daily-summary/route.ts'),
        'utf8'
      );
      expect(dailySummary).toContain('verifyAdminRequest(request)');
      expect(dailySummary).not.toContain('ADMIN_API_KEY');
    } finally {
      setOrDeleteEnv('ADMIN_SESSION_SECRET', previousSecret);
    }
  });
});

function setOrDeleteEnv(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}
