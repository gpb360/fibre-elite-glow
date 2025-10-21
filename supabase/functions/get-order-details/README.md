# Get Order Details Edge Function

This Supabase Edge Function fetches detailed information for a specific order, including all order items and package details.

## Usage

```typescript
const response = await fetch(`${SUPABASE_URL}/functions/v1/get-order-details/${orderId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
})
```

## URL Parameters

- `orderId`: The UUID of the order to fetch

## Response

```json
{
  "id": "uuid",
  "order_number": "ORD-123456",
  "email": "user@example.com",
  "status": "delivered",
  "payment_status": "paid",
  "subtotal": 59.99,
  "tax_amount": 0,
  "shipping_amount": 0,
  "total_amount": 59.99,
  "currency": "USD",
  "tracking_number": "TRK123456789",
  "notes": "Handle with care",
  "created_at": "2024-07-15T10:30:00Z",
  "updated_at": "2024-07-16T14:20:00Z",
  "shipping_address": {
    "name": "John Doe",
    "company": null,
    "line1": "123 Main St",
    "line2": null,
    "city": "Vancouver",
    "state": "BC",
    "postal_code": "V6B 1A1",
    "country": "CA"
  },
  "billing_address": {
    "name": "John Doe",
    "company": null,
    "line1": "123 Main St",
    "line2": null,
    "city": "Vancouver",
    "state": "BC",
    "postal_code": "V6B 1A1",
    "country": "CA"
  },
  "order_items": [
    {
      "id": "uuid",
      "product_name": "Total Essential",
      "product_type": "total_essential",
      "quantity": 1,
      "unit_price": 59.99,
      "total_price": 59.99,
      "package_id": "uuid",
      "package_details": {
        "id": "uuid",
        "product_name": "Total Essential - 30 Day Supply",
        "product_type": "total_essential",
        "sku": "TE-30-001",
        "weight_grams": 500
      }
    }
  ]
}
```

## Security

- Requires valid JWT token from Supabase Auth
- Users can only access their own orders (filtered by email)
- Returns 404 if order doesn't exist or doesn't belong to user
- Uses service role key for database access