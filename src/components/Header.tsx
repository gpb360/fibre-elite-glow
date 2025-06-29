
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import SignIn from './SignIn';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = React.useState(false);
  const [isSignInOpen, setIsSignInOpen] = React.useState(false);
  const { cart } = useCart();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-green-600 hover:text-green-700 transition-colors">La Belle Vie</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-sm font-semibold text-gray-700 transition-colors hover:text-green-600">
            Home
          </Link>
          <div className="relative">
            <button
              className="flex items-center text-sm font-semibold text-gray-700 transition-colors hover:text-green-600"
              onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
            >
              Products
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            
            {isProductMenuOpen && (
              <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsProductMenuOpen(false)}
                  >
                    All Products
                  </Link>
                  <Link
                    href="/products/total-essential"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsProductMenuOpen(false)}
                  >
                    Total Essential
                  </Link>
                  <Link
                    href="/products/total-essential-plus"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsProductMenuOpen(false)}
                  >
                    Total Essential Plus
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/benefits" className="text-sm font-semibold text-gray-700 transition-colors hover:text-green-600">
            Benefits
          </Link>
          <Link href="/testimonials" className="text-sm font-semibold text-gray-700 transition-colors hover:text-green-600">
            Testimonials
          </Link>
          <Link href="/faq" className="text-sm font-semibold text-gray-700 transition-colors hover:text-green-600">
            FAQ
          </Link>
        </nav>
        
        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        
        {/* Cart and action buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/cart" className="relative text-gray-700 hover:text-green-600 transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {cart.totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white font-medium">
                {cart.totalItems > 99 ? '99+' : cart.totalItems}
              </span>
            )}
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600"
            onClick={() => setIsSignInOpen(true)}
          >
            Sign In
          </Button>
          <Link href="/products">
            <Button variant="premium" size="sm" className="px-6">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/"
              className="block py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <div>
              <button
                className="flex w-full items-center justify-between py-2 text-base font-medium"
                onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
              >
                Products
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isProductMenuOpen && (
                <div className="pl-4 space-y-1">
                  <Link
                    href="/products"
                    className="block py-2 text-sm"
                    onClick={() => {
                      setIsProductMenuOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    All Products
                  </Link>
                  <Link
                    href="/products/total-essential"
                    className="block py-2 text-sm"
                    onClick={() => {
                      setIsProductMenuOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    Total Essential
                  </Link>
                  <Link
                    href="/products/total-essential-plus"
                    className="block py-2 text-sm"
                    onClick={() => {
                      setIsProductMenuOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    Total Essential Plus
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/benefits"
              className="block py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </Link>
            <Link
              href="/testimonials"
              className="block py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/faq"
              className="block py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="mt-4 flex items-center gap-4">
              <Link href="/cart" className="relative hover:text-green-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cart.totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white font-medium">
                    {cart.totalItems > 99 ? '99+' : cart.totalItems}
                  </span>
                )}
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSignInOpen(true);
                }}
              >
                Sign In
              </Button>
              <Link href="/products">
                <Button variant="premium" size="sm">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Sign In Dialog */}
      <SignIn 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />
    </header>
  );
}

export default Header;
