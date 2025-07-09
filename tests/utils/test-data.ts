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

// Test customer data variations
export const TEST_CUSTOMERS = {
  DEFAULT: {
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
  },
  INTERNATIONAL: {
    email: 'test.intl@example.com',
    firstName: 'Maria',
    lastName: 'Garcia',
    phone: '+1416555000',
    address: {
      line1: '456 Maple Ave',
      line2: 'Unit 12',
      city: 'Toronto',
      state: 'ON',
      postal_code: 'M5V 3A8',
      country: 'CA',
    },
  },
  MINIMAL: {
    email: 'minimal@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1555123456',
    address: {
      line1: '789 Oak Street',
      line2: '',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'US',
    },
  },
  LONG_ADDRESS: {
    email: 'longaddress@example.com',
    firstName: 'Robert',
    lastName: 'Anderson-Williams',
    phone: '+1800555121',
    address: {
      line1: '123456 Very Long Street Name With Multiple Words',
      line2: 'Apartment Complex Building B Unit 456',
      city: 'Los Angeles',
      state: 'CA',
      postal_code: '90210',
      country: 'US',
    },
  },
  BUSINESS: {
    email: 'business@company.com',
    firstName: 'Business',
    lastName: 'Account',
    phone: '+1800BUSINESS',
    address: {
      line1: '100 Business Plaza',
      line2: 'Suite 500',
      city: 'Chicago',
      state: 'IL',
      postal_code: '60601',
      country: 'US',
    },
  },
} as const;

// Backward compatibility
export const TEST_CUSTOMER = TEST_CUSTOMERS.DEFAULT;

// Test product data with packages and variations
export const TEST_PRODUCTS = {
  TOTAL_ESSENTIAL: {
    name: 'Total Essential',
    id: 'total-essential',
    url: '/products/total-essential',
    type: 'total_essential' as const,
    description: 'Complete fiber supplement for digestive health',
    packages: [
      {
        id: 'total-essential-single',
        name: 'Total Essential - Single Bottle',
        quantity: 1,
        price: 49.99,
        originalPrice: 59.99,
        savings: 10.00,
        isPopular: false,
        description: '1 month supply'
      },
      {
        id: 'total-essential-triple',
        name: 'Total Essential - 3 Pack',
        quantity: 3,
        price: 129.99,
        originalPrice: 179.97,
        savings: 49.98,
        isPopular: true,
        description: '3 month supply - Most Popular'
      },
      {
        id: 'total-essential-six',
        name: 'Total Essential - 6 Pack',
        quantity: 6,
        price: 239.99,
        originalPrice: 359.94,
        savings: 119.95,
        isPopular: false,
        description: '6 month supply - Best Value'
      }
    ]
  },
  TOTAL_ESSENTIAL_PLUS: {
    name: 'Total Essential Plus',
    id: 'total-essential-plus', 
    url: '/products/total-essential-plus',
    type: 'total_essential_plus' as const,
    description: 'Enhanced fiber supplement with additional benefits',
    packages: [
      {
        id: 'total-essential-plus-single',
        name: 'Total Essential Plus - Single Bottle',
        quantity: 1,
        price: 79.99,
        originalPrice: 89.99,
        savings: 10.00,
        isPopular: false,
        description: '1 month supply'
      },
      {
        id: 'total-essential-plus-triple',
        name: 'Total Essential Plus - 3 Pack',
        quantity: 3,
        price: 199.99,
        originalPrice: 269.97,
        savings: 69.98,
        isPopular: true,
        description: '3 month supply - Most Popular'
      },
      {
        id: 'total-essential-plus-six',
        name: 'Total Essential Plus - 6 Pack',
        quantity: 6,
        price: 359.99,
        originalPrice: 539.94,
        savings: 179.95,
        isPopular: false,
        description: '6 month supply - Best Value'
      }
    ]
  },
} as const;

// Helper to get default package for a product
export const getDefaultPackage = (productType: keyof typeof TEST_PRODUCTS) => {
  return TEST_PRODUCTS[productType].packages[0];
};

// Helper to get popular package for a product
export const getPopularPackage = (productType: keyof typeof TEST_PRODUCTS) => {
  return TEST_PRODUCTS[productType].packages.find(pkg => pkg.isPopular) || TEST_PRODUCTS[productType].packages[0];
};

// Test scenarios with comprehensive coverage
export const TEST_SCENARIOS = {
  // Successful payment scenarios
  SUCCESSFUL_PURCHASE: {
    description: 'Complete successful purchase flow',
    card: STRIPE_TEST_CARDS.VISA_SUCCESS,
    customer: TEST_CUSTOMERS.DEFAULT,
    expectedResult: 'success',
  },
  SUCCESSFUL_INTERNATIONAL: {
    description: 'Successful international purchase',
    card: STRIPE_TEST_CARDS.MASTERCARD_SUCCESS,
    customer: TEST_CUSTOMERS.INTERNATIONAL,
    expectedResult: 'success',
  },
  SUCCESSFUL_BUSINESS: {
    description: 'Successful business account purchase',
    card: STRIPE_TEST_CARDS.AMEX_SUCCESS,
    customer: TEST_CUSTOMERS.BUSINESS,
    expectedResult: 'success',
  },
  
  // Payment decline scenarios
  DECLINED_PAYMENT: {
    description: 'Payment declined by bank',
    card: STRIPE_TEST_CARDS.GENERIC_DECLINE,
    customer: TEST_CUSTOMERS.DEFAULT,
    expectedResult: 'decline',
  },
  INSUFFICIENT_FUNDS: {
    description: 'Insufficient funds decline',
    card: STRIPE_TEST_CARDS.INSUFFICIENT_FUNDS,
    customer: TEST_CUSTOMERS.MINIMAL,
    expectedResult: 'decline',
  },
  EXPIRED_CARD: {
    description: 'Expired card decline',
    card: STRIPE_TEST_CARDS.EXPIRED_CARD,
    customer: TEST_CUSTOMERS.DEFAULT,
    expectedResult: 'decline',
  },
  INCORRECT_CVC: {
    description: 'Incorrect CVC decline',
    card: STRIPE_TEST_CARDS.INCORRECT_CVC,
    customer: TEST_CUSTOMERS.DEFAULT,
    expectedResult: 'decline',
  },
  
  // Special authentication scenarios
  THREE_D_SECURE: {
    description: '3D Secure authentication required',
    card: STRIPE_TEST_CARDS.THREE_D_SECURE_REQUIRED,
    customer: TEST_CUSTOMERS.DEFAULT,
    expectedResult: '3d_secure',
  },
  
  // Edge case scenarios
  LONG_ADDRESS: {
    description: 'Purchase with very long address',
    card: STRIPE_TEST_CARDS.VISA_SUCCESS,
    customer: TEST_CUSTOMERS.LONG_ADDRESS,
    expectedResult: 'success',
  },
} as const;

// Cart combination scenarios for testing
export const CART_SCENARIOS = {
  SINGLE_ITEM: {
    description: 'Single item purchase',
    items: [
      { product: 'TOTAL_ESSENTIAL', packageIndex: 0, quantity: 1 }
    ],
    expectedTotal: 49.99
  },
  POPULAR_PACKAGE: {
    description: 'Popular package purchase',
    items: [
      { product: 'TOTAL_ESSENTIAL', packageIndex: 1, quantity: 1 }
    ],
    expectedTotal: 129.99
  },
  MIXED_PRODUCTS: {
    description: 'Multiple different products',
    items: [
      { product: 'TOTAL_ESSENTIAL', packageIndex: 0, quantity: 1 },
      { product: 'TOTAL_ESSENTIAL_PLUS', packageIndex: 0, quantity: 1 }
    ],
    expectedTotal: 129.98
  },
  BULK_ORDER: {
    description: 'Large quantity order',
    items: [
      { product: 'TOTAL_ESSENTIAL', packageIndex: 2, quantity: 2 },
      { product: 'TOTAL_ESSENTIAL_PLUS', packageIndex: 1, quantity: 1 }
    ],
    expectedTotal: 679.97
  },
  VALUE_OPTIMIZATION: {
    description: 'Mixed packages for best value',
    items: [
      { product: 'TOTAL_ESSENTIAL', packageIndex: 2, quantity: 1 },
      { product: 'TOTAL_ESSENTIAL_PLUS', packageIndex: 2, quantity: 1 }
    ],
    expectedTotal: 599.98
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

// Cart item builder for tests
export function buildCartItems(scenario: keyof typeof CART_SCENARIOS) {
  const cartScenario = CART_SCENARIOS[scenario];
  
  return cartScenario.items.map(item => {
    const product = TEST_PRODUCTS[item.product as keyof typeof TEST_PRODUCTS];
    const packageData = product.packages[item.packageIndex];
    
    return {
      id: packageData.id,
      productName: packageData.name,
      productType: product.type,
      quantity: item.quantity,
      price: packageData.price,
      originalPrice: packageData.originalPrice,
      savings: packageData.savings,
      image: `/images/products/${product.id}.jpg`,
      packageSize: packageData.description,
      description: product.description
    };
  });
}

// Order validation helper
export function calculateExpectedTotal(scenario: keyof typeof CART_SCENARIOS): number {
  return CART_SCENARIOS[scenario].expectedTotal;
}

// Customer data generator with variations
export function generateTestCustomer(variant: keyof typeof TEST_CUSTOMERS = 'DEFAULT') {
  const baseCustomer = TEST_CUSTOMERS[variant];
  const timestamp = Date.now();
  
  return {
    ...baseCustomer,
    email: `test+${timestamp}@example.com`,
    firstName: `${baseCustomer.firstName}${timestamp}`,
    lastName: `${baseCustomer.lastName}Test`,
  };
}

// Create a random test scenario
export function getRandomTestScenario(): {
  scenario: keyof typeof TEST_SCENARIOS;
  cart: keyof typeof CART_SCENARIOS;
  customer: keyof typeof TEST_CUSTOMERS;
} {
  const scenarios = Object.keys(TEST_SCENARIOS) as Array<keyof typeof TEST_SCENARIOS>;
  const carts = Object.keys(CART_SCENARIOS) as Array<keyof typeof CART_SCENARIOS>;
  const customers = Object.keys(TEST_CUSTOMERS) as Array<keyof typeof TEST_CUSTOMERS>;
  
  return {
    scenario: scenarios[Math.floor(Math.random() * scenarios.length)],
    cart: carts[Math.floor(Math.random() * carts.length)],
    customer: customers[Math.floor(Math.random() * customers.length)]
  };
}

// Validate test data integrity
export function validateTestData(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check that all products have at least one package
  Object.entries(TEST_PRODUCTS).forEach(([key, product]) => {
    if (product.packages.length === 0) {
      errors.push(`Product ${key} has no packages`);
    }
    
    // Check that each product has exactly one popular package
    const popularPackages = product.packages.filter(pkg => pkg.isPopular);
    if (popularPackages.length !== 1) {
      errors.push(`Product ${key} should have exactly one popular package, found ${popularPackages.length}`);
    }
  });
  
  // Check that all cart scenarios have valid product references
  Object.entries(CART_SCENARIOS).forEach(([key, scenario]) => {
    scenario.items.forEach((item, index) => {
      const productKey = item.product as keyof typeof TEST_PRODUCTS;
      if (!TEST_PRODUCTS[productKey]) {
        errors.push(`Cart scenario ${key} item ${index} references invalid product ${item.product}`);
      } else {
        const product = TEST_PRODUCTS[productKey];
        if (item.packageIndex >= product.packages.length) {
          errors.push(`Cart scenario ${key} item ${index} references invalid package index ${item.packageIndex}`);
        }
      }
    });
  });
  
  // Check that all customers have required fields
  Object.entries(TEST_CUSTOMERS).forEach(([key, customer]) => {
    if (!customer.email || !customer.firstName || !customer.lastName) {
      errors.push(`Customer ${key} is missing required fields`);
    }
    if (!customer.address.line1 || !customer.address.city || !customer.address.state || !customer.address.postal_code) {
      errors.push(`Customer ${key} is missing required address fields`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generate test report data
export function generateTestReport() {
  const validation = validateTestData();
  
  return {
    validation,
    summary: {
      stripeTestCards: Object.keys(STRIPE_TEST_CARDS).length,
      customers: Object.keys(TEST_CUSTOMERS).length,
      products: Object.keys(TEST_PRODUCTS).length,
      packages: Object.values(TEST_PRODUCTS).reduce((total, product) => total + product.packages.length, 0),
      scenarios: Object.keys(TEST_SCENARIOS).length,
      cartScenarios: Object.keys(CART_SCENARIOS).length,
      selectors: Object.keys(SELECTORS).length,
    },
    coverage: {
      successfulPayments: Object.values(TEST_SCENARIOS).filter(s => s.expectedResult === 'success').length,
      declinedPayments: Object.values(TEST_SCENARIOS).filter(s => s.expectedResult === 'decline').length,
      specialAuth: Object.values(TEST_SCENARIOS).filter(s => s.expectedResult === '3d_secure').length,
    }
  };
}
