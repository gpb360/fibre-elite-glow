/**
 * Test data and constants for Stripe checkout testing
 */

// Stripe test card numbers with complete payment information
export const STRIPE_TEST_CARDS = {
  // Successful payments
  VISA_SUCCESS: {
    cardNumber: '4242424242424242',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Visa successful payment'
  },
  VISA_DEBIT_SUCCESS: {
    cardNumber: '4000056655665556',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Visa debit successful payment'
  },
  MASTERCARD_SUCCESS: {
    cardNumber: '5555555555554444',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Mastercard successful payment'
  },
  AMEX_SUCCESS: {
    cardNumber: '378282246310005',
    expiryDate: '12/25',
    cvc: '1234',
    description: 'American Express successful payment'
  },
  
  // Declined payments
  GENERIC_DECLINE: {
    cardNumber: '4000000000000002',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Generic card decline'
  },
  DECLINED_INSUFFICIENT_FUNDS: {
    cardNumber: '4000000000009995',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Declined due to insufficient funds'
  },
  INSUFFICIENT_FUNDS: {
    cardNumber: '4000000000009995',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Insufficient funds decline'
  },
  LOST_CARD: {
    cardNumber: '4000000000009987',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Lost card decline'
  },
  STOLEN_CARD: {
    cardNumber: '4000000000009979',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Stolen card decline'
  },
  EXPIRED_CARD: {
    cardNumber: '4000000000000069',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Expired card decline'
  },
  INCORRECT_CVC: {
    cardNumber: '4000000000000127',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Incorrect CVC decline'
  },
  PROCESSING_ERROR: {
    cardNumber: '4000000000000119',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Processing error decline'
  },
  
  // 3D Secure authentication required
  THREE_D_SECURE_REQUIRED: {
    cardNumber: '4000002500003155',
    expiryDate: '12/25',
    cvc: '123',
    description: '3D Secure authentication required'
  },
  THREE_D_SECURE_OPTIONAL: {
    cardNumber: '4000002760003184',
    expiryDate: '12/25',
    cvc: '123',
    description: '3D Secure authentication optional'
  },
  AUTHENTICATION_REQUIRED: {
    cardNumber: '4000002500003155',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Authentication required'
  },
  
  // Special scenarios
  INVALID_CARD: {
    cardNumber: '4000000000000000',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Invalid card number'
  },
  DECLINED: {
    cardNumber: '4000000000000002',
    expiryDate: '12/25',
    cvc: '123',
    description: 'Generic decline'
  }
} as const;

// Test customer data
export const TEST_CUSTOMER = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  address: {
    line1: '123 Test Street',
    line2: 'Apt 4B',
    city: 'Test City',
    state: 'CA',
    postal_code: '90210',
    country: 'US',
  },
} as const;

// Test product data
export const TEST_PRODUCTS = {
  TOTAL_ESSENTIAL: {
    name: 'Total Essential',
    price: 49.99,
    id: 'total-essential',
    url: '/products/total-essential',
  },
  TOTAL_ESSENTIAL_PLUS: {
    name: 'Total Essential Plus',
    price: 79.99,
    id: 'total-essential-plus',
    url: '/products/total-essential-plus',
  },
} as const;

// Test scenarios
export const TEST_SCENARIOS = {
  SUCCESSFUL_PURCHASE: {
    description: 'Complete successful purchase flow',
    card: STRIPE_TEST_CARDS.VISA_SUCCESS,
    expectedResult: 'success',
  },
  DECLINED_PAYMENT: {
    description: 'Payment declined by bank',
    card: STRIPE_TEST_CARDS.GENERIC_DECLINE,
    expectedResult: 'decline',
  },
  INSUFFICIENT_FUNDS: {
    description: 'Insufficient funds decline',
    card: STRIPE_TEST_CARDS.INSUFFICIENT_FUNDS,
    expectedResult: 'decline',
  },
  THREE_D_SECURE: {
    description: '3D Secure authentication required',
    card: STRIPE_TEST_CARDS.THREE_D_SECURE_REQUIRED,
    expectedResult: '3d_secure',
  },
} as const;

// Common test timeouts
export const TIMEOUTS = {
  NAVIGATION: 10000,
  PAYMENT_PROCESSING: 30000,
  STRIPE_REDIRECT: 15000,
  FORM_SUBMISSION: 5000,
  AUTHENTICATION: 20000,
  REDIRECT: 10000,
} as const;

// Selectors for common elements
export const SELECTORS = {
  // Navigation
  CART_ICON: '[data-testid="cart-icon"]',
  CART_COUNT: '[data-testid="cart-count"]',
  
  // Product pages
  ADD_TO_CART_BUTTON: '[data-testid="add-to-cart"]',
  QUANTITY_INPUT: '[data-testid="quantity-input"]',
  PRICE_DISPLAY: '[data-testid="price"]',
  
  // Cart page
  CART_ITEM: '[data-testid="cart-item"]',
  REMOVE_ITEM: '[data-testid="remove-item"]',
  UPDATE_QUANTITY: '[data-testid="update-quantity"]',
  CHECKOUT_BUTTON: '[data-testid="checkout-button"]',
  CART_TOTAL: '[data-testid="cart-total"]',
  
  // Checkout form
  EMAIL_INPUT: '[data-testid="email-input"]',
  FIRST_NAME_INPUT: '[data-testid="first-name-input"]',
  LAST_NAME_INPUT: '[data-testid="last-name-input"]',
  ADDRESS_LINE1: '[data-testid="address-line1"]',
  CITY_INPUT: '[data-testid="city-input"]',
  STATE_INPUT: '[data-testid="state-input"]',
  ZIP_INPUT: '[data-testid="zip-input"]',
  
  // Stripe elements
  STRIPE_CARD_NUMBER: '[data-testid="card-number"]',
  STRIPE_CARD_EXPIRY: '[data-testid="card-expiry"]',
  STRIPE_CARD_CVC: '[data-testid="card-cvc"]',
  STRIPE_SUBMIT: '[data-testid="stripe-submit"]',
  
  // Success/Error pages
  SUCCESS_MESSAGE: '[data-testid="success-message"]',
  ERROR_MESSAGE: '[data-testid="error-message"]',
  ORDER_NUMBER: '[data-testid="order-number"]',
  ORDER_TOTAL: '[data-testid="order-total"]',
} as const;

// Helper functions for test data generation
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `test+${timestamp}@example.com`;
}

export function generateOrderNumber(): string {
  return `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export function generateUniqueCustomer() {
  const timestamp = Date.now();
  return {
    ...TEST_CUSTOMER,
    email: generateRandomEmail(),
    firstName: `John${timestamp}`,
    lastName: `Doe${timestamp}`,
  };
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function calculateTax(subtotal: number, taxRate: number = 0.08): number {
  return subtotal * taxRate;
}

export function calculateTotal(subtotal: number, tax: number, shipping: number = 0): number {
  return subtotal + tax + shipping;
}

export function waitForNetworkIdle(page: any, timeout: number = 2000): Promise<void> {
  return new Promise((resolve) => {
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(resolve, timeout);
    };
    
    page.on('request', resetTimer);
    page.on('response', resetTimer);
    
    resetTimer();
  });
}
