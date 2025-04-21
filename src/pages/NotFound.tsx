
import React from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-white py-24">
        <div className="text-center px-4 md:px-6">
          <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>
          <p className="text-2xl text-gray-800 mb-6">Oops! Page not found</p>
          <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
            We couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          <Button variant="premium" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
