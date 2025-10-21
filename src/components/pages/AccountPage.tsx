'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { User, Package, Settings, LogOut, ShoppingBag, MapPin, CreditCard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OrderHistory from '@/components/OrderHistory'
import CustomerProfile from '@/components/CustomerProfile'
import SubscriptionManagement from '@/components/SubscriptionManagement'
import EmailNotifications from '@/components/EmailNotifications'

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState<any[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Fetch order statistics
  useEffect(() => {
    if (user) {
      fetchOrderStats()
    }
  }, [user])

  const fetchOrderStats = async () => {
    if (!user?.email) return

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount, status, created_at')
        .eq('email', user.email)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      setOrders(orders || [])
      setOrderCount(orders?.length || 0)

      const total = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      setTotalSpent(total)
    } catch (error) {
      console.error('Error fetching order stats:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Show loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your account...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Don't render if not logged in
  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {profile?.first_name || user.email}!
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                data-testid="sign-out-button"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Account Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card data-testid="total-orders-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderCount}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime orders placed
                </p>
              </CardContent>
            </Card>

            <Card data-testid="total-spent-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Total amount spent
                </p>
              </CardContent>
            </Card>

            <Card data-testid="account-status-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" data-testid="overview-tab">Overview</TabsTrigger>
              <TabsTrigger value="orders" data-testid="orders-tab">Orders</TabsTrigger>
              <TabsTrigger value="subscriptions" data-testid="subscriptions-tab">Subscriptions</TabsTrigger>
              <TabsTrigger value="profile" data-testid="profile-tab">Profile</TabsTrigger>
              <TabsTrigger value="settings" data-testid="settings-tab">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6" data-testid="overview-content">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card data-testid="recent-orders-section">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Recent Orders
                    </CardTitle>
                    <CardDescription>
                      Your latest order activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order: any, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium">Order #{order.id?.slice(-8) || 'N/A'}</p>
                              <p className="text-xs text-gray-600">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">${order.total_amount}</p>
                              <Badge variant="outline" className="text-xs">
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('orders')}
                          className="w-full"
                        >
                          View All Orders
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                        <Button asChild>
                          <a href="/products">Shop Now</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Summary */}
                <Card data-testid="profile-summary-section">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Summary
                    </CardTitle>
                    <CardDescription>
                      Your account information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Name</span>
                        <span className="text-sm font-medium">
                          {profile?.first_name && profile?.last_name
                            ? `${profile.first_name} ${profile.last_name}`
                            : 'Not set'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Phone</span>
                        <span className="text-sm font-medium">
                          {profile?.phone || 'Not set'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Marketing</span>
                        <Badge variant={profile?.marketing_consent ? "default" : "secondary"}>
                          {profile?.marketing_consent ? "Opted in" : "Opted out"}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('profile')}
                        className="w-full"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" data-testid="orders-content">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and manage your order history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderHistory />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    Manage your recurring orders and subscription preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SubscriptionManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" data-testid="profile-content">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Management</CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomerProfile />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" data-testid="settings-content">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Security</h3>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            <Settings className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <MapPin className="h-4 w-4 mr-2" />
                            Manage Addresses
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
                        <Button variant="destructive" className="w-full">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>
                      Manage your email preferences and notification settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmailNotifications />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  )
}