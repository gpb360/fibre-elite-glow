'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Package, Mail, ArrowRight, Download } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCheckoutValidation, useOrderConfirmation } from '@/lib/checkout-validation';
import Link from 'next/link';

interface OrderDetails {
  id: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidatingOrder, setIsValidatingOrder] = useState(false);
  
  // Enhanced checkout validation hooks
  const { validateOrderCompletion, isValidating: isCheckoutValidating } = useCheckoutValidation();
  const { confirmOrder, isConfirming, confirmationError } = useOrderConfirmation();

  useEffect(() => {
    const sessionId = searchParams?.get('session_id');
    
    console.log('🔄 CheckoutSuccessContent useEffect triggered');
    console.log('📋 Session ID from search params:', sessionId);
    
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        console.error('❌ No session ID provided');
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching order details for session:', sessionId);

      try {
        const response = await fetch(`/api/checkout-session/${sessionId}`);

        console.log('📡 API Response:', { 
          status: response.status, 
          statusText: response.statusText,
          ok: response.ok 
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error Response:', errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Order details received:', data);
        
        // Validate order completion with enhanced security
        setIsValidatingOrder(true);
        try {
          const validationResult = await validateOrderCompletion({
            sessionId,
            orderData: data,
            expectedAmount: data.amount,
            customerEmail: data.customerEmail
          });
          
          if (!validationResult.isValid) {
            setValidationError(validationResult.errors[0] || 'Order validation failed');
            return;
          }
          
          // Confirm order with validation
          const confirmationResult = await confirmOrder({
            orderId: data.id,
            sessionId,
            customerEmail: data.customerEmail,
            totalAmount: data.amount
          });
          
          if (!confirmationResult.isValid) {
            setValidationError(confirmationResult.errors[0] || 'Order confirmation failed');
            return;
          }
          
          setOrderDetails(data);
          
          // Clear the cart after successful payment and validation
          clearCart();
          
          // Store order completion timestamp for security
          localStorage.setItem(`order_${data.id}_completed`, Date.now().toString());
          
        } catch (validationError) {
          console.error('❌ Order validation error:', validationError);
          setValidationError('Order validation failed. Please contact support.');
        } finally {
          setIsValidatingOrder(false);
        }
      } catch (err) {
        console.error('❌ Error fetching order details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, clearCart]);

  if (loading || isValidatingOrder || isCheckoutValidating || isConfirming) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isValidatingOrder ? 'Validating your order...' :
               isConfirming ? 'Confirming order completion...' :
               'Loading your order details...'}
            </p>
            {(isValidatingOrder || isConfirming) && (
              <p className="text-sm text-gray-500 mt-2">
                This may take a few moments for security verification.
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || validationError || confirmationError || !orderDetails) {
    const sessionId = searchParams?.get('session_id');
    const displayError = validationError || confirmationError || error;
    
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {validationError || confirmationError ? 'Order Validation Failed' : 'Order Not Found'}
              </h2>
              <p className="text-gray-600 mb-4">
                {displayError || 'We could not find your order details.'}
              </p>
              {sessionId && (
                <p className="text-xs text-gray-500 mb-4 font-mono">
                  Session ID: {sessionId}
                </p>
              )}
              <div className="space-y-2">
                {(validationError || confirmationError) && (
                  <Link href="/contact">
                    <Button variant="default">Contact Support</Button>
                  </Link>
                )}
                <Link href="/">
                  <Button variant={validationError || confirmationError ? "outline" : "default"}>
                    Return to Home
                  </Button>
                </Link>
                <button 
                  onClick={() => window.location.reload()} 
                  className="block w-full text-sm text-blue-600 hover:text-blue-800"
                >
                  Try Again
                </button>
              </div>
              {(validationError || confirmationError) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Important:</strong> If your payment was processed, please contact our support team immediately.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="success-message">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </div>

          {/* Order Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Order Number:</span>
                  <span className="font-mono text-sm" data-testid="order-number">
                    {orderDetails.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {orderDetails.status}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Order Date:</span>
                  <span className="text-sm">{formatDate(orderDetails.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-semibold text-lg" data-testid="order-total">
                    {formatCurrency(orderDetails.amount, orderDetails.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Items Ordered */}
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity * 100, orderDetails.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                What&apos;s Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Confirmation Email</h3>
                    <p className="text-sm text-gray-600">
                      We&apos;ve sent a confirmation email to {orderDetails.customerEmail} with your order details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Processing & Shipping</h3>
                    <p className="text-sm text-gray-600">
                      Your order will be processed within 1-2 business days and shipped to your address.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Tracking Information</h3>
                    <p className="text-sm text-gray-600">
                      You&apos;ll receive tracking information once your order ships.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Customer Support</h3>
                    <p className="text-sm text-gray-600">
                      Need help? Contact our support team anytime.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button variant="outline" asChild>
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
