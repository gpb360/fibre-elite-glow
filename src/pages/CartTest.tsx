import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';

const CartTest = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, isLoading } = useCart();

  const testAddSimpleItem = async () => {
    console.log('🛒 Adding simple test item...');
    try {
      await addToCart({
        id: 'test-simple-1',
        productName: 'Simple Test Product',
        productType: 'total_essential',
        price: 19.99,
      });
      console.log('✅ Simple item added successfully!');
    } catch (error) {
      console.error('❌ Failed to add simple item:', error);
    }
  };

  const testAddComplexItem = async () => {
    console.log('🛒 Adding complex test item...');
    try {
      await addToCart({
        id: 'test-complex-1',
        productName: 'Complex Test Product',
        productType: 'total_essential_plus',
        price: 29.99,
        originalPrice: 39.99,
        savings: 10,
        image: '/placeholder.svg',
        packageSize: '30 sachets',
      });
      console.log('✅ Complex item added successfully!');
    } catch (error) {
      console.error('❌ Failed to add complex item:', error);
    }
  };

  const logCartState = () => {
    console.log('📊 Current Cart State:', {
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      totalSavings: cart.totalSavings,
      itemsCount: cart.items.length,
      items: cart.items,
      isLoading,
    });
  };

  const testLocalStorage = () => {
    const cartData = localStorage.getItem('fibre-elite-cart');
    console.log('💾 LocalStorage Data:', cartData);
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData);
        console.log('💾 Parsed Data:', parsed);
      } catch (error) {
        console.error('❌ Failed to parse localStorage data:', error);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">🧪 Cart Functionality Test Page</h1>
            
            {/* Cart State Display */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>📊 Current Cart State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{cart.totalItems}</div>
                    <div className="text-sm text-blue-800">Total Items</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${cart.subtotal.toFixed(2)}</div>
                    <div className="text-sm text-green-800">Subtotal</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">${cart.totalSavings.toFixed(2)}</div>
                    <div className="text-sm text-purple-800">Total Savings</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{cart.items.length}</div>
                    <div className="text-sm text-gray-800">Items Array Length</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>🧪 Test Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={testAddSimpleItem} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Adding...' : 'Add Simple Item'}
                  </Button>
                  <Button 
                    onClick={testAddComplexItem} 
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    Add Complex Item
                  </Button>
                  <Button 
                    onClick={logCartState} 
                    variant="secondary"
                    className="w-full"
                  >
                    Log Cart State
                  </Button>
                  <Button 
                    onClick={testLocalStorage} 
                    variant="secondary"
                    className="w-full"
                  >
                    Check LocalStorage
                  </Button>
                  <Button 
                    onClick={clearCart} 
                    variant="destructive"
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                  <Link to="/cart" className="w-full">
                    <Button variant="premium" className="w-full">
                      Go to Cart Page
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items Display */}
            {cart.items.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>🛒 Cart Items ({cart.items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-lg border">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.productName}</h3>
                          <p className="text-sm text-gray-600">
                            {item.productType} • ${item.price} • Qty: {item.quantity}
                          </p>
                          {item.packageSize && (
                            <p className="text-xs text-gray-500">{item.packageSize}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Testing Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Open browser console (F12) to see detailed logs</li>
                  <li>Click "Add Simple Item" to test basic cart functionality</li>
                  <li>Click "Add Complex Item" to test with all properties</li>
                  <li>Check if cart counter in header updates</li>
                  <li>Use "Log Cart State" to see current state in console</li>
                  <li>Use "Check LocalStorage" to verify persistence</li>
                  <li>Test quantity controls and remove functionality</li>
                  <li>Click "Go to Cart Page" to test navigation</li>
                  <li>Refresh page to test persistence</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartTest;
