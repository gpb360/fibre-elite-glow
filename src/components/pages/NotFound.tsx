
"use client";

import React from 'react';
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from "next/navigation";
import { 
  Home, 
  Search, 
  ShoppingBag, 
  MessageCircle, 
  ArrowLeft, 
  ExternalLink,
  Clock,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/error';

const NotFound = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Log 404 errors for monitoring
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
      {
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString(),
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      }
    );

    // Show suggestions after a brief delay
    const timer = setTimeout(() => setShowSuggestions(true), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Smart suggestions based on the attempted URL
  const getSmartSuggestions = () => {
    const path = pathname.toLowerCase();
    const suggestions = [];

    if (path.includes('product') || path.includes('shop')) {
      suggestions.push({ href: "/products", label: "Browse Products", icon: ShoppingBag });
    }
    if (path.includes('about') || path.includes('contact')) {
      suggestions.push({ href: "/contact", label: "Contact Us", icon: MessageCircle });
    }
    if (path.includes('help') || path.includes('faq')) {
      suggestions.push({ href: "/faq", label: "Help Center", icon: MessageCircle });
    }
    if (path.includes('benefit') || path.includes('health')) {
      suggestions.push({ href: "/benefits", label: "Health Benefits", icon: Star });
    }

    // Always include popular pages
    const popularPages = [
      { href: "/products", label: "Shop Products", icon: ShoppingBag },
      { href: "/benefits", label: "Health Benefits", icon: Star },
      { href: "/testimonials", label: "Customer Reviews", icon: Star },
      { href: "/faq", label: "Help Center", icon: MessageCircle },
    ];

    // Merge suggestions with popular pages, removing duplicates
    const allSuggestions = [...suggestions];
    popularPages.forEach(page => {
      if (!allSuggestions.find(s => s.href === page.href)) {
        allSuggestions.push(page);
      }
    });

    return allSuggestions.slice(0, 4); // Limit to 4 suggestions
  };

  const smartSuggestions = getSmartSuggestions();

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('404 Page Error:', error, errorInfo);
      }}
    >
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-24" data-testid="not-found-main">
          <div className="text-center px-4 md:px-6 max-w-4xl mx-auto">
            {/* Main 404 Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h1 className="text-8xl md:text-9xl font-bold text-green-500 mb-4" data-testid="error-code">
                404
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Oops! Page not found
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                We couldn't find the page you're looking for at <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{pathname}</span>. 
                It might have been moved, deleted, or you might have mistyped the URL.
              </p>
            </motion.div>

            {/* Primary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button variant="premium" size="lg" asChild className="flex items-center">
                <Link href="/" data-testid="home-button">
                  <Home className="h-5 w-5 mr-2" />
                  Return to Home
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.back()} className="flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
            </motion.div>

            {/* Smart Suggestions */}
            {showSuggestions && smartSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  {pathname.includes('product') || pathname.includes('shop') ? 
                    'Looking for products?' : 
                    'Try these popular pages:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {smartSuggestions.map((suggestion, index) => {
                    const IconComponent = suggestion.icon;
                    return (
                      <motion.div
                        key={suggestion.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                      >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                          <Link href={suggestion.href}>
                            <CardContent className="p-6 text-center">
                              <IconComponent className="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                              <p className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                                {suggestion.label}
                              </p>
                            </CardContent>
                          </Link>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Can't find what you're looking for?
              </h3>
              <form
                className="flex max-w-md mx-auto gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!query.trim()) return;
                  const internalSearchUrl = `/search?query=${encodeURIComponent(
                    query.trim()
                  )}`;
                  router.push(internalSearchUrl);
                }}
                data-testid="search-form"
              >
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search our site..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    data-testid="search-input"
                  />
                </div>
                <Button type="submit" size="lg" variant="outline" className="px-6">
                  Search
                </Button>
              </form>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="border-t pt-8"
            >
              <h4 className="text-md font-medium text-gray-700 mb-4">
                Quick Links
              </h4>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { href: "/products/total-essential", label: "Total Essential" },
                  { href: "/products/total-essential-plus", label: "Total Essential Plus" },
                  { href: "/contact", label: "Contact Support" },
                  { href: "/about", label: "About Us" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors flex items-center"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Additional Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 inline mr-1" />
                If you continue to experience issues, please contact our support team.
              </p>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/contact" className="text-green-600 hover:text-green-800">
                  Contact Support →
                </Link>
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default NotFound;
