# Send Email Edge Function

This Supabase Edge Function handles all transactional emails for La Belle Vie using Resend.

## Setup Instructions

### 1. Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key (starts with `re_`)

### 2. Verify Your Domain
1. In Resend dashboard, go to Domains
2. Add your domain: `lbve.ca`
3. Add the DNS records provided by Resend to your domain
4. Wait for verification (usually a few minutes)

### 3. Configure Supabase Secrets
Set the required environment variables for your Edge Function:

```bash
# Set Resend API key
supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here

# Set admin email
supabase secrets set ADMIN_EMAIL=admin@lbve.ca
```

### 4. Deploy the Function
```bash
supabase functions deploy send-email
```

### 5. Update Local Environment
Add to your `.env.local`:
```env
RESEND_API_KEY=re_your_actual_api_key_here
ADMIN_EMAIL=admin@lbve.ca
```

## Email Types

### Order Confirmation
- **Trigger**: Stripe checkout completed
- **Recipient**: Customer
- **Subject**: "Order Confirmed: FEG-XXXXXX"
- **Content**: Order details, items, total

### Admin Notification
- **Trigger**: Stripe checkout completed
- **Recipient**: Admin (admin@lbve.ca)
- **Subject**: "🛒 New Order: FEG-XXXXXX - $XX.XX"
- **Content**: Customer info, order details, Stripe link

### Payment Failed
- **Trigger**: Stripe payment_intent.payment_failed
- **Recipient**: Admin (admin@lbve.ca)
- **Subject**: "⚠️ Payment Failed - ORDER"
- **Content**: Error details, Stripe link

## Testing

### Local Testing
```bash
# Start function locally
supabase functions serve send-email

# Test with curl (in another terminal)
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "type": "order_confirmation",
    "data": {
      "customerEmail": "test@example.com",
      "customerName": "Test User",
      "orderNumber": "FEG-TEST01",
      "totalAmount": "99.99",
      "items": [
        {
          "description": "Premium Fiber Supplement",
          "quantity": 2,
          "amount": "99.99"
        }
      ],
      "orderId": "test-uuid",
      "orderDate": "1/1/2025"
    }
  }'
```

### Production Testing
After deployment, Stripe webhooks will automatically trigger emails when:
- A checkout session is completed
- A payment fails

## Email Customization

To customize email templates, edit the template functions in `index.ts`:
- `generateOrderEmail()` - Customer order confirmations
- `generateAdminEmail()` - Admin notifications
- `generateFailureEmail()` - Payment failure alerts

## Troubleshooting

### Emails not sending
1. Check Resend API key is set correctly: `supabase secrets list`
2. Verify domain is verified in Resend dashboard
3. Check function logs: `supabase functions logs send-email`
4. Ensure the `from` email domain matches your verified domain

### Emails going to spam
1. Complete domain verification in Resend
2. Add SPF, DKIM, and DMARC records as provided by Resend
3. Use a verified domain, not a free email provider

### Function errors
Check logs for detailed error messages:
```bash
supabase functions logs send-email --tail
```

## Integration

This function is automatically called by the Stripe webhook handler at:
- `app/api/webhooks/stripe/route.ts`

When Stripe events occur, the webhook invokes this function with the appropriate email type and data.
