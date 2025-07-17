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
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)

      // For now, we'll simulate order data since the actual schema might not be fully set up
      // In production, this would be a proper database query
      const mockOrders: Order[] = [
        {
          id: '1',
          total_amount: 59.99,
          status: 'delivered',
          created_at: '2024-07-15T10:30:00Z',
          shipping_address: {
            name: 'John Doe',
            line1: '123 Main St',
            city: 'Vancouver',
            state: 'BC',
            postal_code: 'V6B 1A1',
            country: 'Canada'
          },
          order_items: [
            {
              id: '1',
              product_id: 'total-essential',
              quantity: 1,
              price: 59.99,
              product_name: 'Total Essential',
              product_image_url: '/images/total-essential.jpg'
            }
          ]
        },
        {
          id: '2',
          total_amount: 79.99,
          status: 'processing',
          created_at: '2024-07-14T14:20:00Z',
          shipping_address: {
            name: 'John Doe',
            line1: '123 Main St',
            city: 'Vancouver',
            state: 'BC',
            postal_code: 'V6B 1A1',
            country: 'Canada'
          },
          order_items: [
            {
              id: '2',
              product_id: 'total-essential-plus',
              quantity: 1,
              price: 79.99,
              product_name: 'Total Essential Plus',
              product_image_url: '/images/total-essential-plus.jpg'
            }
          ]
        }
      ]

      setOrders(mockOrders)
    } catch (error) {
      setError('An unexpected error occurred.')
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchOrders} variant="outline">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              Your order history will appear here once you make your first purchase.
            </p>
            <Button asChild>
              <a href="/products">Start Shopping</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order History</h2>
        <p className="text-sm text-gray-600">{orders.length} orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="font-medium">Order #{order.id.slice(-8)}</span>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOrderClick(order.id)}
                  className="text-green-600 hover:text-green-700"
                >
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
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