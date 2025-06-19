
import React from 'react';
import { motion } from 'framer-motion';
import { Heading } from '@/components/ui/heading';
import { ProductCard } from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function ProductShowcase() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container px-4 md:px-6">
        <Heading
          title="Our Premium Products"
          description="Choose the perfect fiber supplement for your health needs."
          centered
          className="mb-12"
        />

        <motion.div 
          className="grid gap-6 sm:grid-cols-2 lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ProductCard
            variant="green"
            image="/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png"
            title="Total Essential"
            price="$79.99"
            description="PREMIUM 1-BOX DETOX & WELLNESS PROGRAM - Transform your digestive health with our scientifically formulated blend of 100% natural ingredients. 15 sachets per box."
            badge="Best Seller"
            productId="total-essential-base"
            productType="total_essential"
            originalPrice="$89.99"
            savings={10}
          />

          <ProductCard
            variant="purple"
            image="/lovable-uploads/5f8f72e3-397f-47a4-8bce-f15924c32a34.png"
            title="Total Essential Plus"
            price="$84.99"
            description="ADVANCED 1-BOX BEAUTY & WELLNESS PROGRAM - Enhanced formula with superfruits for superior antioxidant protection and radiant skin health. 15 sachets per box."
            badge="New"
            productId="total-essential-plus-base"
            productType="total_essential_plus"
            originalPrice="$94.99"
            savings={10}
          />
        </motion.div>
        
        <div className="flex justify-center gap-8 mt-8">
          <Link to="/products/total-essential">
            <Button variant="premium" size="lg">
              View Packages
            </Button>
          </Link>
          <Link to="/products/total-essential-plus">
            <Button variant="premium2" size="lg">
              View Packages
            </Button>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Compare Our Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left font-medium text-gray-700">Feature</th>
                  <th className="p-3 text-center font-medium text-green-700">Total Essential</th>
                  <th className="p-3 text-center font-medium text-purple-700">Total Essential Plus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3 text-left">Servings per Box</td>
                  <td className="p-3 text-center">15 sachets</td>
                  <td className="p-3 text-center">15 sachets</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 text-left">Fruits & Vegetables</td>
                  <td className="p-3 text-center">12 varieties</td>
                  <td className="p-3 text-center">18 varieties (plus berries)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 text-left">Superfruits (Acai, Strawberry, etc.)</td>
                  <td className="p-3 text-center">
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
                  <td className="p-3 text-center">
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
                <tr className="border-b border-gray-100">
                  <td className="p-3 text-left">Prebiotics (Oligosaccharides)</td>
                  <td className="p-3 text-center">
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
                  <td className="p-3 text-center">
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
                <tr className="border-b border-gray-100">
                  <td className="p-3 text-left">Gluten Free</td>
                  <td className="p-3 text-center">
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
                  <td className="p-3 text-center">
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
