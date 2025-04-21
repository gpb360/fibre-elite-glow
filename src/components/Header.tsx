
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
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
          <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
            Products
          </Link>
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
          <Button variant="outline" size="sm">
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
            <Link
              to="/products"
              className="block py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
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
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button variant="premium" size="sm">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
