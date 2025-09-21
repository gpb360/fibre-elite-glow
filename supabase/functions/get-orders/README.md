# Get Orders Edge Function

This Supabase Edge Function fetches orders for the authenticated user from the database.

## Usage

```typescript
const response = await fetch(`${SUPABASE_URL}/functions/v1/get-orders`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
})
```

## Query Parameters

- `limit` (optional): Number of orders to return (default: 10)
- `offset` (optional): Number of orders to skip (default: 0)
- `status` (optional): Filter by order status (pending, processing, shipped, delivered, cancelled)

## Response

```json
{
  "orders": [
    {
      "id": "uuid",
      "order_number": "ORD-123456",
      "email": "user@example.com",
      "status": "delivered",
      "payment_status": "paid",
      "total_amount": 59.99,
      "created_at": "2024-07-15T10:30:00Z",
      "order_items": [
        {
          "id": "uuid",
          "product_name": "Total Essential",
          "product_type": "total_essential",
          "quantity": 1,
          "unit_price": 59.99,
          "total_price": 59.99
        }
      ]
    }
  ],
  "total": 5,
  "hasMore": true
}
```

## Security

- Requires valid JWT token from Supabase Auth
- Users can only access their own orders (filtered by email)
- Uses service role key for database access