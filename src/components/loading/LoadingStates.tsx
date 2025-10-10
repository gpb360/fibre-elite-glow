"use client";

import React from 'react';
import { Loader2, Package, ShoppingCart, CreditCard, User, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Generic loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  data?: any;
  retry?: () => void;
}

// Generic loading spinner
export function LoadingSpinner({ 
  size = 'default', 
  className = '',
  text = 'Loading...' 
}: { 
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  text?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}

// Loading overlay for full page
export function LoadingOverlay({ 
  isLoading, 
  text = 'Loading...', 
  className = '' 
}: { 
  isLoading: boolean;
  text?: string;
  className?: string;
}) {
  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
}

// Loading skeleton for cards
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="w-full">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

// Loading skeleton for product cards
export function ProductCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="w-full">
          <CardContent className="p-0">
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

// Error fallback with retry functionality
export function ErrorFallback({ 
  error, 
  retry, 
  icon: Icon = AlertCircle,
  title = 'Something went wrong',
  description = 'We encountered an error while loading this content.',
  showRetry = true,
  className = ''
}: {
  error?: string | Error | null;
  retry?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  showRetry?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Icon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{description}</p>
      
      {error && typeof error === 'string' && (
        <p className="text-sm text-red-600 mb-4 max-w-md">{error}</p>
      )}
      
      {error instanceof Error && (
        <p className="text-sm text-red-600 mb-4 max-w-md">{error.message}</p>
      )}
      
      {showRetry && retry && (
        <Button variant="outline" onClick={retry} className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try again</span>
        </Button>
      )}
    </div>
  );
}

// Specific loading states for different contexts
export function ProductLoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex space-x-4 pt-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-24" />
          </div>
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-96 w-96 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CartLoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between border-t pt-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-12 w-full mt-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CheckoutLoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Customer Info Form */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-4 w-12 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2 mt-1" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
                
                <div className="border-t mt-6 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentLoadingState({ text = 'Processing payment...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CreditCard className="h-12 w-12 text-green-600" />
            <div className="absolute -top-1 -right-1">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
        <p className="text-gray-600 mb-4">{text}</p>
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 bg-green-600 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Context-aware loading states based on user action
export function ContextualLoadingState({ 
  context, 
  isLoading, 
  error, 
  retry, 
  children 
}: {
  context: 'product' | 'cart' | 'checkout' | 'payment' | 'user' | 'general';
  isLoading: boolean;
  error?: string | Error | null;
  retry?: () => void;
  children: React.ReactNode;
}) {
  if (error) {
    const contextualProps = {
      product: {
        icon: Package,
        title: 'Product Unavailable',
        description: 'We could not load the product information. Please try again.'
      },
      cart: {
        icon: ShoppingCart,
        title: 'Cart Error',
        description: 'We could not load your cart. Please refresh the page.'
      },
      checkout: {
        icon: CreditCard,
        title: 'Checkout Error',
        description: 'There was an issue with the checkout process. Please try again.'
      },
      payment: {
        icon: CreditCard,
        title: 'Payment Error',
        description: 'Payment processing failed. Please check your payment method and try again.'
      },
      user: {
        icon: User,
        title: 'Account Error',
        description: 'We could not load your account information. Please try again.'
      },
      general: {
        icon: AlertCircle,
        title: 'Loading Error',
        description: 'Something went wrong. Please try again.'
      }
    };

    return <ErrorFallback {...contextualProps[context]} error={error} retry={retry} />;
  }

  if (isLoading) {
    switch (context) {
      case 'product':
        return <ProductLoadingState />;
      case 'cart':
        return <CartLoadingState />;
      case 'checkout':
        return <CheckoutLoadingState />;
      case 'payment':
        return <PaymentLoadingState />;
      default:
        return <LoadingSpinner text="Loading..." className="py-8" />;
    }
  }

  return <>{children}</>;
}

// Higher-order component for adding loading states
export function withLoadingState<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  loadingComponent?: React.ComponentType<any>
) {
  return function WithLoadingStateComponent(props: T & LoadingState) {
    const { isLoading, error, retry, ...componentProps } = props;

    if (error) {
      return <ErrorFallback error={error} retry={retry} />;
    }

    if (isLoading) {
      if (loadingComponent) {
        const LoadingComponent = loadingComponent;
        return <LoadingComponent />;
      }
      return <LoadingSpinner />;
    }

    return <Component {...(componentProps as T)} />;
  };
}

// Hook for managing loading states
export function useLoadingState(initialLoading = false) {
  const [state, setState] = React.useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
    data: null,
  });

  const setLoading = React.useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading, error: null }));
  }, []);

  const setError = React.useCallback((error: string | Error | null) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: error instanceof Error ? error.message : error
    }));
  }, []);

  const setData = React.useCallback((data: any) => {
    setState(prev => ({ ...prev, isLoading: false, error: null, data }));
  }, []);

  const retry = React.useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    retry,
  };
}