
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const OrderHistory: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Please sign in to view your order history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">No orders found.</p>
          <p className="text-sm text-gray-500">
            Your order history will appear here once you make your first purchase.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
