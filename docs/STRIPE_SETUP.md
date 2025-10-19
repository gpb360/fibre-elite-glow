# 🚀 Stripe MCP Server Setup Guide

This guide will help you set up the Stripe Model Context Protocol (MCP) server for your La Belle Vie e-commerce application.

## 📋 Prerequisites

1. **Stripe Account**: Create a free account at [https://stripe.com](https://stripe.com)
2. **API Keys**: Get your test API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

## 🔧 Setup Steps

### Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Step 2: Configure Environment Variables

Update the `.env.local` file with your actual Stripe keys:

```bash
# Replace with your actual Stripe keys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### Step 3: Test the Setup

Run the setup script to verify your configuration:

```bash
node scripts/setup-stripe-mcp.js
```

### Step 4: Start the Stripe MCP Server

Once configured, start the MCP server with recommended tools:

```bash
npx @stripe/mcp --tools=customers.create,customers.read,products.create,products.read,prices.create,prices.read,payment_intents.create,checkout.sessions.create --api-key=$STRIPE_SECRET_KEY
```

## 🛠️ Available MCP Tools

The Stripe MCP server provides these tools for our e-commerce application:

### Customer Management
- `customers.create` - Create new customers
- `customers.read` - Retrieve customer information
- `customers.update` - Update customer details

### Product Management
- `products.create` - Create new products in Stripe
- `products.read` - Retrieve product information
- `products.update` - Update product details

### Pricing Management
- `prices.create` - Create pricing for products
- `prices.read` - Retrieve pricing information
- `prices.update` - Update pricing details

### Payment Processing
- `payment_intents.create` - Create payment intents
- `payment_intents.read` - Retrieve payment status
- `checkout.sessions.create` - Create Stripe Checkout sessions

## 🔄 Integration with Your Application

The MCP server will integrate with:

1. **Product Pages**: Convert your existing packages to Stripe products
2. **Shopping Cart**: Create payment intents for cart items
3. **Checkout Flow**: Use Stripe Checkout for secure payments
4. **Order Management**: Track payments and order status

## 🧪 Testing

Use Stripe's test card numbers for testing:

- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **3D Secure**: `4000002500003155`

## 📚 Next Steps

After setting up the MCP server:

1. **Database Schema**: Extend Supabase with order tables
2. **Shopping Cart**: Implement cart functionality
3. **Checkout Flow**: Build the payment process
4. **Order Management**: Handle successful payments

## 🆘 Troubleshooting

### Common Issues

1. **Invalid API Key**: Ensure you're using the correct test keys
2. **Environment Variables**: Make sure `.env.local` is properly configured
3. **MCP Server Not Starting**: Check that your API key is valid

### Getting Help

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe MCP Documentation](https://github.com/stripe/mcp)
- [Stripe Support](https://support.stripe.com)

## 🔐 Security Notes

- Never commit your secret keys to version control
- Use test keys for development
- Switch to live keys only for production
- Keep your webhook secrets secure
