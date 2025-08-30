"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { EmptyCart, LoadingSpinner } from '@/components/loading';
import { ErrorBoundary } from '@/components/error';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setIsUpdating(true);
    try {
      if (newQuantity < 1) {
        removeFromCart(itemId);
      } else {
        updateQuantity(itemId, newQuantity);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      // Add a small delay to show loading state
      setTimeout(() => setIsUpdating(false), 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string, currentQuantity: number) => {
    if (e.key === 'ArrowUp' || e.key === '+') {
      e.preventDefault();
      if (currentQuantity < 10) {
        handleQuantityChange(itemId, currentQuantity + 1);
      }
    } else if (e.key === 'ArrowDown' || e.key === '-') {
      e.preventDefault();
      if (currentQuantity > 1) {
        handleQuantityChange(itemId, currentQuantity - 1);
      }
    }
  };

  const EmptyCart = () => (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/products">
          <Button variant="premium" size="lg">
            Browse Products
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </motion.div>
  );

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Cart Error:', error, errorInfo);
      }}
      resetKeys={[cart.items.length]}
    >
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50" data-testid="cart-main">
          <div className="container px-4 md:px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-800 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
              <Heading
                title="Shopping Cart"
                description={cart.totalItems > 0 ? `${cart.totalItems} item${cart.totalItems !== 1 ? 's' : ''} in your cart` : 'Your cart is currently empty'}
              />
            </div>

            {/* Show loading state */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading your cart..." />
              </div>
            )}

            {/* Show cart content */}
            {!isLoading && (
              cart.items.length === 0 ? (
                <EmptyCart />
              ) : (
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Cart Items */}
                  <div className="lg:col-span-2">
                    <Card data-testid="cart-items">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Cart Items</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearCart}
                          className="text-red-600 hover:text-red-800"
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear Cart
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {cart.items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 border rounded-lg bg-white relative"
                            data-testid={`cart-item-${item.id}`}
                          >
                            {/* Loading overlay for item updates */}
                            {isUpdating && (
                              <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center z-10">
                                <LoadingSpinner size="sm" />
                              </div>
                            )}

                            {/* Product Image */}
                            <div className="flex-shrink-0 relative" data-testid="product-image">
                              <Image
                                src={item.image || '/placeholder.svg'}
                                alt={item.productName}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                                sizes="80px"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp';
                                }}
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate" data-testid="product-name">
                                {item.productName}
                              </h3>
                              <p className="text-sm text-gray-500 capitalize" data-testid="product-type">
                                {item.productType.replace('_', ' ')}
                              </p>
                              {item.packageSize && (
                                <p className="text-sm text-gray-600" data-testid="package-size">
                                  {item.packageSize}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-green-600" data-testid="product-price">
                                  ${item.price.toFixed(2)}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ${item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div 
                              className="flex items-center gap-2" 
                              data-testid="quantity-controls"
                              role="group"
                              aria-label={`Quantity controls for ${item.title}`}
                              onKeyDown={(e) => handleKeyDown(e, item.id, item.quantity)}
                              tabIndex={0}
                            >
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 min-w-[40px] touch-target"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                                aria-label={`Decrease quantity of ${item.title}`}
                                title="Decrease quantity (Arrow Down or - key)"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span 
                                className="w-12 text-center font-medium" 
                                data-testid="item-quantity"
                                aria-live="polite"
                                aria-label={`Current quantity: ${item.quantity}`}
                              >
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 min-w-[40px] touch-target"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={isUpdating || item.quantity >= 10}
                                aria-label={`Increase quantity of ${item.title}`}
                                title="Increase quantity (Arrow Up or + key)"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="font-semibold" data-testid="item-total">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 hover:text-red-800 mt-1"
                                disabled={isUpdating}
                                data-testid="remove-item-button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <Card className="sticky top-4" data-testid="cart-total">
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between" data-testid="subtotal">
                          <span>Subtotal ({cart.totalItems} items)</span>
                          <span>${cart.subtotal.toFixed(2)}</span>
                        </div>
                        
                        {cart.totalSavings > 0 && (
                          <div className="flex justify-between text-green-600" data-testid="savings">
                            <span>Total Savings</span>
                            <span>-${cart.totalSavings.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Shipping</span>
                          <span>Calculated at checkout</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between text-lg font-semibold" data-testid="total-amount">
                          <span>Total</span>
                          <span>${cart.subtotal.toFixed(2)}</span>
                        </div>
                        
                        <Link href="/checkout" className="block">
                          <Button 
                            variant="premium" 
                            size="lg" 
                            className="w-full" 
                            data-testid="checkout-button"
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <LoadingSpinner size="sm" text="" className="mr-2" />
                            ) : null}
                            Proceed to Checkout
                          </Button>
                        </Link>

                        <Link href="/products" className="block">
                          <Button variant="outline" size="lg" className="w-full" disabled={isUpdating}>
                            Continue Shopping
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Cart;
