'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Package, Calendar, CreditCard, Truck, MapPin, Phone, Mail, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  product_name: string
  product_image_url?: string
  product_description?: string
}

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  shipping_address: any
  billing_address: any
  order_items: OrderItem[]
  stripe_session_id?: string
  tracking_number?: string
  notes?: string
}

interface OrderDetailsPageProps {
  orderId: string
}

export default function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (orderId) {
      fetchOrderDetails()
    }
  }, [user, orderId, router])

  const fetchOrderDetails = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      setError(null)

      // For now, we'll simulate order details since the actual schema might not be fully set up
      // In production, this would be a proper database query
      const mockOrder: Order = {
        id: orderId,
        total_amount: 59.99,
        status: 'delivered',
        created_at: '2024-07-15T10:30:00Z',
        updated_at: '2024-07-16T14:20:00Z',
        shipping_address: {
          name: 'John Doe',
          line1: '123 Main St',
          city: 'Vancouver',
          state: 'BC',
          postal_code: 'V6B 1A1',
          country: 'Canada'
        },
        billing_address: {
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
            product_image_url: '/images/total-essential.jpg',
            product_description: 'Premium fiber supplement for optimal digestive health'
          }
        ],
        tracking_number: 'TRK123456789',
        notes: 'Handle with care'
      }

      setOrder(mockOrder)
    } catch (error) {
      setError('An unexpected error occurred.')
      console.error('Fetch order error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
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

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Clock },
      { key: 'processing', label: 'Processing', icon: Package },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ]

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered']
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase())

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }))
  }

  const handleReorder = () => {
    // TODO: Implement reorder functionality
    console.log('Reorder items from order:', orderId)
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Order</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-4">
              <Button onClick={() => router.push('/account')} variant="outline">
                Back to Account
              </Button>
              <Button onClick={fetchOrderDetails}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => router.push('/account')} variant="outline">
              Back to Account
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const statusSteps = getStatusSteps(order.status)
  const subtotal = order.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = order.total_amount - subtotal // Simplified tax calculation
  const shipping: number = 0 // Assuming free shipping for now

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/account')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-600 mt-1">Order #{order.id.slice(-8)}</p>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <p className={`text-sm mt-2 ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    {index < statusSteps.length - 1 && (
                      <div className={`w-16 h-0.5 mt-2 ${step.completed ? 'bg-green-300' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>
                    {order.order_items.length} items ordered on {new Date(order.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        {item.product_image_url && (
                          <Image
                            src={item.product_image_url}
                            alt={item.product_name}
                            className="h-16 w-16 rounded-lg object-cover"
                            width={64}
                            height={64}
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                          {item.product_description && (
                            <p className="text-sm text-gray-600 mt-1">{item.product_description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                            <span className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Details */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Order Date</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    {order.tracking_number && (
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Tracking Number</p>
                          <p className="text-sm text-gray-600">{order.tracking_number}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Payment Status</p>
                        <p className="text-sm text-gray-600">Paid</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shipping_address && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{order.shipping_address.name}</p>
                      <p className="text-sm text-gray-600">{order.shipping_address.line1}</p>
                      {order.shipping_address.line2 && (
                        <p className="text-sm text-gray-600">{order.shipping_address.line2}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                      </p>
                      <p className="text-sm text-gray-600">{order.shipping_address.country}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button onClick={handleReorder} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reorder Items
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}