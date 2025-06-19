import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  Package, 
  Eye, 
  Calendar, 
  MapPin, 
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type Address = Database['public']['Tables']['addresses']['Row'];
type Package = Database['public']['Tables']['packages']['Row'];

interface OrderWithDetails extends Order {
  order_items: (OrderItem & {
    packages: Package;
  })[];
  shipping_address: Address | null;
  billing_address: Address | null;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: RefreshCw },
};

export function OrderHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            packages (*)
          ),
          shipping_address:addresses!orders_shipping_address_id_fkey (*),
          billing_address:addresses!orders_billing_address_id_fkey (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data as OrderWithDetails[] || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error loading orders",
        description: error.message || "Failed to load order history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const openOrderDetails = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatAddress = (address: Address | null) => {
    if (!address) return 'No address provided';
    
    return `${address.address_line_1}${address.address_line_2 ? `, ${address.address_line_2}` : ''}, ${address.city}, ${address.state_province} ${address.postal_code}`;
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-gray-500">Please sign in to view your order history.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading order history...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order History</h2>
        <p className="text-gray-600">Track your orders and view purchase history</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 text-center mb-4">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
            
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(order.created_at)}
                        </span>
                        <span className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-1" />
                          {formatCurrency(order.total_amount)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${statusInfo.color} flex items-center space-x-1`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusInfo.label}</span>
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openOrderDetails(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Items ({order.order_items.length})</p>
                        <div className="text-sm text-gray-600">
                          {order.order_items.slice(0, 2).map((item, index) => (
                            <div key={item.id}>
                              {item.packages.product_name} × {item.quantity}
                            </div>
                          ))}
                          {order.order_items.length > 2 && (
                            <div className="text-gray-500">
                              +{order.order_items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </div>
                      {order.shipping_address && (
                        <div className="text-right">
                          <p className="text-sm font-medium flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            Shipping Address
                          </p>
                          <p className="text-sm text-gray-600 max-w-xs">
                            {order.shipping_address.first_name} {order.shipping_address.last_name}
                            <br />
                            {order.shipping_address.city}, {order.shipping_address.state_province}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {(order.shipped_at || order.delivered_at) && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {order.shipped_at && (
                          <span className="flex items-center">
                            <Truck className="w-4 h-4 mr-1" />
                            Shipped: {formatDate(order.shipped_at)}
                          </span>
                        )}
                        {order.delivered_at && (
                          <span className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Delivered: {formatDate(order.delivered_at)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={closeOrderDetails}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order #{selectedOrder.order_number}</DialogTitle>
                <DialogDescription>
                  Placed on {formatDate(selectedOrder.created_at)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Order Status</h3>
                    <p className="text-sm text-gray-600">Current status of your order</p>
                  </div>
                  <Badge className={`${statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color || statusConfig.pending.color} flex items-center space-x-1`}>
                    {React.createElement(statusConfig[selectedOrder.status as keyof typeof statusConfig]?.icon || Clock, { className: "w-3 h-3" })}
                    <span>{statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || 'Pending'}</span>
                  </Badge>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h3 className="font-medium mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.packages.product_name}</h4>
                          <p className="text-sm text-gray-600">{item.packages.product_type}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.total_price)}</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.unit_price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div>
                  <h3 className="font-medium mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.tax_amount > 0 && (
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatCurrency(selectedOrder.tax_amount)}</span>
                      </div>
                    )}
                    {selectedOrder.shipping_amount > 0 && (
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{formatCurrency(selectedOrder.shipping_amount)}</span>
                      </div>
                    )}
                    {selectedOrder.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Addresses */}
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedOrder.shipping_address && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Shipping Address
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}</p>
                        {selectedOrder.shipping_address.company && (
                          <p>{selectedOrder.shipping_address.company}</p>
                        )}
                        <p>{formatAddress(selectedOrder.shipping_address)}</p>
                        {selectedOrder.shipping_address.phone && (
                          <p>{selectedOrder.shipping_address.phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedOrder.billing_address && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <CreditCard className="w-4 h-4 mr-1" />
                        Billing Address
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{selectedOrder.billing_address.first_name} {selectedOrder.billing_address.last_name}</p>
                        {selectedOrder.billing_address.company && (
                          <p>{selectedOrder.billing_address.company}</p>
                        )}
                        <p>{formatAddress(selectedOrder.billing_address)}</p>
                        {selectedOrder.billing_address.phone && (
                          <p>{selectedOrder.billing_address.phone}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                {selectedOrder.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Order Notes</h3>
                      <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                    </div>
                  </>
                )}

                {/* Tracking Information */}
                {(selectedOrder.shipped_at || selectedOrder.delivered_at) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Tracking Information</h3>
                      <div className="space-y-2 text-sm">
                        {selectedOrder.shipped_at && (
                          <div className="flex items-center text-gray-600">
                            <Truck className="w-4 h-4 mr-2" />
                            <span>Shipped on {formatDate(selectedOrder.shipped_at)}</span>
                          </div>
                        )}
                        {selectedOrder.delivered_at && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span>Delivered on {formatDate(selectedOrder.delivered_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrderHistory;
