'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Simple password protection
  const handleAuth = () => {
    if (password === 'lbve-admin-2024' || password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-auth', 'true');
      }
    } else {
      alert('Invalid password');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    if (typeof window !== 'undefined' && localStorage.getItem('admin-auth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchOrders();
    }
  }, [authenticated]);

  const fetchOrders = async () => {
    try {
      // This would connect to your order storage system
      // For now, we'll show a placeholder
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin-auth');
    }
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
            🔐 Admin Access
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter admin password"
            />
          </div>
          <button
            onClick={handleAuth}
            className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-200"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-green-600 hover:text-green-700 mr-8">
                ← Back to Store
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                🌿 La Belle Vie Éternelle - Admin Dashboard
              </h1>
            </div>
            <button
              onClick={logout}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 text-green-600">📈</div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Today&apos;s Orders</h3>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 text-blue-600">💰</div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Today&apos;s Revenue</h3>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="w-6 h-6 text-yellow-600">📦</div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Pending Shipments</h3>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">📋 Recent Orders</h2>
              <a 
                href="https://dashboard.stripe.com/payments" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200 text-sm"
              >
                View All in Stripe
              </a>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading orders...</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-gray-500 text-lg mb-2">No orders yet!</p>
                <p className="text-gray-400 text-sm mb-4">
                  When customers make purchases, they&apos;ll appear here and you&apos;ll receive email notifications.
                </p>
                <p className="text-gray-600 text-sm">
                  Email notifications will be sent to: <strong>admin@lbve.ca</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">🔗 Quick Links</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a 
                href="https://dashboard.stripe.com/payments" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition duration-200"
              >
                <div className="text-2xl mr-3">💳</div>
                <div>
                  <div className="font-medium text-indigo-900">Stripe Payments</div>
                  <div className="text-sm text-indigo-600">View all transactions</div>
                </div>
              </a>
              
              <a 
                href="https://dashboard.stripe.com/products" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-200"
              >
                <div className="text-2xl mr-3">📦</div>
                <div>
                  <div className="font-medium text-green-900">Products</div>
                  <div className="text-sm text-green-600">Manage inventory</div>
                </div>
              </a>
              
              <a 
                href="https://dashboard.stripe.com/customers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-200"
              >
                <div className="text-2xl mr-3">👥</div>
                <div>
                  <div className="font-medium text-blue-900">Customers</div>
                  <div className="text-sm text-blue-600">Customer database</div>
                </div>
              </a>
              
              <a 
                href="https://dashboard.stripe.com/webhooks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-200"
              >
                <div className="text-2xl mr-3">🔗</div>
                <div>
                  <div className="font-medium text-purple-900">Webhooks</div>
                  <div className="text-sm text-purple-600">Integration status</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">📊 System Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Email Notifications</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Active (Console Mode)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Stripe Integration</span>
                </div>
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="text-gray-700">Webhook Endpoint</span>
                </div>
                <span className="text-sm text-yellow-600 font-medium">Configure Required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-4">⚙️ Setup Instructions</h3>
            <div className="space-y-3 text-sm text-yellow-700">
              <div className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <div>
                  <strong>Configure Stripe Webhook:</strong> Add{' '}
                  <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                    https://lebve.netlify.app/.netlify/functions/stripe-webhook
                  </code>{' '}
                  as an endpoint in your Stripe dashboard
                </div>
              </div>
              <div className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                <div>
                  <strong>Add Environment Variables:</strong> Set up{' '}
                  <code className="bg-yellow-100 px-2 py-1 rounded text-xs">STRIPE_WEBHOOK_SECRET</code>,{' '}
                  <code className="bg-yellow-100 px-2 py-1 rounded text-xs">ADMIN_EMAIL</code>, and{' '}
                  <code className="bg-yellow-100 px-2 py-1 rounded text-xs">EMAIL_PROVIDER=console</code> in Netlify
                </div>
              </div>
              <div className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                <div>
                  <strong>Test the System:</strong> Make a test purchase to see email notifications in Netlify Function logs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}