'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';
import Link from 'next/link';

function CheckoutErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams?.get('error') || 'unknown';
  const errorMessage = searchParams?.get('message') || 'An unexpected error occurred during payment processing.';

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
      default:
        return {
          title: 'Payment Error',
          description: errorMessage,
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          suggestions: [
            'Please try again',
            'Check your payment details',
            'Try a different payment method',
            'Contact support if the issue persists',
          ],
        };
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
          </div>

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cart">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Cart
              </Button>
            </Link>

            <Link href="/checkout">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <CreditCard className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-8 text-center">
            <Card>
              <CardContent className="py-6">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you continue to experience issues, our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm">
                    Live Chat
                  </Button>
                </div>
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
