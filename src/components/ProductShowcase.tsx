
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heading } from '@/components/ui/heading';
import { ProductCard } from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ProductShowcase() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <Heading
          title="Our Fiber Blend Collection"
          description="Choose the perfect natural fiber blend for your daily wellness routine"
          centered
          className="mb-16"
        />

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ProductCard
            variant="green"
            image="/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp"
            title="Total Essential"
            price="$79.99"
            description="PREMIUM DAILY FIBER BLEND – Crafted from 100% fruit & vegetable fibers for gentle, natural regularity. 15 sachets per box."
            badge="Best Seller"
            productId="total-essential-base"
            productType="total_essential"
            originalPrice="$89.99"
            savings={10}
            priority={true}
          />

          <ProductCard
            variant="purple"
            image="/lovable-uploads/webp/5f8f72e3-397f-47a4-8bce-f15924c32a34.webp"
            title="Total Essential Plus"
            price="$84.99"
            description="ADVANCED DAILY FIBER BLEND – Enhanced with super-fruits for added antioxidants and a vibrant glow. 15 sachets per box."
            badge="New"
            productId="total-essential-plus-base"
            productType="total_essential_plus"
            originalPrice="$94.99"
            savings={10}
            priority={true}
          />
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
          <Link href="/products/total-essential">
            <Button variant="premium" size="lg" className="w-full sm:w-auto px-8">
              View Packages
            </Button>
          </Link>
          <Link href="/products/total-essential-plus">
            <Button variant="premium2" size="lg" className="w-full sm:w-auto px-8">
              View Packages
            </Button>
          </Link>
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8 text-gray-900">Compare Our Products</h3>
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700 border-b">Feature</th>
                  <th className="p-4 text-center font-semibold text-green-700 border-b">Total Essential</th>
                  <th className="p-4 text-center font-semibold text-purple-700 border-b">Total Essential Plus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-left font-medium">Servings</td>
                  <td className="p-4 text-center">15 sachets</td>
                  <td className="p-4 text-center">15 sachets</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-left font-medium">Fruits & Vegetables</td>
                  <td className="p-4 text-center">14 varieties</td>
                  <td className="p-4 text-center">18 varieties</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-left font-medium">Superfruits (Acai, Strawberry, etc.)</td>
                  <td className="p-4 text-center">
                    <svg
                      className="h-5 w-5 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      className="h-5 w-5 mx-auto text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-left font-medium">Prebiotics (Oligosaccharides)</td>
                  <td className="p-4 text-center">
                    <svg
                      className="h-5 w-5 mx-auto text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      className="h-5 w-5 mx-auto text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 text-left font-medium">Gluten Free</td>
                  <td className="p-4 text-center">
                    <svg
                      className="h-5 w-5 mx-auto text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </td>
                  <td className="p-4 text-center">
                    <svg
                      className="h-5 w-5 mx-auto text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductShowcase;
