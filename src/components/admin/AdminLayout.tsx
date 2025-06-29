import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { 
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Home,
  Image,
  Truck,
  AlertCircle
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  permission?: string;
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin',
  },
  {
    icon: Package,
    label: 'Products',
    href: '/admin/products',
    permission: 'manage_products',
  },
  {
    icon: Image,
    label: 'Images',
    href: '/admin/images',
    permission: 'manage_products',
  },
  {
    icon: ShoppingCart,
    label: 'Orders',
    href: '/admin/orders',
    permission: 'manage_orders',
    badge: 'new',
  },
  {
    icon: Users,
    label: 'Customers',
    href: '/admin/customers',
    permission: 'manage_customers',
  },
  {
    icon: Truck,
    label: 'Inventory',
    href: '/admin/inventory',
    permission: 'manage_inventory',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    href: '/admin/analytics',
    permission: 'view_analytics',
  },
  {
    icon: Bell,
    label: 'Notifications',
    href: '/admin/notifications',
    permission: 'manage_notifications',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/admin/settings',
    permission: 'manage_settings',
  },
];

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const { isAdmin, adminRole, hasPermission, isSuperAdmin } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const filteredNavItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission) || isSuperAdmin()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fibre Elite Glow</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-gray-600 capitalize">
                      {adminRole?.role?.replace('_', ' ') || 'Admin'}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleNavigation('/')}>
                  <Home className="w-4 h-4 mr-2" />
                  View Website
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            {/* Admin Role Badge */}
            <div className="p-4 border-b border-gray-200">
              <Badge 
                variant={isSuperAdmin() ? "default" : "secondary"}
                className="w-full justify-center"
              >
                <Shield className="w-3 h-3 mr-1" />
                {isSuperAdmin() ? 'Super Admin' : 'Admin'}
              </Badge>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="destructive" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                <p>Fibre Elite Glow Admin</p>
                <p>Version 1.0.0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {/* Page Header */}
            {(title || subtitle) && (
              <div className="mb-6">
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
            )}

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Quick Stats Component for Dashboard
export function AdminStats() {
  const stats = [
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
    },
    {
      title: 'Active Customers',
      value: '856',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Products',
      value: '24',
      change: '+2',
      changeType: 'positive' as const,
      icon: Package,
    },
    {
      title: 'Pending Issues',
      value: '3',
      change: '-1',
      changeType: 'negative' as const,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AdminLayout;
