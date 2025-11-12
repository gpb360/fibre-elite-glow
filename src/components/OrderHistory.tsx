'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Calendar, CreditCard, ChevronRight, ShoppingBag, Truck, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  product_name: string
  product_image_url?: string
}

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  shipping_address: any
  order_items: OrderItem[]
}

const OrderHistory: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Get Supabase session for the auth token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('get-orders', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) {
        console.error('Edge Function error:', error)
        throw new Error(error.message || 'Failed to fetch orders')
      }

      // Transform the data to match the expected Order interface
      const transformedOrders: Order[] = (data.orders || []).map((order: any) => ({
        id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        shipping_address: {
          name: `${order.shipping_first_name} ${order.shipping_last_name}`,
          line1: order.shipping_address_line_1,
          line2: order.shipping_address_line_2,
          city: order.shipping_city,
          state: order.shipping_state_province,
          postal_code: order.shipping_postal_code,
          country: order.shipping_country
        },
        order_items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          product_id: item.product_type,
          quantity: item.quantity,
          price: item.unit_price,
          product_name: item.product_name,
          product_image_url: item.product_type === 'total_essential_plus'
            ? '/lovable-uploads/webp/total-essential-plus-fiber-supplement-bottle.webp'
            : '/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp' // Fallback image
        }))
      }))

      setOrders(transformedOrders)
    } catch (error) {
      setError(error.message || 'Failed to fetch orders')
      console.error('Fetch orders error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleOrderClick = (orderId: string) => {
    window.location.href = `/account/orders/${orderId}`
  }

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
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" data-testid="loading-spinner"></div>
            <span className="ml-2 text-gray-600">Loading orders...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4" data-testid="error-message">{error}</p>
            <Button onClick={fetchOrders} variant="outline" data-testid="retry-button">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid="no-orders-message">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              Your order history will appear here once you make your first purchase.
            </p>
            <Button asChild data-testid="start-shopping-button">
              <a href="/products">Start Shopping</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4" data-testid="order-history-container">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order History</h2>
        <p className="text-sm text-gray-600">{orders.length} orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow" data-testid="order-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="font-medium" data-testid="order-number">Order #{order.id.slice(-8)}</span>
                  </div>
                  <Badge className={getStatusColor(order.status)} data-testid="order-status">
                    {order.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOrderClick(order.id)}
                  className="text-green-600 hover:text-green-700"
                  data-testid="view-details-button"
                >
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600" data-testid="order-date">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600" data-testid="order-total">
                    Total: ${order.total_amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {order.order_items?.length || 0} items
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    {order.order_items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {item.product_image_url && (
                            <Image
                              src={item.product_image_url}
                              alt={item.product_name}
                              className="h-10 w-10 rounded-md object-cover"
                              width={40}
                              height={40}
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium">{item.product_name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    {order.order_items.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{order.order_items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-start space-x-2">
                    <Truck className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Shipping Address</p>
                      <p className="text-xs text-gray-600">
                        {order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <Button variant="outline" onClick={fetchOrders}>
          Refresh Orders
        </Button>
      </div>
    </div>
  )
}

export default OrderHistory