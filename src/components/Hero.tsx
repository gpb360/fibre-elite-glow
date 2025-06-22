"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative bg-white pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      {/* Background image for high-end feel */}
      <img
        src="/images/fruit-veg-bottle.jpg"
        alt="Assorted fruits and vegetables in a glass bottle"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
      />

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center min-h-[500px]">
          <div className="flex flex-col justify-center space-y-8 text-left">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-green-500 font-medium text-base mb-2">La Belle Vie</p>
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
                  Restore&nbsp;Your&nbsp;Body's&nbsp;Natural&nbsp;Rhythm
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  Pure plant fiber for natural daily wellness
                </p>
              </motion.div>
            </div>
            <motion.div
              className="flex flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium"
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-gray-400 px-6 py-3 rounded-md font-medium"
              >
                Learn More
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3 text-sm text-gray-600"
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
          </div>
          <motion.div
            className="flex items-center justify-center lg:justify-end relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Main product image */}
              <img
                alt="Total Essential Product Box"
                className="w-full h-auto max-w-md object-contain"
                src="/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png"
                width={400}
                height={400}
              />

              {/* NEW badge positioned like in original */}
              <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                <span className="text-xs font-bold">NEW</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
