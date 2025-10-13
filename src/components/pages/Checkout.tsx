"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, CreditCard, Lock, Wifi, WifiOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/error';
import { FormRateLimiting } from '@/lib/form-validation';

// Simple API mutation hook for checkout
interface UseApiMutationOptions {
  maxRetries?: number;
  showErrorToast?: boolean;
  onRetry?: (attempt: number) => void;
}

interface UseApiMutationReturn {
  mutate: (url: string, data: any) => Promise<any>;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

function useApiMutation(options: UseApiMutationOptions = {}): UseApiMutationReturn {
  const { maxRetries = 3, onRetry } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastRequest, setLastRequest] = useState<{ url: string; data: any } | null>(null);

  const mutate = async (url: string, data: any) => {
    setLoading(true);
    setError(null);
    setLastRequest({ url, data });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setLoading(false);
        return result;
      } catch (err) {
        if (attempt === maxRetries) {
          setError(err as Error);
          setLoading(false);
          throw err;
        }
        onRetry?.(attempt);
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  };

  const retry = () => {
    if (lastRequest) {
      mutate(lastRequest.url, lastRequest.data);
    }
  };

  return { mutate, loading, error, retry };
}

/**
 * Initialise Stripe with the *publishable* key.
 * We do an explicit check so that in development a missing env var
 * fails fast instead of silently resulting in runtime errors.
 */
const stripePromise: Promise<Stripe | null> | null = (() => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    /* eslint-disable no-console */
    console.error(
      '❌  Environment variable "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" is missing. ' +
        'Stripe checkout will be disabled until this key is provided.'
    );
    console.error('For Netlify deployment, ensure this variable is set in Site Settings > Environment Variables');
    console.error('Expected format: pk_test_... (for test mode) or pk_live_... (for production)');
    /* eslint-enable no-console */
    return null;
  }

  // Validate key format
  if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
    /* eslint-disable no-console */
    console.error('❌  Invalid Stripe publishable key format. Expected pk_test_... or pk_live_...');
    /* eslint-enable no-console */
    return null;
  }

  return loadStripe(publishableKey);
})();

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutForm: React.FC = () => {
  const router = useRouter();
  const { cart } = useCart();
  const { toast } = useToast();
  const { isOnline } = useNetworkStatus();
  const isOffline = !isOnline;
  
  // Simple validation without complex hooks to prevent infinite loops
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  // Use the new API mutation hook with retry functionality
  const { mutate: createCheckoutSession, loading: isProcessing, error, retry } = useApiMutation({
    maxRetries: 3,
    showErrorToast: false, // We'll handle errors manually
    onRetry: (attempt) => {
      toast({
        title: "Retrying...",
        description: `Attempting to process payment (attempt ${attempt}/3)`,
      });
    }
  });
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'CA',
  });
  
  const [csrfToken, setCsrfToken] = useState<string>('');

  // Note: Form validation is called on submit and field changes to prevent infinite loops

  // Generate CSRF token on component mount
  useEffect(() => {
    const generateCSRFToken = () => {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };
    setCsrfToken(generateCSRFToken());
  }, []);
  
  // Simple validation function
  const validateForm = (data: CheckoutFormData) => {
    const errors: Record<string, string> = {};

    if (!data.email || !data.email.includes('@')) {
      errors.email = 'Valid email required';
    }
    if (!data.firstName || data.firstName.trim().length < 2) {
      errors.firstName = 'First name required';
    }
    if (!data.lastName || data.lastName.trim().length < 2) {
      errors.lastName = 'Last name required';
    }
    if (!data.address || data.address.trim().length < 5) {
      errors.address = 'Street address required';
    }
    if (!data.city || data.city.trim().length < 2) {
      errors.city = 'City required';
    }
    if (!data.state || data.state.trim().length < 2) {
      errors.state = 'State required';
    }
    if (!data.zipCode || !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(data.zipCode)) {
      errors.zipCode = 'Valid Canadian postal code required (A1A 1A1)';
    }

    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    setIsValid(isValid);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Rate limiting check
    const rateLimitCheck = FormRateLimiting.isSubmissionAllowed(formData.email || 'anonymous', 3, 15);
    if (!rateLimitCheck.allowed) {
      const resetTime = rateLimitCheck.resetTime;
      toast({
        title: "Rate Limit Exceeded",
        description: `Too many checkout attempts. Please try again ${resetTime ? `at ${resetTime.toLocaleTimeString()}` : 'in 15 minutes'}.`,
        variant: "destructive"
      });
      return;
    }

    // Extra guard in case Stripe is not initialised due to missing key
    if (!stripePromise) {
      toast({
        title: "Payment System Error",
        description: 'Payment system is not configured correctly. Please contact support.',
        variant: "destructive"
      });
      return;
    }

    if (cart.items.length === 0) {
      toast({
        title: "Empty Cart",
        description: 'Your cart is empty. Please add items before checking out.',
        variant: "destructive"
      });
      router.push('/cart');
      return;
    }

    // Simple form validation
    const isFormValid = validateForm(formData);
    if (!isFormValid) {
      toast({
        title: "Validation Error",
        description: 'Please correct the errors in the form before proceeding.',
        variant: "destructive"
      });
      return;
    }

    // Simple security validation
    const hasValidInputs = Object.values(formData).every(value => {
      if (typeof value === 'string') {
        return !/<script|javascript:|vbscript:|onload=|onerror=/i.test(value);
      }
      return true;
    });

    if (!hasValidInputs) {
      toast({
        title: "Security Error",
        description: 'Form contains potentially dangerous content. Please review your input.',
        variant: "destructive"
      });
      return;
    }

    // Check if offline
    if (isOffline) {
      toast({
        title: "Offline",
        description: 'No internet connection. Please check your connection and try again.',
        variant: "destructive"
      });
      return;
    }

    try {
      // Simple form sanitization
      const sanitizedData = {
        ...formData,
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
      };

  
      // Create checkout session
      const response = await createCheckoutSession(
        '/api/create-checkout-session',
        {
          items: cart.items,
          customerInfo: {
            email: sanitizedData.email,
            firstName: sanitizedData.firstName,
            lastName: sanitizedData.lastName,
            phone: sanitizedData.phone,
            address: sanitizedData.address,
            city: sanitizedData.city,
            state: sanitizedData.state,
            zipCode: sanitizedData.zipCode,
            country: sanitizedData.country,
          },
          csrfToken,
        }
      );

      // Record successful attempt
      FormRateLimiting.recordAttempt(formData.email, true);

      // Clear form data for security
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'CA',
      });
      setValidationErrors({});

      // Redirect to Stripe Checkout
      if (response.url) {
        router.push(response.url);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: unknown) {
      console.error('Checkout error:', error);

      // Record failed attempt
      FormRateLimiting.recordAttempt(formData.email, false);

      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

      toast({
        title: "Checkout Error",
        description: errorMessage || 'An unexpected error occurred during checkout. Please try again.',
        variant: "destructive"
      });
    }
  };

  // Redirect to cart if empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/cart');
    }
  }, [cart.items.length, router]);

  if (cart.items.length === 0) {
    return null; // Will redirect to cart
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="checkout-form">

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Customer Information
            <Shield className="h-4 w-4 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                required
                data-testid="email-input"
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600">{validationErrors.email}</p>
              )}
              <p className="text-sm text-gray-600">We&apos;ll send your order confirmation here</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="John"
                required
                data-testid="first-name-input"
                className={validationErrors.firstName ? 'border-red-500' : ''}
              />
              {validationErrors.firstName && (
                <p className="text-sm text-red-600">{validationErrors.firstName}</p>
              )}
              <p className="text-sm text-gray-600">Your legal first name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Doe"
                required
                data-testid="last-name-input"
                className={validationErrors.lastName ? 'border-red-500' : ''}
              />
              {validationErrors.lastName && (
                <p className="text-sm text-red-600">{validationErrors.lastName}</p>
              )}
              <p className="text-sm text-gray-600">Your legal last name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                data-testid="phone-input"
              />
              <p className="text-sm text-gray-600">For delivery updates and support</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Shipping Address
            <Shield className="h-4 w-4 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Main Street"
              required
              data-testid="address-line1"
              className={validationErrors.address ? 'border-red-500' : ''}
            />
            {validationErrors.address && (
              <p className="text-sm text-red-600">{validationErrors.address}</p>
            )}
            <p className="text-sm text-gray-600">Your full street address</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Los Angeles"
                required
                data-testid="city-input"
                className={validationErrors.city ? 'border-red-500' : ''}
              />
              {validationErrors.city && (
                <p className="text-sm text-red-600">{validationErrors.city}</p>
              )}
              <p className="text-sm text-gray-600">Your city</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Province *</Label>
              <Input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="ON"
                required
                data-testid="state-input"
                className={validationErrors.state ? 'border-red-500' : ''}
              />
              {validationErrors.state && (
                <p className="text-sm text-red-600">{validationErrors.state}</p>
              )}
              <p className="text-sm text-gray-600">Province abbreviation (ON, BC, AB, etc.)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Postal Code *</Label>
              <Input
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="K1A 0A1"
                required
                data-testid="zip-input"
                className={validationErrors.zipCode ? 'border-red-500' : ''}
              />
              {validationErrors.zipCode && (
                <p className="text-sm text-red-600">{validationErrors.zipCode}</p>
              )}
              <p className="text-sm text-gray-600">Canadian postal code (A1A 1A1)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.productName} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span data-testid="order-total">${cart.subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Status & Additional Error Handling */}
      {isOffline && (
        <Alert className="border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">You&apos;re currently offline</span>
                <p className="text-sm mt-1">Please check your internet connection to continue with checkout.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-orange-700 border-orange-300 hover:bg-orange-100"
              >
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Payment Error</span>
                <p className="text-sm mt-1">
                  {error.message || 'An error occurred during checkout'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isProcessing || isOffline}
        className="w-full"
        size="lg"
        data-testid="stripe-submit"
      >
        {isOffline ? (
          <>
            <WifiOff className="mr-2 h-4 w-4" />
            Offline
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Checkout
          </>
        )}
      </Button>

      {/* Security Information */}
      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-4 text-xs text-green-700">
          <div className="flex items-center space-x-1">
            <Lock className="h-3 w-3" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Secure Payment</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center">
          Your payment information is secure and encrypted. We never store your payment details.
        </p>
      </div>
      
      {/* CSRF Token (hidden) */}
      <input type="hidden" name="csrf_token" value={csrfToken} />
    </form>
  );
};

const Checkout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <ErrorBoundary
            onError={(error, errorInfo) => {
              console.error('Checkout Error:', error, errorInfo)
            }}
            resetKeys={[typeof window !== 'undefined' ? window.location.href : '']}
          >
            <Elements stripe={stripePromise}>
              <ErrorBoundary
                onError={(error, errorInfo) => {
                  console.error('Payment Form Error:', error, errorInfo)
                }}
              >
                <CheckoutForm />
              </ErrorBoundary>
            </Elements>
          </ErrorBoundary>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
