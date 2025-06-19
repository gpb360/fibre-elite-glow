
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CartTest: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cart Testing Page</h1>
          <Card>
            <CardHeader>
              <CardTitle>Cart Test Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This is a test page for cart functionality. You can add specific cart testing features here.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartTest;
