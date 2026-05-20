'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  ShoppingCart, DollarSign, Clock, Truck, Search, ExternalLink, Eye, Loader2, RefreshCw, Package,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  product_name: string;
  product_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  email: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping_amount: number | null;
  tax_amount: number | null;
  total_amount: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  tracking_number: string | null;
  notes: string | null;
  shipping_first_name: string | null;
  shipping_last_name: string | null;
  shipping_address_line_1: string | null;
  shipping_city: string | null;
  shipping_state_province: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  created_at: string;
  order_items: OrderItem[];
}

interface OrderStats {
  totalOrders: number;
  todayOrders: number;
  todayRevenue: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function AdminOrdersPanel() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { 'x-admin-auth': 'true' },
      });
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders);
        setStats(data.stats);
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load orders', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditTracking(order.tracking_number || '');
    setEditNotes(order.notes || '');
    setDetailOpen(true);
  };

  const updateOrder = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': 'true' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: editStatus,
          trackingNumber: editTracking || null,
          notes: editNotes || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Order updated', description: `Order ${selectedOrder.order_number} updated successfully.` });
        setDetailOpen(false);
        fetchOrders();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const fmt = (amount: number, currency: string = 'CAD') =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(amount);

  const fmtDate = (date: string) =>
    new Date(date).toLocaleDateString('en-CA', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-gray-500">{stats.todayOrders} today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmt(stats.totalRevenue)}</div>
              <p className="text-xs text-gray-500">{fmt(stats.todayRevenue)} today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-gray-500">Awaiting processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.processingOrders}</div>
              <p className="text-xs text-gray-500">Being prepared</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order number or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchOrders()}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchOrders}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" /> Stripe
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2 text-gray-500">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-1">
                Orders will appear here when customers make purchases.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openDetail(order)}>
                      <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{order.shipping_first_name} {order.shipping_last_name}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{order.order_items?.length || 0} item(s)</TableCell>
                      <TableCell className="font-medium">{fmt(order.total_amount, order.currency)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={paymentColors[order.payment_status || 'pending'] || 'bg-gray-100'}>{order.payment_status || 'pending'}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{fmtDate(order.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); openDetail(order); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>Placed {selectedOrder ? fmtDate(selectedOrder.created_at) : ''}</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Customer</h4>
                <p className="text-sm">{selectedOrder.shipping_first_name} {selectedOrder.shipping_last_name}</p>
                <p className="text-sm text-gray-600">{selectedOrder.email}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Shipping Address</h4>
                <p className="text-sm">
                  {selectedOrder.shipping_address_line_1}<br />
                  {selectedOrder.shipping_city}, {selectedOrder.shipping_state_province} {selectedOrder.shipping_postal_code}<br />
                  {selectedOrder.shipping_country}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Items</h4>
                {selectedOrder.order_items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span className="font-medium">{fmt(item.total_price, selectedOrder.currency)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>{fmt(selectedOrder.subtotal || 0, selectedOrder.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{fmt(selectedOrder.shipping_amount || 0, selectedOrder.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{fmt(selectedOrder.tax_amount || 0, selectedOrder.currency)}</span>
                </div>
                <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>{fmt(selectedOrder.total_amount, selectedOrder.currency)}</span>
                </div>
              </div>

              {selectedOrder.stripe_payment_intent_id && (
                <a
                  href={`https://dashboard.stripe.com/payments/${selectedOrder.stripe_payment_intent_id}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> View in Stripe Dashboard
                </a>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Order Status</label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tracking Number</label>
                  <Input value={editTracking} onChange={e => setEditTracking(e.target.value)} placeholder="Enter tracking number..." />
                </div>
                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Internal notes..." rows={3} />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Cancel</Button>
            <Button onClick={updateOrder} disabled={updating}>
              {updating && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
