'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart, MessageSquare, Users, Shield, LogOut, Home, ExternalLink,
} from 'lucide-react';
import AdminOrdersPanel from '@/components/admin/AdminOrdersPanel';
import AdminTestimonialsPanel from '@/components/admin/AdminTestimonialsPanel';
import AdminAffiliatesPanel from '@/components/admin/AdminAffiliatesPanel';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  const handleAuth = async () => {
    setAuthenticating(true);
    setAuthError('');

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setAuthError(
          response.status === 503
            ? 'Admin access has not been configured for this deployment.'
            : body.error || 'Invalid password'
        );
        return;
      }

      setPassword('');
      setAuthenticated(true);
    } catch {
      setAuthError('Unable to verify admin access. Please try again.');
    } finally {
      setAuthenticating(false);
    }
  };

  useEffect(() => {
    let active = true;

    fetch('/api/admin/session', { credentials: 'same-origin' })
      .then(response => (response.ok ? response.json() : { authenticated: false }))
      .then(body => {
        if (active) setAuthenticated(body.authenticated === true);
      })
      .catch(() => {
        if (active) setAuthenticated(false);
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/admin/session', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
    } finally {
      setAuthenticated(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Verifying admin session…</p>
      </div>
    );
  }

  /* ─── Login Gate ─── */
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-green-600 mr-2" />
            <h2 className="text-2xl font-bold text-green-600">Admin Access</h2>
          </div>
          <div className="mb-4">
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && void handleAuth()}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter admin password"
            />
          </div>
          {authError && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {authError}
            </p>
          )}
          <button
            onClick={() => void handleAuth()}
            disabled={authenticating || password.length === 0}
            className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {authenticating ? 'Verifying…' : 'Access Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  /* ─── Authenticated Dashboard ─── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
                <Home className="h-4 w-4" /> Store
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">La Belle Vie Éternelle</h1>
                  <p className="text-xs text-gray-500 leading-tight">Admin Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-3 w-3 mr-1" /> Stripe
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={() => void logout()} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Testimonials</span>
            </TabsTrigger>
            <TabsTrigger value="affiliates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Affiliates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <AdminOrdersPanel />
          </TabsContent>

          <TabsContent value="testimonials">
            <AdminTestimonialsPanel />
          </TabsContent>

          <TabsContent value="affiliates">
            <AdminAffiliatesPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
