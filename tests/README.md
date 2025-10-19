# La Belle Vie - E2E Checkout Testing Suite

This comprehensive testing suite validates the complete Stripe checkout integration for the La Belle Vie e-commerce platform using Playwright.

## 🎯 Test Coverage

### Positive Test Scenarios
- ✅ Complete successful purchase flow (Total Essential)
- ✅ Complete successful purchase flow (Total Essential Plus)
- ✅ Multiple items purchase flow
- ✅ Guest checkout flow
- ✅ Cart persistence across sessions
- ✅ Cart quantity updates
- ✅ Remove items from cart

### Negative Test Scenarios
- ❌ Payment declined (Generic decline)
- ❌ Payment declined (Insufficient funds)
- ❌ Payment declined (Expired card)
- ❌ Payment declined (Incorrect CVC)
- ❌ Form validation (Missing required fields)
- ❌ Form validation (Invalid email format)
- ❌ Empty cart checkout prevention
- ❌ Network error handling
- ❌ Session timeout handling
- ❌ 3D Secure authentication flow
- ❌ Browser back button during checkout

### Full E2E Scenarios
- 🔄 Complete user journey (Browse → Cart → Checkout → Success)
- 📱 Mobile responsive checkout flow
- 🌐 Cross-browser compatibility
- ⚡ Performance and loading tests
- ♿ Accessibility compliance tests

## 🚀 Getting Started

### Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

3. **Set Up Environment**
   ```bash
   # Copy test environment file
   cp .env.test .env.local
   
   # Update with your Stripe test keys
   STRIPE_SECRET_KEY=sk_test_your_test_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
   ```

4. **Start the Application**
   ```bash
   # Terminal 1: Start the frontend
   npm run dev
   
   # Terminal 2: Start the API server (if using local API)
   npm run api
   ```

### Running Tests

#### Run All Tests
```bash
npm run test
```

#### Run Specific Test Suites
```bash
# Positive scenarios only
npx playwright test checkout-positive

# Negative scenarios only
npx playwright test checkout-negative

# Full E2E flow
npx playwright test full-checkout-flow
```

#### Run Tests with UI
```bash
npm run test:ui
```

#### Run Tests in Headed Mode
```bash
npm run test:headed
```

#### Debug Tests
```bash
npm run test:debug
```

#### Generate Test Report
```bash
npm run test:report
```

## 🧪 Test Data

### Stripe Test Cards

The tests use Stripe's official test card numbers:

| Card Type | Number | Expected Result |
|-----------|--------|-----------------|
| Visa Success | `4242424242424242` | ✅ Payment succeeds |
| Visa Debit | `4000056655665556` | ✅ Payment succeeds |
| Mastercard | `5555555555554444` | ✅ Payment succeeds |
| Amex | `378282246310005` | ✅ Payment succeeds |
| Generic Decline | `4000000000000002` | ❌ Payment declined |
| Insufficient Funds | `4000000000009995` | ❌ Insufficient funds |
| Expired Card | `4000000000000069` | ❌ Card expired |
| Incorrect CVC | `4000000000000127` | ❌ CVC check fails |
| 3D Secure | `4000002500003155` | 🔐 Requires authentication |

### Test Products

- **Total Essential**: $49.99
- **Total Essential Plus**: $79.99

### Test Customer Data

Default test customer information is provided in `tests/utils/test-data.ts`.

## 📁 Test Structure

```
tests/
├── e2e/                          # End-to-end test files
│   ├── checkout-positive.spec.ts # Successful checkout scenarios
│   ├── checkout-negative.spec.ts # Error and edge cases
│   └── full-checkout-flow.spec.ts # Complete user journeys
├── utils/                        # Test utilities and helpers
│   ├── page-objects.ts          # Page Object Model classes
│   ├── test-data.ts             # Test data and constants
│   └── test-helpers.ts          # Helper functions
└── fixtures/                     # Test fixtures and mock data
```

## 🎭 Page Object Model

The tests use the Page Object Model pattern for maintainable and reusable code:

- **ProductPage**: Product page interactions
- **CartPage**: Shopping cart management
- **CheckoutPage**: Checkout form and payment
- **SuccessPage**: Order confirmation
- **ErrorPage**: Error handling

## 🔧 Configuration

### Playwright Configuration

Key settings in `playwright.config.ts`:

- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Testing**: Pixel 5, iPhone 12
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### Environment Variables

Required environment variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:5173
NODE_ENV=test
```

## 📊 Test Reports

### HTML Report
```bash
npx playwright show-report
```

### JSON Report
Results are saved to `test-results/results.json`

### JUnit Report
Results are saved to `test-results/results.xml` for CI integration

## 🚨 Troubleshooting

### Common Issues

1. **Stripe Elements Not Loading**
   - Verify Stripe publishable key is set
   - Check network connectivity
   - Ensure iframe permissions

2. **Payment Processing Timeouts**
   - Increase timeout values in test configuration
   - Check Stripe webhook configuration
   - Verify API server is running

3. **Cart State Issues**
   - Clear browser storage between tests
   - Verify localStorage persistence
   - Check cart context implementation

4. **Mobile Test Failures**
   - Verify responsive design implementation
   - Check viewport meta tag
   - Test touch interactions

### Debug Mode

Run tests in debug mode to step through failures:

```bash
npx playwright test --debug checkout-positive
```

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots at point of failure
- Video recordings of the entire test
- Network logs and console errors

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test
        env:
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_SECRET_KEY }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_TEST_PUBLISHABLE_KEY }}
```

## 📈 Performance Monitoring

Tests include performance monitoring:

- Page load times
- Network request counts
- Payment processing duration
- Checkout flow completion time

## 🔒 Security Testing

Security validations include:

- HTTPS enforcement
- SSL certificate verification
- Secure payment form handling
- PCI compliance indicators

## 📞 Support

For issues with the test suite:

1. Check the troubleshooting section
2. Review test logs and screenshots
3. Verify environment configuration
4. Contact the development team

## 🎯 Best Practices

1. **Test Data**: Use unique email addresses for each test run
2. **Cleanup**: Clear cart and browser state between tests
3. **Timeouts**: Use appropriate timeouts for network operations
4. **Assertions**: Use specific, meaningful assertions
5. **Screenshots**: Capture screenshots for debugging failures
6. **Retries**: Configure retries for flaky network operations

## 📝 Contributing

When adding new tests:

1. Follow the existing Page Object Model pattern
2. Add appropriate test data to `test-data.ts`
3. Include both positive and negative scenarios
4. Update this README with new test coverage
5. Ensure tests are deterministic and reliable
