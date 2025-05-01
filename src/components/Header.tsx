
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import SignIn from './SignIn';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = React.useState(false);
  const [isSignInOpen, setIsSignInOpen] = React.useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-green-500">La Belle Vie</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <div className="relative">
            <button 
              className="flex items-center text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
            >
              Products
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            
            {isProductMenuOpen && (
              <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    to="/products"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsProductMenuOpen(false)}
                  >
                    All Products
                  </Link>
                  <Link
                    to="/products/total-essential"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setIsProductMenuOpen(false)}
                  >
                    Total Essential
                  </Link>
                  <Link
                    to="/products/total-essential-plus"
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
          <Link to="/benefits" className="text-sm font-medium transition-colors hover:text-primary">
            Benefits
          </Link>
          <Link to="/testimonials" className="text-sm font-medium transition-colors hover:text-primary">
            Testimonials
          </Link>
          <Link to="/faq" className="text-sm font-medium transition-colors hover:text-primary">
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
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              0
            </span>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSignInOpen(true)}
          >
            Sign In
          </Button>
          <Button variant="premium" size="sm">
            Shop Now
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/"
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
                    to="/products"
                    className="block py-2 text-sm"
                    onClick={() => {
                      setIsProductMenuOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    All Products
                  </Link>
                  <Link
                    to="/products/total-essential"
                    className="block py-2 text-sm"
                    onClick={() => {
                      setIsProductMenuOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    Total Essential
                  </Link>
                  <Link
                    to="/products/total-essential-plus"
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
              to="/benefits"
              className="block py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </Link>
            <Link
              to="/testimonials"
              className="block py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              to="/faq"
              className="block py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="mt-4 flex items-center gap-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                  0
                </span>
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
              <Button variant="premium" size="sm">
                Shop Now
              </Button>
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
