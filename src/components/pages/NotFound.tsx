
"use client";

import React from 'react';
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from "next/navigation";

const NotFound = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

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
            <Link href="/">Return to Home</Link>
          </Button>

          {/* Quick links to popular pages */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[
              { href: "/products", label: "Shop Products" },
              { href: "/benefits", label: "Product Benefits" },
              { href: "/faq", label: "FAQ" },
              { href: "/testimonials", label: "Testimonials" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-green-600 underline-offset-4 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Simple search helper */}
          <form
            className="mt-12 flex max-w-md mx-auto gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!query.trim()) return;
              // Prefer internal search route if implemented, otherwise fall back to Google site search
              const internalSearchUrl = `/search?query=${encodeURIComponent(
                query.trim()
              )}`;
              router.push(internalSearchUrl);
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search our site..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
            <Button type="submit" size="sm" variant="outline">
              Search
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
