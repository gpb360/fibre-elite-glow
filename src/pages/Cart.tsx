import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
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
        <Link to="/products">
          <Button variant="premium" size="lg">
            Browse Products
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <Heading
              title="Shopping Cart"
              description={cart.totalItems > 0 ? `${cart.totalItems} item${cart.totalItems !== 1 ? 's' : ''} in your cart` : 'Your cart is currently empty'}
            />
          </div>

          {cart.items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Cart Items</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800"
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
                        className="flex items-center gap-4 p-4 border rounded-lg bg-white"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.productName}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {item.productType.replace('_', ' ')}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-green-600">
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 mt-1"
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
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.totalItems} items)</span>
                      <span>${cart.subtotal.toFixed(2)}</span>
                    </div>
                    
                    {cart.totalSavings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Total Savings</span>
                        <span>-${cart.totalSavings.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${cart.subtotal.toFixed(2)}</span>
                    </div>
                    
                    <Button variant="premium" size="lg" className="w-full">
                      Proceed to Checkout
                    </Button>
                    
                    <Link to="/products" className="block">
                      <Button variant="outline" size="lg" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
