
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
            price="Starting at $79.99"
            description={`PREMIUM 15-DAY DETOX & WELLNESS PROGRAM\n\nTransform your digestive health with our scientifically formulated blend of 100% natural fruit and vegetable extracts, premium oat bran, and sustainably sourced palm tree trunk fiber. This expertly balanced combination of soluble and insoluble fiber delivers comprehensive wellness benefits including normalized bowel movements, cardiovascular support, blood sugar regulation, and effective weight management.\n\nCertified Non-GMO and Gluten-Free, featuring nutrient-dense ingredients like organic broccoli, spinach, apple fiber, oat bran fiber, carrot, celery, papaya, and aloe vera. Perfect for health-conscious individuals seeking a convenient, once-daily wellness solution that delivers real results.`}
            badge="Best Seller"
          />
          
          <ProductCard
            variant="purple"
            image="/lovable-uploads/5f8f72e3-397f-47a4-8bce-f15924c32a34.png"
            title="Total Essential Plus"
            price="Starting at $84.99"
            description={`ADVANCED 15-DAY BEAUTY & WELLNESS PROGRAM\n\nElevate your health journey with our enhanced formula featuring all the powerful benefits of Total Essential PLUS four potent superfruits: Açaí Berry, Strawberry, Cranberry, and Raspberry. This premium upgrade delivers superior antioxidant protection, promotes radiant skin health, and offers a deliciously refreshing berry flavor experience.\n\nSpecially formulated for those seeking comprehensive wellness with enhanced beauty benefits, this advanced fiber blend supports clearer skin, improved complexion, and overall vitality. The added superfruit complex provides powerful anti-aging properties while maintaining all the digestive and metabolic benefits of our original formula. Certified Non-GMO and Gluten-Free with premium plant-based ingredients for visible, lasting results.`}
            badge="New"
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
