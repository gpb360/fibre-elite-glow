
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
            image="public/lovable-uploads/fb7a9d0d-db3d-4355-84f4-c2fe54d78968.png"
            title="Total Essential"
            price="$55.00"
            description={`15 DAY FRUITS AND VEGETABLE FIBER DRINK\n\nTotal Essential is formulated with 100% natural fruit and vegetable extracts mixed with oat bran and palm tree trunk fiber. This balanced blend of top-grade soluble and insoluble fiber helps normalize bowel movements, supports heart health, blood sugar control, aids in weight management, and more. Certified non-GMO and gluten-free, with ingredients like broccoli, spinach, apple fiber, oat bran fiber, carrot, celery, papaya, and aloe vera. Ideal for anyone seeking well-being with a convenient once-daily sachet.`}
            badge="Best Seller"
          />
          
          <ProductCard
            variant="purple"
            image="public/lovable-uploads/655c5d55-e25f-4ffc-9457-0d10361ff0a9.png"
            title="Total Essential Plus"
            price="$60.00"
            description={`15 DAY FRUITS AND VEGETABLE FIBER DRINK\n\nTotal Essential Plus features all the benefits of the original formula plus added Acai berry, Strawberry, Cranberry, and Raspberry to boost skin health and flavor. Combining powerful natural fibers—soluble and insoluble—from premium fruits and vegetables, PLUS is a great choice for those looking for improved skin, better digestion, and greater vitality. Certified non-GMO, gluten-free, and packed with nourishing plant-based ingredients for visible results.`}
            badge="New"
          />
        </motion.div>
        
        <div className="flex justify-center gap-8 mt-8">
          <Link to="/products/total-essential">
            <Button variant="premium" size="lg">
              Read More
            </Button>
          </Link>
          <Link to="/products/total-essential-plus">
            <Button variant="premium2" size="lg">
              Read More
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
                  <td className="p-3 text-left">Servings</td>
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
                  <td className="p-3 text-left">Probiotics</td>
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
