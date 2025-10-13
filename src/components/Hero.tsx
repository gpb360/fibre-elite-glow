"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Client-side only component to prevent hydration mismatch
function ClientSideOnly({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return children without animation during SSR
    return <>{children}</>;
  }

  return <>{children}</>;
}

export function Hero() {
  return (
    <section className="relative bg-green-50 pt-10 pb-10 md:pt-20 md:pb-20 overflow-hidden">
      {/* Background image for high-end feel */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/lovable-uploads/webp/fruit-veg-bottle.webp"
          alt="Natural fiber supplement bottles surrounded by fresh fruits and vegetables - Fibre Elite Glow wellness products"
          fill
          className="object-cover"
          priority={true}
        />
      </div>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center min-h-[500px]">
          <div className="flex flex-col justify-center space-y-8 text-left">
            <div className="space-y-6">
              {/* Static content for SSR */}
              <div className="opacity-100">
                <p className="text-green-500 font-medium text-base mb-2">Natural Balance for Daily Wellness</p>
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
                  Restore&nbsp;Your&nbsp;Body&apos;s&nbsp;Natural&nbsp;Rhythm
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  Our plant-based fiber blend supports your body&apos;s natural rhythm
                </p>
              </div>
              {/* Animated version for client */}
              <ClientSideOnly>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <p className="text-green-500 font-medium text-base mb-2">Natural Balance for Daily Wellness</p>
                  <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
                    Restore&nbsp;Your&nbsp;Body&apos;s&nbsp;Natural&nbsp;Rhythm
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                    Our plant-based fiber blend supports your body&apos;s natural rhythm
                  </p>
                </motion.div>
              </ClientSideOnly>
            </div>

            {/* Static buttons for SSR */}
            <div className="flex flex-row gap-4 relative">
              <Link
                href="/products/total-essential"
                className={cn(buttonVariants({ size: "lg" }), "bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium relative z-20")}
              >
                Total Essential
              </Link>
              <Link
                href="/products/total-essential-plus"
                className={cn(buttonVariants({ size: "lg", variant: "premium2" }), "relative z-10")}
              >
                Total Essential Plus
              </Link>
            </div>
            {/* Animated buttons for client */}
            <ClientSideOnly>
              <motion.div
                className="flex flex-row gap-4 absolute"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  href="/products/total-essential"
                  className={cn(buttonVariants({ size: "lg" }), "bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium relative z-20")}
                >
                  Total Essential
                </Link>
                <Link
                  href="/products/total-essential-plus"
                  className={cn(buttonVariants({ size: "lg", variant: "premium2" }), "relative z-10")}
                >
                  Total Essential Plus
                </Link>
              </motion.div>
            </ClientSideOnly>

            {/* Static features for SSR */}
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Non-GMO Ingredients</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Gluten Free</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">100% Natural</span>
              </div>
            </div>
            {/* Animated features for client */}
            <ClientSideOnly>
              <motion.div
                className="flex flex-col gap-3 text-sm text-gray-600 absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-3 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Non-GMO Ingredients</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-3 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Gluten Free</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-3 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">100% Natural</span>
                </div>
              </motion.div>
            </ClientSideOnly>
          </div>

          {/* Static image for SSR */}
          <div className="flex items-center justify-center lg:justify-end relative">
            <div className="relative">
              <Image
                alt="Total Essential Product Box - Premium fiber supplement for gut health and digestive wellness"
                className="aspect-square rounded-xl object-cover object-center hover:scale-105 transition-transform duration-300 shadow-2xl"
                src="/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp"
                width={600}
                height={600}
                priority={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>
          {/* Animated image for client */}
          <ClientSideOnly>
            <motion.div
              className="flex items-center justify-center lg:justify-end absolute"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <Image
                  alt="Total Essential Product Box - Premium fiber supplement for gut health and digestive wellness"
                  className="aspect-square rounded-xl object-cover object-center hover:scale-105 transition-transform duration-300 shadow-2xl"
                  src="/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp"
                  width={600}
                  height={600}
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
            </motion.div>
          </ClientSideOnly>
        </div>
      </div>
    </section>
  );
}

export default Hero;
