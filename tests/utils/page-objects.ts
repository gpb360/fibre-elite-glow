import { Page, Locator, expect } from '@playwright/test';
import { SELECTORS, TIMEOUTS, TEST_CUSTOMER, formatPrice } from './test-data';

/**
 * Base page class with common functionality
 */
export class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}

/**
 * Product page object model
 */
export class ProductPage extends BasePage {
  private addToCartButton: Locator;
  private quantityInput: Locator;
  private priceDisplay: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.locator(SELECTORS.ADD_TO_CART_BUTTON);
    this.quantityInput = page.locator(SELECTORS.QUANTITY_INPUT);
    this.priceDisplay = page.locator(SELECTORS.PRICE_DISPLAY);
  }

  async addToCart(quantity: number = 1) {
    if (quantity > 1) {
      await this.quantityInput.fill(quantity.toString());
    }
    await this.addToCartButton.click();
    
    // Wait for success notification or cart update
    await this.page.waitForTimeout(1000);
  }

  async getPrice(): Promise<string> {
    return await this.priceDisplay.textContent() || '';
  }

  async verifyProductDetails(expectedName: string, expectedPrice: number) {
    await expect(this.page.locator('h1')).toContainText(expectedName);
    await expect(this.priceDisplay).toContainText(formatPrice(expectedPrice));
  }
}

/**
 * Cart page object model
 */
export class CartPage extends BasePage {
  private cartItems: Locator;
  private checkoutButton: Locator;
  private cartTotal: Locator;
  private removeItemButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(SELECTORS.CART_ITEM);
    this.checkoutButton = page.locator(SELECTORS.CHECKOUT_BUTTON);
    this.cartTotal = page.locator(SELECTORS.CART_TOTAL);
    this.removeItemButtons = page.locator(SELECTORS.REMOVE_ITEM);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout', { timeout: TIMEOUTS.NAVIGATION });
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartTotal(): Promise<string> {
    return await this.cartTotal.textContent() || '';
  }

  async removeItem(index: number = 0) {
    await this.removeItemButtons.nth(index).click();
    await this.page.waitForTimeout(1000); // Wait for removal animation
  }

  async updateQuantity(itemIndex: number, quantity: number) {
    const quantityInput = this.page.locator(SELECTORS.UPDATE_QUANTITY).nth(itemIndex);
    await quantityInput.fill(quantity.toString());
    await quantityInput.press('Enter');
    await this.page.waitForTimeout(1000); // Wait for update
  }

  async verifyCartContents(expectedItems: Array<{ name: string; quantity: number; price: number }>) {
    const itemCount = await this.getCartItemCount();
    expect(itemCount).toBe(expectedItems.length);

    for (let i = 0; i < expectedItems.length; i++) {
      const item = expectedItems[i];
      const cartItem = this.cartItems.nth(i);
      
      await expect(cartItem).toContainText(item.name);
      await expect(cartItem).toContainText(item.quantity.toString());
      await expect(cartItem).toContainText(formatPrice(item.price));
    }
  }
}

/**
 * Checkout page object model
 */
export class CheckoutPage extends BasePage {
  private emailInput: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private addressLine1Input: Locator;
  private cityInput: Locator;
  private stateInput: Locator;
  private zipInput: Locator;
  private submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator(SELECTORS.EMAIL_INPUT);
    this.firstNameInput = page.locator(SELECTORS.FIRST_NAME_INPUT);
    this.lastNameInput = page.locator(SELECTORS.LAST_NAME_INPUT);
    this.addressLine1Input = page.locator(SELECTORS.ADDRESS_LINE1);
    this.cityInput = page.locator(SELECTORS.CITY_INPUT);
    this.stateInput = page.locator(SELECTORS.STATE_INPUT);
    this.zipInput = page.locator(SELECTORS.ZIP_INPUT);
    this.submitButton = page.locator(SELECTORS.STRIPE_SUBMIT);
  }

  async fillCustomerInfo(customer = TEST_CUSTOMER) {
    await this.emailInput.fill(customer.email);
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.addressLine1Input.fill(customer.address.line1);
    await this.cityInput.fill(customer.address.city);
    await this.stateInput.fill(customer.address.state);
    await this.zipInput.fill(customer.address.postal_code);
  }

  async fillPaymentInfo(cardNumber: string, expiry: string = '12/25', cvc: string = '123') {
    // Wait for Stripe elements to load
    await this.page.waitForSelector(SELECTORS.STRIPE_CARD_NUMBER, { timeout: TIMEOUTS.STRIPE_REDIRECT });
    
    // Fill card details in Stripe elements
    const cardNumberFrame = this.page.frameLocator('iframe[name*="__privateStripeFrame"]').first();
    await cardNumberFrame.locator('[name="cardnumber"]').fill(cardNumber);
    
    const expiryFrame = this.page.frameLocator('iframe[name*="__privateStripeFrame"]').nth(1);
    await expiryFrame.locator('[name="exp-date"]').fill(expiry);
    
    const cvcFrame = this.page.frameLocator('iframe[name*="__privateStripeFrame"]').nth(2);
    await cvcFrame.locator('[name="cvc"]').fill(cvc);
  }

  async submitPayment() {
    await this.submitButton.click();
    
    // Wait for payment processing
    await this.page.waitForTimeout(2000);
  }

  async completeCheckout(cardNumber: string, customer = TEST_CUSTOMER) {
    await this.fillCustomerInfo(customer);
    await this.fillPaymentInfo(cardNumber);
    await this.submitPayment();
  }
}

/**
 * Success page object model
 */
export class SuccessPage extends BasePage {
  private successMessage: Locator;
  private orderNumber: Locator;
  private orderTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.successMessage = page.locator(SELECTORS.SUCCESS_MESSAGE);
    this.orderNumber = page.locator(SELECTORS.ORDER_NUMBER);
    this.orderTotal = page.locator(SELECTORS.ORDER_TOTAL);
  }

  async verifySuccessPage() {
    await expect(this.successMessage).toBeVisible();
    await expect(this.page).toHaveURL(/.*\/checkout\/success/);
  }

  async getOrderNumber(): Promise<string> {
    return await this.orderNumber.textContent() || '';
  }

  async getOrderTotal(): Promise<string> {
    return await this.orderTotal.textContent() || '';
  }

  async verifyOrderDetails(expectedTotal: number) {
    await expect(this.orderTotal).toContainText(formatPrice(expectedTotal));
    
    const orderNum = await this.getOrderNumber();
    expect(orderNum).toMatch(/^[A-Z0-9-]+$/); // Basic order number format validation
  }
}

/**
 * Error page object model
 */
export class ErrorPage extends BasePage {
  private errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.errorMessage = page.locator(SELECTORS.ERROR_MESSAGE);
  }

  async verifyErrorMessage(expectedMessage?: string) {
    await expect(this.errorMessage).toBeVisible();
    
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}
