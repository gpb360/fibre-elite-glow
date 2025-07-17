'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Mail, 
  Package, 
  Truck, 
  CreditCard,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface NotificationPreference {
  id: string
  type: string
  title: string
  description: string
  enabled: boolean
  category: 'orders' | 'marketing' | 'account'
  icon: React.ReactNode
}

interface EmailNotification {
  id: string
  type: string
  subject: string
  sent_at: string
  status: 'sent' | 'failed' | 'pending'
  order_id?: string
}

export default function EmailNotifications() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [preferences, setPreferences] = useState<NotificationPreference[]>([])
  const [recentNotifications, setRecentNotifications] = useState<EmailNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      loadNotificationPreferences()
      loadRecentNotifications()
    }
  }, [user])

  const loadNotificationPreferences = async () => {
    try {
      // Default notification preferences
      const defaultPreferences: NotificationPreference[] = [
        {
          id: 'order_confirmation',
          type: 'order_confirmation',
          title: 'Order Confirmation',
          description: 'Receive emails when your order is confirmed',
          enabled: true,
          category: 'orders',
          icon: <CheckCircle className="h-5 w-5" />
        },
        {
          id: 'order_shipped',
          type: 'order_shipped',
          title: 'Order Shipped',
          description: 'Get notified when your order ships',
          enabled: true,
          category: 'orders',
          icon: <Truck className="h-5 w-5" />
        },
        {
          id: 'order_delivered',
          type: 'order_delivered',
          title: 'Order Delivered',
          description: 'Confirmation when your order is delivered',
          enabled: true,
          category: 'orders',
          icon: <Package className="h-5 w-5" />
        },
        {
          id: 'payment_failed',
          type: 'payment_failed',
          title: 'Payment Issues',
          description: 'Alerts for payment failures or billing issues',
          enabled: true,
          category: 'orders',
          icon: <CreditCard className="h-5 w-5" />
        },
        {
          id: 'subscription_renewal',
          type: 'subscription_renewal',
          title: 'Subscription Renewal',
          description: 'Reminders before subscription renewals',
          enabled: true,
          category: 'orders',
          icon: <Clock className="h-5 w-5" />
        },
        {
          id: 'promotional_emails',
          type: 'promotional_emails',
          title: 'Promotional Emails',
          description: 'Special offers and product announcements',
          enabled: profile?.marketing_consent || false,
          category: 'marketing',
          icon: <Mail className="h-5 w-5" />
        },
        {
          id: 'newsletter',
          type: 'newsletter',
          title: 'Newsletter',
          description: 'Monthly health tips and wellness content',
          enabled: profile?.newsletter_subscription || false,
          category: 'marketing',
          icon: <Bell className="h-5 w-5" />
        },
        {
          id: 'account_updates',
          type: 'account_updates',
          title: 'Account Updates',
          description: 'Important account and security notifications',
          enabled: true,
          category: 'account',
          icon: <Settings className="h-5 w-5" />
        }
      ]

      setPreferences(defaultPreferences)
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }

  const loadRecentNotifications = async () => {
    try {
      // Mock recent notifications data
      const mockNotifications: EmailNotification[] = [
        {
          id: '1',
          type: 'order_confirmation',
          subject: 'Order Confirmation #12345',
          sent_at: '2024-07-15T10:30:00Z',
          status: 'sent',
          order_id: '12345'
        },
        {
          id: '2',
          type: 'order_shipped',
          subject: 'Your order has shipped!',
          sent_at: '2024-07-14T14:20:00Z',
          status: 'sent',
          order_id: '12344'
        },
        {
          id: '3',
          type: 'promotional_emails',
          subject: 'Summer Sale - 20% Off All Products',
          sent_at: '2024-07-13T09:00:00Z',
          status: 'sent'
        },
        {
          id: '4',
          type: 'newsletter',
          subject: 'Your Monthly Wellness Newsletter',
          sent_at: '2024-07-01T08:00:00Z',
          status: 'sent'
        }
      ]

      setRecentNotifications(mockNotifications)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceToggle = async (preferenceId: string, enabled: boolean) => {
    setSaving(true)
    
    try {
      // Update local state
      setPreferences(prev => 
        prev.map(pref => 
          pref.id === preferenceId ? { ...pref, enabled } : pref
        )
      )

      // In a real app, this would update the database
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // If it's a marketing preference, update the profile
      const preference = preferences.find(p => p.id === preferenceId)
      if (preference && preference.category === 'marketing' && user?.id) {
        const updateData = preferenceId === 'promotional_emails' 
          ? { marketing_consent: enabled }
          : { newsletter_subscription: enabled }

        await supabase
          .from('customer_profiles')
          .update(updateData)
          .eq('user_id', user.id)
      }

      toast({
        title: "Preferences updated",
        description: `Email notifications ${enabled ? 'enabled' : 'disabled'} for ${preference?.title}.`,
      })
    } catch (error) {
      // Revert local state on error
      setPreferences(prev => 
        prev.map(pref => 
          pref.id === preferenceId ? { ...pref, enabled: !enabled } : pref
        )
      )
      
      toast({
        title: "Update failed",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const groupedPreferences = preferences.reduce((acc, pref) => {
    if (!acc[pref.category]) {
      acc[pref.category] = []
    }
    acc[pref.category].push(pref)
    return acc
  }, {} as Record<string, NotificationPreference[]>)

  const categoryTitles = {
    orders: 'Order Notifications',
    marketing: 'Marketing Communications',
    account: 'Account Notifications'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Loading notification settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Email Notifications</h2>
        <p className="text-sm text-gray-600">Manage your email preferences</p>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-6">
        {Object.entries(groupedPreferences).map(([category, prefs]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">{categoryTitles[category as keyof typeof categoryTitles]}</CardTitle>
              <CardDescription>
                {category === 'orders' && 'Control notifications about your orders and purchases'}
                {category === 'marketing' && 'Manage promotional emails and newsletter subscriptions'}
                {category === 'account' && 'Important notifications about your account and security'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prefs.map((preference) => (
                  <div key={preference.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-green-600">
                        {preference.icon}
                      </div>
                      <div>
                        <p className="font-medium">{preference.title}</p>
                        <p className="text-sm text-gray-600">{preference.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={preference.enabled}
                      onCheckedChange={(enabled) => handlePreferenceToggle(preference.id, enabled)}
                      disabled={saving}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Your recent email notifications and their delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{notification.subject}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(notification.sent_at).toLocaleDateString()} at{' '}
                      {new Date(notification.sent_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(notification.status)}
                  <Badge className={getStatusColor(notification.status)}>
                    {notification.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Manage your email address and delivery preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Address</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm">
                Change Email
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Format</p>
                <p className="text-sm text-gray-600">HTML emails with images and formatting</p>
              </div>
              <Button variant="outline" size="sm">
                Text Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}