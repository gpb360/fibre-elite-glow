"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Package, 
  Search, 
  Heart, 
  Star, 
  Users, 
  FileText, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  secondaryAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Icon className="h-16 w-16 text-gray-300 mb-6" />
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          action.href ? (
            <Link href={action.href}>
              <Button className="flex items-center space-x-2">
                <span>{action.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button onClick={action.onClick} className="flex items-center space-x-2">
              <span>{action.label}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )
        )}
        
        {secondaryAction && (
          secondaryAction.href ? (
            <Link href={secondaryAction.href}>
              <Button variant="outline">{secondaryAction.label}</Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}

// Specific empty states for different contexts
export function EmptyCart() {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Your cart is empty"
      description="Looks like you haven't added any items to your cart yet. Start shopping to find great products!"
      action={{
        label: "Start Shopping",
        href: "/products"
      }}
      secondaryAction={{
        label: "View Bestsellers",
        href: "/products?featured=true"
      }}
    />
  );
}

export function EmptyWishlist() {
  return (
    <EmptyState
      icon={Heart}
      title="No favorites yet"
      description="Save items you love to your wishlist. They'll appear here so you can easily find them later."
      action={{
        label: "Browse Products",
        href: "/products"
      }}
    />
  );
}

export function EmptySearchResults({ query }: { query?: string }) {
  return (
    <div className="text-center py-16">
      <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {query ? `No results for "${query}"` : 'No results found'}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        We couldn't find any products matching your search. Try adjusting your filters or search terms.
      </p>
      
      <div className="space-y-4">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Try searching for:</span>
          {['Total Essential', 'Fiber Supplement', 'Digestive Health', 'Natural'].map((suggestion) => (
            <Link
              key={suggestion}
              href={`/products?search=${encodeURIComponent(suggestion)}`}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
            >
              {suggestion}
            </Link>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function EmptyOrders() {
  return (
    <EmptyState
      icon={Package}
      title="No orders yet"
      description="You haven't placed any orders yet. Once you do, they'll appear here so you can track their progress."
      action={{
        label: "Start Shopping",
        href: "/products"
      }}
      secondaryAction={{
        label: "View Cart",
        href: "/cart"
      }}
    />
  );
}

export function EmptyTestimonials() {
  return (
    <EmptyState
      icon={Star}
      title="No reviews yet"
      description="Be the first to share your experience with this product. Your feedback helps other customers make informed decisions."
      action={{
        label: "Write a Review",
        href: "/testimonials/new"
      }}
    />
  );
}

export function EmptyIngredients() {
  return (
    <EmptyState
      icon={FileText}
      title="No ingredients information"
      description="Ingredient details are being updated. Please check back soon or contact us for more information."
      action={{
        label: "Contact Support",
        href: "/contact"
      }}
      secondaryAction={{
        label: "View Products",
        href: "/products"
      }}
    />
  );
}

// Product grid empty state with featured alternatives
export function EmptyProductGrid({ 
  category, 
  showAlternatives = true 
}: { 
  category?: string;
  showAlternatives?: boolean;
}) {
  return (
    <div className="text-center py-16">
      <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {category ? `No products in ${category}` : 'No products available'}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {category 
          ? `We don't have any products in the ${category} category right now. Check out our other categories or featured products.`
          : 'We are updating our product catalog. Please check back soon for new arrivals.'
        }
      </p>
      
      {showAlternatives && (
        <div className="max-w-4xl mx-auto">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">You might also like</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">Total Essential</h5>
                    <p className="text-sm text-gray-600">Premium fiber supplement</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Plus className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">Total Essential Plus</h5>
                    <p className="text-sm text-gray-600">Advanced formula with extras</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/products">
          <Button>View All Products</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">Get Notified</Button>
        </Link>
      </div>
    </div>
  );
}

// Data missing fallback with contextual help
export function MissingDataFallback({ 
  type = 'content',
  context,
  showSupport = true 
}: { 
  type?: 'content' | 'image' | 'data' | 'connection';
  context?: string;
  showSupport?: boolean;
}) {
  const fallbacks = {
    content: {
      icon: FileText,
      title: 'Content not available',
      description: 'This content is temporarily unavailable. Please try refreshing the page or check back later.'
    },
    image: {
      icon: Package,
      title: 'Image not available',
      description: 'The image could not be loaded. This might be due to a temporary connection issue.'
    },
    data: {
      icon: AlertCircle,
      title: 'Data not available',
      description: 'The requested information is currently unavailable. Please try again in a moment.'
    },
    connection: {
      icon: AlertCircle,
      title: 'Connection issue',
      description: 'Unable to connect to our servers. Please check your internet connection and try again.'
    }
  };

  const config = fallbacks[type];

  return (
    <div className="text-center py-8 px-4">
      <config.icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{config.title}</h4>
      <p className="text-gray-600 mb-4 max-w-md mx-auto">
        {config.description}
        {context && ` (${context})`}
      </p>
      
      {showSupport && (
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
          <Link href="/contact">
            <Button variant="outline" size="sm">Contact Support</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// Network error fallback with offline detection
export function NetworkErrorFallback({ 
  retry, 
  isOnline = true 
}: { 
  retry?: () => void;
  isOnline?: boolean;
}) {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {isOnline ? 'Connection Error' : 'You\'re Offline'}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {isOnline 
            ? 'We\'re having trouble connecting to our servers. Please check your connection and try again.'
            : 'It looks like you\'re offline. Some features may not be available until your connection is restored.'
          }
        </p>
        
        <div className="space-y-3">
          {retry && (
            <Button onClick={retry} className="w-full sm:w-auto">
              Try Again
            </Button>
          )}
          
          {!isOnline && (
            <p className="text-sm text-gray-500">
              We'll automatically retry when your connection is restored.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Image fallback component
export function ImageFallback({ 
  width = 400,
  height = 300,
  alt = 'Image not available',
  className = ''
}: {
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}) {
  return (
    <div 
      className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
      style={{ width, height }}
    >
      <div className="text-center p-4">
        <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">{alt}</p>
      </div>
    </div>
  );
}

// Comprehensive fallback provider
export function FallbackProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}