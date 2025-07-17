'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  CreditCard, 
  Package, 
  Pause, 
  Play, 
  Settings, 
  Truck, 
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface Subscription {
  id: string
  product_name: string
  product_id: string
  quantity: number
  price: number
  frequency: string
  next_delivery: string
  status: 'active' | 'paused' | 'cancelled'
  created_at: string
  product_image_url?: string
  stripe_subscription_id?: string
}

export default function SubscriptionManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingSubscription, setUpdatingSubscription] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchSubscriptions()
    }
  }, [user])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)

      // For now, we'll simulate subscription data since the table might not exist yet
      // In production, this would query a subscriptions table
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          product_name: 'Total Essential',
          product_id: 'total-essential',
          quantity: 1,
          price: 59.99,
          frequency: 'monthly',
          next_delivery: '2024-08-15',
          status: 'active',
          created_at: '2024-07-15T00:00:00Z',
          product_image_url: '/images/total-essential.jpg',
          stripe_subscription_id: 'sub_123'
        },
        {
          id: '2',
          product_name: 'Total Essential Plus',
          product_id: 'total-essential-plus',
          quantity: 2,
          price: 79.99,
          frequency: 'bi-monthly',
          next_delivery: '2024-08-30',
          status: 'paused',
          created_at: '2024-06-15T00:00:00Z',
          product_image_url: '/images/total-essential-plus.jpg',
          stripe_subscription_id: 'sub_456'
        }
      ]

      setSubscriptions(mockSubscriptions)
    } catch (error) {
      setError('Failed to load subscriptions. Please try again.')
      console.error('Fetch subscriptions error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (subscriptionId: string, newStatus: 'active' | 'paused') => {
    setUpdatingSubscription(subscriptionId)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
        )
      )

      toast({
        title: "Subscription updated",
        description: `Subscription ${newStatus === 'active' ? 'resumed' : 'paused'} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingSubscription(null)
    }
  }

  const handleFrequencyChange = async (subscriptionId: string, newFrequency: string) => {
    setUpdatingSubscription(subscriptionId)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? { ...sub, frequency: newFrequency } : sub
        )
      )

      toast({
        title: "Frequency updated",
        description: `Delivery frequency changed to ${newFrequency}.`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update frequency. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingSubscription(null)
    }
  }

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return
    }

    setUpdatingSubscription(subscriptionId)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: 'cancelled' } : sub
        )
      )

      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully.",
      })
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingSubscription(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'paused':
        return <Pause className="h-4 w-4" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case 'monthly':
        return 'Every month'
      case 'bi-monthly':
        return 'Every 2 months'
      case 'quarterly':
        return 'Every 3 months'
      default:
        return frequency
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading subscriptions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchSubscriptions} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active subscriptions</h3>
            <p className="text-gray-600 mb-6">
              You don't have any active subscriptions. Set up a subscription to get regular deliveries.
            </p>
            <Button asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Subscription Management</h2>
        <p className="text-sm text-gray-600">{subscriptions.length} subscriptions</p>
      </div>

      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {subscription.product_image_url && (
                    <Image
                      src={subscription.product_image_url}
                      alt={subscription.product_name}
                      className="h-16 w-16 rounded-lg object-cover"
                      width={64}
                      height={64}
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{subscription.product_name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {subscription.quantity}</p>
                    <p className="text-sm text-gray-600">${subscription.price.toFixed(2)} per delivery</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(subscription.status)}
                  <Badge className={getStatusColor(subscription.status)}>
                    {subscription.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Next Delivery</p>
                    <p className="text-sm text-gray-600">
                      {new Date(subscription.next_delivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Frequency</p>
                    <p className="text-sm text-gray-600">{formatFrequency(subscription.frequency)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Started</p>
                    <p className="text-sm text-gray-600">
                      {new Date(subscription.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {subscription.status !== 'cancelled' && (
                <div className="border-t pt-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium">Status:</label>
                      <Switch
                        checked={subscription.status === 'active'}
                        onCheckedChange={(checked) => 
                          handleStatusToggle(subscription.id, checked ? 'active' : 'paused')
                        }
                        disabled={updatingSubscription === subscription.id}
                      />
                      <span className="text-sm text-gray-600">
                        {subscription.status === 'active' ? 'Active' : 'Paused'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium">Frequency:</label>
                      <Select
                        value={subscription.frequency}
                        onValueChange={(value) => handleFrequencyChange(subscription.id, value)}
                        disabled={updatingSubscription === subscription.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="bi-monthly">Bi-Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updatingSubscription === subscription.id}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Modify
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelSubscription(subscription.id)}
                        disabled={updatingSubscription === subscription.id}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {updatingSubscription === subscription.id && (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Updating...</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Billing</CardTitle>
          <CardDescription>
            Update your payment method and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Update Payment Method
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Billing History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}