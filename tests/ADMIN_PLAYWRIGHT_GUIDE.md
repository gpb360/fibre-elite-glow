# Playwright Test Configuration for Admin Section

This document describes the Playwright MCP tests for the admin section functionality.

## Test Coverage

### **Admin Order Management Tests** (`tests/admin-order-management.spec.ts`)

#### **Test Scenarios:**

1. **Customer can view order history after login**
   - Verifies successful login and redirect to account
   - Tests order history display with real data
   - Validates order details navigation
   - Checks empty state handling

2. **Customer can navigate between account tabs**
   - Tests Overview, Orders, Profile, Settings tabs
   - Verifies tab content visibility
   - Validates tab switching functionality

3. **Customer can view account overview with statistics**
   - Verifies overview cards display
   - Tests recent orders section
   - Validates profile summary section

4. **Unauthorized user cannot access account pages**
   - Tests redirect to login for protected routes
   - Verifies authentication guards

5. **Customer can sign out from account page**
   - Tests sign out functionality
   - Verifies redirect after sign out
   - Validates session cleanup

6. **Order details page displays correct information**
   - Tests order number and status display
   - Validates order status timeline
   - Checks order items listing
   - Verifies order summary breakdown
   - Tests action buttons (reorder, contact support)

7. **Error handling for failed order requests**
   - Mocks network failures
   - Tests error message display
   - Validates retry functionality

8. **Loading states are displayed during data fetching**
   - Mocks slow responses
   - Tests loading spinner display
   - Validates loading text

## Data Test IDs

### **Login Page**
- `email-input` - Email address field
- `password-input` - Password field  
- `login-button` - Sign in button

### **Account Page**
- `overview-tab` - Overview tab
- `orders-tab` - Orders tab
- `profile-tab` - Profile tab
- `settings-tab` - Settings tab
- `sign-out-button` - Sign out button
- `total-orders-card` - Total orders overview card
- `total-spent-card` - Total spent overview card
- `account-status-card` - Account status card
- `recent-orders-section` - Recent orders section
- `profile-summary-section` - Profile summary section

### **Order History**
- `order-history-container` - Main order history container
- `order-card` - Individual order card
- `order-number` - Order number display
- `order-status` - Order status badge
- `order-total` - Order total amount
- `order-date` - Order date
- `view-details-button` - View details button
- `no-orders-message` - Empty state message
- `start-shopping-button` - Start shopping button
- `loading-spinner` - Loading indicator
- `error-message` - Error message display
- `retry-button` - Retry button

### **Order Details Page**
- `order-number-header` - Order number in header
- `order-status-badge` - Order status badge
- `order-status-timeline` - Status timeline container
- `timeline-step` - Individual timeline step
- `order-items` - Order items container
- `order-item` - Individual order item
- `item-name` - Item product name
- `item-quantity` - Item quantity
- `item-price` - Item price
- `order-summary` - Order summary section
- `subtotal` - Subtotal amount
- `shipping` - Shipping amount
- `tax` - Tax amount
- `total` - Total amount
- `shipping-address` - Shipping address section
- `reorder-button` - Reorder button
- `contact-support-button` - Contact support button

## Running Tests

### **Run all admin tests:**
```bash
pnpm test tests/admin-order-management.spec.ts
```

### **Run with UI (headed mode):**
```bash
pnpm test:headed tests/admin-order-management.spec.ts
```

### **Run specific test:**
```bash
pnpm test --grep "Customer can view order history after login"
```

### **Run tests in debug mode:**
```bash
pnpm test --debug tests/admin-order-management.spec.ts
```

## Test Environment Setup

### **Required Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Test Database:**
- Tests run against your actual Supabase database
- Ensure test user exists: `test@example.com` with password `testpassword123`
- Or modify test credentials in the test file

### **Edge Functions:**
- Ensure Edge Functions are deployed:
  - `get-orders`
  - `get-order-details`
- RLS policies must be applied

## Mock Data and Network Conditions

The tests include mocking for:
- Network failures (500 errors)
- Slow responses (2 second delays)
- Empty order responses

## Best Practices

1. **Test Isolation:** Each test is independent and can run alone
2. **Realistic Data:** Tests use realistic user flows and data
3. **Error Scenarios:** Both happy path and error cases are covered
4. **Loading States:** Proper testing of loading and error states
5. **Accessibility:** Tests use semantic HTML and proper test IDs

## Troubleshooting

### **Common Issues:**

1. **Test fails on login:**
   - Check test user credentials
   - Verify Supabase connection
   - Ensure user exists in database

2. **No orders displayed:**
   - Check if test user has orders in database
   - Verify Edge Functions are deployed
   - Check RLS policies

3. **Time out errors:**
   - Increase timeout in test configuration
   - Check network connectivity
   - Verify Edge Function response times

4. **Element not found:**
   - Verify data-testid attributes exist
   - Check component rendering
   - Ensure proper waiting for elements

### **Debug Commands:**
```bash
# Run with browser inspector
pnpm test --debug tests/admin-order-management.spec.ts

# Run with trace files
pnpm test --trace on tests/admin-order-management.spec.ts

# Generate HTML report
pnpm test --reporter=html tests/admin-order-management.spec.ts
```