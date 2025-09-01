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
import { 
  ValidatedInput, 
  FormSecurityStatus, 
  FormSecurityIndicator, 
  FormValidationSummary, 
  FormErrorRecovery
} from '@/components/ui/FormValidation';
import { useFormSecurityStatus } from '@/components/forms/FormSecurityStatus';
import { useFormErrorRecovery } from '@/components/forms/FormErrorRecovery';

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
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const { isOnline } = useNetworkStatus();
  const isOffline = !isOnline;
  
  // Enhanced form validation and error recovery
  const {
    errors: validationErrors,
    isValid,
    isValidating,
    validate,
    clearErrors,
    resetValidation
  } = useFormValidation(enhancedCheckoutSchema, {
    validateOnChange: true,
    showErrorToast: false
  });
  
  const {
    errors: formErrors,
    isRetrying,
    addError,
    clearErrors: clearFormErrors,
    retry: retryFormSubmission
  } = useFormErrorRecovery();
  
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
    country: 'US',
  });
  
  const [validFields, setValidFields] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [csrfToken, setCsrfToken] = useState<string>('');
  
  // Form security status
  const securityStatus = useFormSecurityStatus(formData, {
    enablePasswordStrength: false,
    enableXSSProtection: true,
    enableRateLimit: true
  });

  // Generate CSRF token on component mount
  useEffect(() => {
    const generateCSRFToken = () => {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };
    setCsrfToken(generateCSRFToken());
  }, []);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    clearErrors();
    clearFormErrors();
  };
  
  const handleValidationChange = (field: string) => (isValid: boolean, error?: string) => {
    setValidFields(prev => {
      const change = isValid ? 1 : -1;
      const newCount = Math.max(0, prev + change);
      return Math.min(8, newCount); // Maximum 8 fields
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAttemptCount(prev => prev + 1);
    
    // Rate limiting check
    const rateLimitCheck = FormRateLimiting.isSubmissionAllowed(formData.email || 'anonymous', 3, 15);
    if (!rateLimitCheck.allowed) {
      const resetTime = rateLimitCheck.resetTime;
      addError({
        type: 'rate-limit',
        message: `Too many checkout attempts. Please try again ${resetTime ? `at ${resetTime.toLocaleTimeString()}` : 'in 15 minutes'}.`,
        retryable: false
      });
      return;
    }

    // Extra guard in case Stripe is not initialised due to missing key
    if (!stripePromise) {
      addError({
        type: 'server',
        message: 'Payment system is not configured correctly. Please contact support.',
        retryable: false
      });
      return;
    }

    if (cart.items.length === 0) {
      addError({
        type: 'validation',
        message: 'Your cart is empty. Please add items before checking out.',
        retryable: false
      });
      router.push('/cart');
      return;
    }

    // Enhanced form validation
    const validation = await validate(formData);
    if (!validation.isValid) {
      addError({
        type: 'validation',
        message: 'Please correct the errors in the form before proceeding.',
        retryable: false
      });
      return;
    }
    
    // Security validation
    const securityScore = FormValidationUtils.getFormSecurityScore(formData);
    if (!securityScore.isSecure) {
      addError({
        type: 'validation',
        message: 'Form contains potentially dangerous content. Please review your input.',
        retryable: false
      });
      return;
    }

    // Check if offline
    if (isOffline) {
      addError({
        type: 'network',
        message: 'No internet connection. Please check your connection and try again.',
        retryable: true
      });
      return;
    }

    try {
      // Sanitize form data
      const sanitizedData = FormValidationUtils.sanitizeFormData(formData);
      
      // Create checkout session with enhanced security
      const response = await createCheckoutSession(
        '/api/create-checkout-session',
        {
          items: cart.items,
          customerInfo: {
            email: sanitizedData.email,
            firstName: sanitizedData.firstName,
            lastName: sanitizedData.lastName,
            phone: sanitizedData.phone,
            address: {
              line1: sanitizedData.address,
              line2: '',
              city: sanitizedData.city,
              state: sanitizedData.state,
              postal_code: sanitizedData.zipCode,
              country: sanitizedData.country,
            },
          },
          csrfToken,
          securityContext: {
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            formHash: btoa(JSON.stringify(sanitizedData))
          }
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
        country: 'US',
      });
      resetValidation();
      clearFormErrors();

      // Redirect to Stripe Checkout
      if (response.url) {
        router.push(response.url);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      
      // Record failed attempt
      FormRateLimiting.recordAttempt(formData.email, false);
      
      // Categorize error type
      let errorType: FormError['type'] = 'unknown';
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorType = 'network';
      } else if (error.message?.includes('authentication') || error.message?.includes('unauthorized')) {
        errorType = 'authentication';
      } else if (error.message?.includes('rate') || error.message?.includes('limit')) {
        errorType = 'rate-limit';
      } else if (error.status >= 500) {
        errorType = 'server';
      }
      
      addError({
        type: errorType,
        message: error.message || 'An unexpected error occurred during checkout. Please try again.',
        retryable: errorType !== 'rate-limit'
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
      {/* Security Status */}
      <FormSecurityStatus 
        checks={securityStatus.checks}
        overallStatus={securityStatus.overallStatus}
        showDetails={false}
      />
      
      {/* Form validation indicators */}
      <FormSecurityIndicator 
        isSecure={isValid && validFields >= 6}
        validFields={validFields}
        totalFields={8}
      />
      
      {/* Form validation summary */}
      <FormValidationSummary 
        errors={validationErrors}
        onFieldFocus={(fieldName) => {
          const element = document.getElementById(fieldName)
          element?.focus()
        }}
      />
      
      {/* Form Error Recovery */}
      <FormErrorRecovery
        errors={formErrors}
        onRetry={retryFormSubmission}
        onClearErrors={clearFormErrors}
        onFieldFocus={(fieldName) => {
          const element = document.getElementById(fieldName)
          element?.focus()
        }}
        isRetrying={isRetrying}
      />

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Customer Information
            <Shield className="h-4 w-4 text-green-600" title="Secure form" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              schema={enhancedCheckoutSchema}
              fieldName="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onValidationChange={handleValidationChange('email')}
              showSecurityIndicator={true}
              helperText="We'll send your order confirmation here"
              required
              placeholder="your@email.com"
              data-testid="email-input"
            />
            
            <ValidatedInput
              id="firstName"
              name="firstName"
              type="text"
              label="First Name"
              schema={enhancedCheckoutSchema}
              fieldName="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onValidationChange={handleValidationChange('firstName')}
              showSecurityIndicator={true}
              helperText="Your legal first name"
              required
              placeholder="John"
              data-testid="first-name-input"
            />
            
            <ValidatedInput
              id="lastName"
              name="lastName"
              type="text"
              label="Last Name"
              schema={enhancedCheckoutSchema}
              fieldName="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onValidationChange={handleValidationChange('lastName')}
              showSecurityIndicator={true}
              helperText="Your legal last name"
              required
              placeholder="Doe"
              data-testid="last-name-input"
            />
            
            <ValidatedInput
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number (Optional)"
              schema={enhancedCheckoutSchema}
              fieldName="phone"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onValidationChange={handleValidationChange('phone')}
              showSecurityIndicator={false}
              helperText="For delivery updates and support"
              placeholder="(555) 123-4567"
              data-testid="phone-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Shipping Address
            <Shield className="h-4 w-4 text-green-600" title="Secure form" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ValidatedInput
            id="address"
            name="address"
            type="text"
            label="Street Address"
            schema={enhancedCheckoutSchema}
            fieldName="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            onValidationChange={handleValidationChange('address')}
            showSecurityIndicator={true}
            helperText="Your full street address"
            required
            placeholder="123 Main Street"
            data-testid="address-line1"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ValidatedInput
              id="city"
              name="city"
              type="text"
              label="City"
              schema={enhancedCheckoutSchema}
              fieldName="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onValidationChange={handleValidationChange('city')}
              showSecurityIndicator={true}
              helperText="Your city"
              required
              placeholder="Los Angeles"
              data-testid="city-input"
            />
            
            <ValidatedInput
              id="state"
              name="state"
              type="text"
              label="State"
              schema={enhancedCheckoutSchema}
              fieldName="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              onValidationChange={handleValidationChange('state')}
              showSecurityIndicator={true}
              helperText="State or province"
              required
              placeholder="CA"
              data-testid="state-input"
            />
            
            <ValidatedInput
              id="zipCode"
              name="zipCode"
              type="text"
              label="ZIP Code"
              schema={enhancedCheckoutSchema}
              fieldName="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              onValidationChange={handleValidationChange('zipCode')}
              showSecurityIndicator={true}
              helperText="5-digit ZIP code"
              required
              placeholder="90210"
              data-testid="zip-input"
            />
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
                <span className="font-medium">You're currently offline</span>
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
        disabled={isProcessing || isOffline || !isValid || isValidating || formErrors.length > 0}
        className="w-full"
        size="lg"
        data-testid="stripe-submit"
      >
        {isOffline ? (
          <>
            <WifiOff className="mr-2 h-4 w-4" />
            Offline
          </>
        ) : isProcessing || isRetrying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isRetrying ? 'Retrying...' : 'Processing...'}
          </>
        ) : validFields >= 6 && isValid ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Proceed to Secure Payment
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Complete Form to Continue
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
