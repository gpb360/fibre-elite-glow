'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from '../../../src/components/ui/card';
import { Button } from '../../../src/components/ui/button';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';
=======
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartPersistence } from '@/lib/checkout-validation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { XCircle, ArrowLeft, CreditCard, HelpCircle, RefreshCw, AlertTriangle, Shield } from 'lucide-react';
>>>>>>> feature/resend-email-integration
import Link from 'next/link';

function CheckoutErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams?.get('error') || 'unknown';
  const errorMessage = searchParams?.get('message') || 'An unexpected error occurred during payment processing.';
  const sessionId = searchParams?.get('session_id');
  const [isRecoveringCart, setIsRecoveringCart] = useState(false);
  const [cartRecovered, setCartRecovered] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Cart persistence for recovery
  const { restoreCart, clearPersistedCart, hasPersistedCart } = useCartPersistence();
  
  useEffect(() => {
    // Auto-restore cart on payment failure
    if (hasPersistedCart() && !cartRecovered) {
      handleRestoreCart();
    }
  }, []);

  const getErrorDetails = (type: string) => {
    switch (type) {
      case 'card_declined':
        return {
          title: 'Payment Declined',
          description: 'Your card was declined. Please try a different payment method or contact your bank.',
          icon: <CreditCard className="w-8 h-8 text-red-600" />,
          suggestions: [
            'Check that your card details are correct',
            'Ensure you have sufficient funds',
            'Try a different card',
            'Contact your bank if the issue persists',
          ],
        };
      case 'insufficient_funds':
        return {
          title: 'Insufficient Funds',
          description: 'Your card does not have sufficient funds for this transaction.',
          icon: <CreditCard className="w-8 h-8 text-red-600" />,
          suggestions: [
            'Check your account balance',
            'Try a different payment method',
            'Add funds to your account',
          ],
        };
      case 'expired_card':
        return {
          title: 'Card Expired',
          description: 'The card you used has expired. Please use a different card.',
          icon: <CreditCard className="w-8 h-8 text-red-600" />,
          suggestions: [
            'Check the expiration date on your card',
            'Use a different, valid card',
            'Contact your bank for a replacement card',
          ],
        };
      case 'processing_error':
        return {
          title: 'Processing Error',
          description: 'There was an error processing your payment. Please try again.',
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          suggestions: [
            'Try again in a few minutes',
            'Check your internet connection',
            'Use a different payment method',
            'Contact support if the problem continues',
          ],
        };
      case 'authentication_required':
        return {
          title: 'Authentication Required',
          description: 'Your bank requires additional authentication for this transaction.',
          icon: <CreditCard className="w-8 h-8 text-orange-600" />,
          suggestions: [
            'Complete the authentication with your bank',
            'Try the payment again',
            'Contact your bank if you need assistance',
          ],
        };
      // Additional common Stripe error codes
      case 'incomplete_payment':
      case 'requires_payment_method':
        return {
          title: 'Payment Incomplete',
          description:
            'Your payment could not be completed. Please verify your details or try a different method.',
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          suggestions: [
            'Verify your card details',
            'Try a different payment method',
            'Ensure your bank hasn\'t blocked the transaction',
          ],
        };
      case 'session_expired':
        return {
          title: 'Session Expired',
          description:
            'Your payment session has expired. Please restart the checkout process.',
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          suggestions: [
            'Return to your cart and begin checkout again',
            'Your cart items have been saved and restored',
            'If the issue persists, contact our support team',
          ],
          recoverable: true,
          severity: 'medium'
        };
      case 'network_error':
        return {
          title: 'Network Connection Error',
          description: 'There was a problem connecting to our payment processor. Your card was not charged.',
          icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
          suggestions: [
            'Check your internet connection',
            'Try again in a few moments',
            'Your cart has been saved automatically',
            'Contact support if the problem continues',
          ],
          recoverable: true,
          severity: 'high'
        };
      case 'payment_method_required':
        return {
          title: 'Payment Method Required',
          description: 'A valid payment method is required to complete this transaction.',
          icon: <CreditCard className="w-8 h-8 text-red-600" />,
          suggestions: [
            'Add a valid payment method',
            'Check that your card is active',
            'Try a different payment method',
            'Contact your bank if needed',
          ],
          recoverable: true,
          severity: 'medium'
        };
      default:
        return {
          title: 'Payment Error',
          description: errorMessage,
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          suggestions: [
            'Please try again with the same or different payment method',
            'Check your payment details for accuracy',
            'Ensure your card has sufficient funds',
            'Contact support if the issue persists',
          ],
          recoverable: true,
          severity: 'high'
        };
    }
  };
  
  const handleRestoreCart = async () => {
    setIsRecoveringCart(true);
    try {
      await restoreCart();
      setCartRecovered(true);
    } catch (error) {
      console.error('Failed to restore cart:', error);
    } finally {
      setIsRecoveringCart(false);
    }
  };
  
  const handleRetryPayment = () => {
    setRetryCount(prev => prev + 1);
    // Clear any failed session data
    if (sessionId) {
      localStorage.removeItem(`payment_attempt_${sessionId}`);
    }
  };

  const errorDetails = getErrorDetails(errorType);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto">
          {/* Error Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {errorDetails.icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="error-message">
              {errorDetails.title}
            </h1>
            <p className="text-lg text-gray-600">
              {errorDetails.description}
            </p>
            {sessionId && (
              <p className="text-sm text-gray-500 mt-2" data-testid="session-id">
                Session ID: {sessionId.substring(0, 20)}...
              </p>
            )}
          </div>
          
          {/* Cart Recovery Status */}
          {cartRecovered && (
            <div className="mb-6">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Cart Restored Successfully</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Your cart items have been automatically restored. You can continue with checkout.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                What can you do?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {errorDetails.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Common Issues Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Common Payment Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Card Information</h3>
                  <p className="text-sm text-gray-600">
                    Double-check your card number, expiration date, and security code.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Billing Address</h3>
                  <p className="text-sm text-gray-600">
                    Ensure your billing address matches your card statement.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Bank Restrictions</h3>
                  <p className="text-sm text-gray-600">
                    Some banks block online transactions. Contact your bank to authorize the payment.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">International Cards</h3>
                  <p className="text-sm text-gray-600">
                    International cards may require additional verification steps.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/cart">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Button>
            </Link>

            <Link href="/checkout" onClick={handleRetryPayment}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again {retryCount > 0 && `(${retryCount + 1})`}
              </Button>
            </Link>
            
            {hasPersistedCart() && !cartRecovered && (
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={handleRestoreCart}
                disabled={isRecoveringCart}
              >
                {isRecoveringCart ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                {isRecoveringCart ? 'Restoring...' : 'Restore Cart'}
              </Button>
            )}
          </div>
          
          {/* Payment Security Notice */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Payment Security</h3>
                  <p className="text-sm text-blue-800">
                    Your payment information is secure and was not processed due to this error. 
                    No charges have been made to your account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <div className="mt-8 text-center">
            <Card>
              <CardContent className="py-6">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you continue to experience issues, our support team is here to help.
                </p>
                {sessionId && (
                  <p className="text-xs text-gray-500 mb-4 font-mono bg-gray-100 p-2 rounded">
                    Reference ID: {sessionId}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link href="/contact">
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).Intercom) {
                      (window as any).Intercom('show');
                    } else {
                      // Fallback to contact page
                      window.location.href = '/contact';
                    }
                  }}>
                    Live Chat
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Email&nbsp;
                  <a
                    href="mailto:support@fibreeliteglow.com"
                    className="underline text-blue-600"
                  >
                    support@fibreeliteglow.com
                  </a>
                  &nbsp;or call&nbsp;
                  <a href="tel:+18005551234" className="underline text-blue-600">
                    +1&nbsp;(800)&nbsp;555-1234
                  </a>
                  &nbsp;for immediate assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading...</h1>
              <p className="text-lg text-gray-600">Processing error information...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CheckoutErrorContent />
    </Suspense>
  );
}
