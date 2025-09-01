/**
 * Page Validator - Critical Page Loading Validation
 * 
 * This module provides comprehensive validation for essential page elements
 * to ensure error-free page loading and proper rendering across all routes.
 */

import React from 'react';

export interface PageValidationRule {
  selector: string;
  required: boolean;
  timeout?: number;
  description: string;
  fallbackAction?: () => void;
}

export interface PageValidationResult {
  isValid: boolean;
  missingElements: string[];
  errors: ValidationError[];
  loadTime: number;
  timestamp: number;
}

export interface ValidationError {
  element: string;
  error: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Critical page validation rules for different page types
export const PAGE_VALIDATION_RULES: Record<string, PageValidationRule[]> = {
  homepage: [
    {
      selector: '[data-testid="hero-section"]',
      required: true,
      timeout: 3000,
      description: 'Hero section with main call-to-action',
    },
    {
      selector: '[data-testid="navigation-menu"]',
      required: true,
      timeout: 2000,
      description: 'Main navigation menu',
    },
    {
      selector: '[data-testid="product-showcase"]',
      required: true,
      timeout: 5000,
      description: 'Product showcase section',
    },
    {
      selector: '[data-testid="footer"]',
      required: true,
      timeout: 2000,
      description: 'Page footer with links',
    },
  ],
  
  product: [
    {
      selector: '[data-testid="product-title"]',
      required: true,
      timeout: 3000,
      description: 'Product title and name',
    },
    {
      selector: '[data-testid="product-price"]',
      required: true,
      timeout: 3000,
      description: 'Product pricing information',
    },
    {
      selector: '[data-testid="add-to-cart-button"]',
      required: true,
      timeout: 3000,
      description: 'Add to cart functionality',
    },
    {
      selector: '[data-testid="product-images"]',
      required: true,
      timeout: 5000,
      description: 'Product images gallery',
    },
    {
      selector: '[data-testid="product-description"]',
      required: true,
      timeout: 3000,
      description: 'Product description and details',
    },
  ],
  
  cart: [
    {
      selector: '[data-testid="cart-items"]',
      required: true,
      timeout: 3000,
      description: 'Cart items display',
    },
    {
      selector: '[data-testid="cart-total"]',
      required: true,
      timeout: 2000,
      description: 'Cart total calculation',
    },
    {
      selector: '[data-testid="checkout-button"]',
      required: true,
      timeout: 2000,
      description: 'Proceed to checkout button',
    },
  ],
  
  checkout: [
    {
      selector: '[data-testid="customer-info-form"]',
      required: true,
      timeout: 3000,
      description: 'Customer information form',
    },
    {
      selector: '[data-testid="payment-section"]',
      required: true,
      timeout: 5000,
      description: 'Payment processing section',
    },
    {
      selector: '[data-testid="order-summary"]',
      required: true,
      timeout: 3000,
      description: 'Order summary display',
    },
  ],
  
  login: [
    {
      selector: '[data-testid="login-form"]',
      required: true,
      timeout: 2000,
      description: 'Login form with email and password',
    },
    {
      selector: '[data-testid="submit-button"]',
      required: true,
      timeout: 2000,
      description: 'Login submit button',
    },
    {
      selector: '[data-testid="forgot-password-link"]',
      required: false,
      timeout: 2000,
      description: 'Forgot password link',
    },
  ],
  
  signup: [
    {
      selector: '[data-testid="signup-form"]',
      required: true,
      timeout: 2000,
      description: 'Signup form with required fields',
    },
    {
      selector: '[data-testid="submit-button"]',
      required: true,
      timeout: 2000,
      description: 'Signup submit button',
    },
    {
      selector: '[data-testid="terms-checkbox"]',
      required: true,
      timeout: 2000,
      description: 'Terms and conditions acceptance',
    },
  ],
  
  ingredient: [
    {
      selector: '[data-testid="ingredient-title"]',
      required: true,
      timeout: 3000,
      description: 'Ingredient name and title',
    },
    {
      selector: '[data-testid="ingredient-benefits"]',
      required: true,
      timeout: 3000,
      description: 'Health benefits information',
    },
    {
      selector: '[data-testid="ingredient-image"]',
      required: true,
      timeout: 5000,
      description: 'Ingredient visual representation',
    },
  ],
};

// Core Web Vitals thresholds
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint (ms)
  TTI: 3800, // Time to Interactive (ms)
};

export class PageValidator {
  private static instance: PageValidator;
  private validationCache = new Map<string, PageValidationResult>();
  private observers = new Map<string, PerformanceObserver>();

  static getInstance(): PageValidator {
    if (!PageValidator.instance) {
      PageValidator.instance = new PageValidator();
    }
    return PageValidator.instance;
  }

  /**
   * Validate a page according to its type and rules
   */
  async validatePage(
    pageType: string,
    customRules?: PageValidationRule[]
  ): Promise<PageValidationResult> {
    const startTime = performance.now();
    const cacheKey = `${pageType}-${Date.now()}`;
    
    try {
      const rules = customRules || PAGE_VALIDATION_RULES[pageType] || [];
      const missingElements: string[] = [];
      const errors: ValidationError[] = [];

      // Validate DOM readiness
      await this.waitForDOMReady();

      // Validate each required element
      for (const rule of rules) {
        try {
          const element = await this.waitForElement(rule.selector, rule.timeout || 5000);
          
          if (!element && rule.required) {
            missingElements.push(rule.selector);
            errors.push({
              element: rule.selector,
              error: `Required element not found: ${rule.description}`,
              severity: 'critical',
            });
          }

          // Additional validation for specific elements
          if (element) {
            await this.validateElementContent(element, rule, errors);
          }
        } catch (error) {
          if (rule.required) {
            missingElements.push(rule.selector);
            errors.push({
              element: rule.selector,
              error: `Element validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
              severity: 'high',
            });
          }
        }
      }

      // Validate Core Web Vitals
      await this.validateCoreWebVitals(errors);

      // Validate accessibility
      await this.validateAccessibility(errors);

      const loadTime = performance.now() - startTime;
      const result: PageValidationResult = {
        isValid: missingElements.length === 0 && errors.filter(e => e.severity === 'critical' || e.severity === 'high').length === 0,
        missingElements,
        errors,
        loadTime,
        timestamp: Date.now(),
      };

      // Cache result
      this.validationCache.set(cacheKey, result);

      // Log validation result
      this.logValidationResult(pageType, result);

      return result;
    } catch (error) {
      const loadTime = performance.now() - startTime;
      const result: PageValidationResult = {
        isValid: false,
        missingElements: [],
        errors: [{
          element: 'page',
          error: `Page validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'critical',
        }],
        loadTime,
        timestamp: Date.now(),
      };

      this.validationCache.set(cacheKey, result);
      return result;
    }
  }

  /**
   * Wait for DOM to be ready
   */
  private async waitForDOMReady(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
      }
    });
  }

  /**
   * Wait for a specific element to appear in the DOM
   */
  private async waitForElement(
    selector: string,
    timeout: number = 5000
  ): Promise<Element | null> {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        if (Date.now() - startTime >= timeout) {
          resolve(null);
          return;
        }

        requestAnimationFrame(checkElement);
      };

      checkElement();
    });
  }

  /**
   * Validate element content and functionality
   */
  private async validateElementContent(
    element: Element,
    rule: PageValidationRule,
    errors: ValidationError[]
  ): Promise<void> {
    try {
      // Check if element is visible
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        errors.push({
          element: rule.selector,
          error: `Element is not visible: ${rule.description}`,
          severity: 'medium',
        });
        return;
      }

      // Check for specific element types
      if (element.tagName === 'IMG') {
        await this.validateImage(element as HTMLImageElement, rule, errors);
      } else if (element.tagName === 'FORM') {
        this.validateForm(element as HTMLFormElement, rule, errors);
      } else if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
        this.validateButton(element, rule, errors);
      }

      // Check for required text content
      if (rule.selector.includes('title') || rule.selector.includes('description')) {
        const textContent = element.textContent?.trim();
        if (!textContent || textContent.length < 3) {
          errors.push({
            element: rule.selector,
            error: `Element has insufficient text content: ${rule.description}`,
            severity: 'medium',
          });
        }
      }
    } catch (error) {
      errors.push({
        element: rule.selector,
        error: `Content validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'low',
      });
    }
  }

  /**
   * Validate image elements
   */
  private async validateImage(
    img: HTMLImageElement,
    rule: PageValidationRule,
    errors: ValidationError[]
  ): Promise<void> {
    return new Promise((resolve) => {
      if (img.complete && img.naturalWidth > 0) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        errors.push({
          element: rule.selector,
          error: `Image failed to load: ${rule.description}`,
          severity: 'medium',
        });
        resolve();
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        if (img.naturalWidth === 0) {
          errors.push({
            element: rule.selector,
            error: `Image has zero dimensions: ${rule.description}`,
            severity: 'medium',
          });
        }
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeout);
        errors.push({
          element: rule.selector,
          error: `Image failed to load: ${rule.description}`,
          severity: 'high',
        });
        resolve();
      };
    });
  }

  /**
   * Validate form elements
   */
  private validateForm(
    form: HTMLFormElement,
    rule: PageValidationRule,
    errors: ValidationError[]
  ): void {
    const requiredFields = form.querySelectorAll('[required]');
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');

    if (!submitButton) {
      errors.push({
        element: rule.selector,
        error: `Form missing submit button: ${rule.description}`,
        severity: 'high',
      });
    }

    if (requiredFields.length === 0) {
      errors.push({
        element: rule.selector,
        error: `Form has no required fields: ${rule.description}`,
        severity: 'medium',
      });
    }
  }

  /**
   * Validate button elements
   */
  private validateButton(
    button: Element,
    rule: PageValidationRule,
    errors: ValidationError[]
  ): void {
    const isDisabled = button.hasAttribute('disabled') || 
                      button.getAttribute('aria-disabled') === 'true';
    
    if (isDisabled && rule.required) {
      errors.push({
        element: rule.selector,
        error: `Required button is disabled: ${rule.description}`,
        severity: 'high',
      });
    }

    const hasAccessibleName = button.textContent?.trim() || 
                             button.getAttribute('aria-label') || 
                             button.getAttribute('title');
    
    if (!hasAccessibleName) {
      errors.push({
        element: rule.selector,
        error: `Button lacks accessible name: ${rule.description}`,
        severity: 'medium',
      });
    }
  }

  /**
   * Validate Core Web Vitals
   */
  private async validateCoreWebVitals(errors: ValidationError[]): Promise<void> {
    try {
      // LCP validation
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1] as any;
        if (lcp.startTime > PERFORMANCE_THRESHOLDS.LCP) {
          errors.push({
            element: 'performance',
            error: `Largest Contentful Paint too slow: ${Math.round(lcp.startTime)}ms > ${PERFORMANCE_THRESHOLDS.LCP}ms`,
            severity: 'medium',
          });
        }
      }

      // CLS validation using PerformanceObserver
      if ('PerformanceObserver' in window) {
        this.measureCLS(errors);
      }

    } catch (error) {
      console.warn('Core Web Vitals validation failed:', error);
    }
  }

  /**
   * Measure Cumulative Layout Shift
   */
  private measureCLS(errors: ValidationError[]): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }

        if (clsValue > PERFORMANCE_THRESHOLDS.CLS) {
          errors.push({
            element: 'performance',
            error: `Cumulative Layout Shift too high: ${clsValue.toFixed(3)} > ${PERFORMANCE_THRESHOLDS.CLS}`,
            severity: 'medium',
          });
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Clean up observer after 10 seconds
      setTimeout(() => observer.disconnect(), 10000);
    } catch (error) {
      console.warn('CLS measurement failed:', error);
    }
  }

  /**
   * Basic accessibility validation
   */
  private async validateAccessibility(errors: ValidationError[]): Promise<void> {
    try {
      // Check for alt text on images
      const images = document.querySelectorAll('img');
      let missingAltCount = 0;
      
      images.forEach((img) => {
        if (!img.hasAttribute('alt')) {
          missingAltCount++;
        }
      });

      if (missingAltCount > 0) {
        errors.push({
          element: 'accessibility',
          error: `${missingAltCount} images missing alt text`,
          severity: 'medium',
        });
      }

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) {
        errors.push({
          element: 'accessibility',
          error: 'No heading elements found',
          severity: 'medium',
        });
      }

      // Check for skip links
      const skipLink = document.querySelector('a[href="#main"], a[href="#content"]');
      if (!skipLink) {
        errors.push({
          element: 'accessibility',
          error: 'No skip link found for keyboard navigation',
          severity: 'low',
        });
      }

    } catch (error) {
      console.warn('Accessibility validation failed:', error);
    }
  }

  /**
   * Log validation results
   */
  private logValidationResult(pageType: string, result: PageValidationResult): void {
    const level = result.isValid ? 'info' : 'warn';
    console[level](`Page Validation [${pageType}]:`, {
      isValid: result.isValid,
      loadTime: `${Math.round(result.loadTime)}ms`,
      errors: result.errors.length,
      criticalErrors: result.errors.filter(e => e.severity === 'critical').length,
      missingElements: result.missingElements.length,
    });

    if (!result.isValid) {
      console.warn('Validation errors:', result.errors);
      console.warn('Missing elements:', result.missingElements);
    }
  }

  /**
   * Get cached validation result
   */
  getCachedResult(pageType: string): PageValidationResult | null {
    const results = Array.from(this.validationCache.entries())
      .filter(([key]) => key.startsWith(pageType))
      .sort(([, a], [, b]) => b.timestamp - a.timestamp);
    
    return results.length > 0 ? results[0][1] : null;
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.validationCache.clear();
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Utility function for easy page validation
export async function validateCurrentPage(pageType: string): Promise<PageValidationResult> {
  const validator = PageValidator.getInstance();
  return validator.validatePage(pageType);
}

// React hook for page validation
export function usePageValidation(pageType: string) {
  const [result, setResult] = React.useState<PageValidationResult | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);

  const validate = React.useCallback(async () => {
    setIsValidating(true);
    try {
      const validationResult = await validateCurrentPage(pageType);
      setResult(validationResult);
    } catch (error) {
      console.error('Page validation error:', error);
      setResult({
        isValid: false,
        missingElements: [],
        errors: [{
          element: 'validation',
          error: error instanceof Error ? error.message : 'Validation failed',
          severity: 'critical',
        }],
        loadTime: 0,
        timestamp: Date.now(),
      });
    } finally {
      setIsValidating(false);
    }
  }, [pageType]);

  React.useEffect(() => {
    validate();
  }, [validate]);

  return {
    result,
    isValidating,
    validate,
  };
}