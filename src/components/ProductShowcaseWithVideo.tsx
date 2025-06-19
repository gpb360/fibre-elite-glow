import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heading } from '@/components/ui/heading';
import { ProductCard } from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { VideoShowcase } from '@/components/ui/video-showcase';
import { useMarketingVideos } from '@/hooks/useMarketingVideos';
import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';

export function ProductShowcaseWithVideo() {
  const { ingredientsVideo, resultsVideo, loading } = useMarketingVideos();
  const [activeTab, setActiveTab] = useState<'products' | 'videos'>('products');

  const showcaseVideos = [
    ...(ingredientsVideo ? [{
      id: ingredientsVideo.id,
      title: ingredientsVideo.title,
      description: ingredientsVideo.description || 'Discover the natural ingredients that make Total Essential so effective',
      src: ingredientsVideo.src,
      poster: ingredientsVideo.poster,
      badge: 'Ingredients',
      duration: ingredientsVideo.duration
    }] : []),
    ...(resultsVideo ? [{
      id: resultsVideo.id,
      title: resultsVideo.title,
      description: resultsVideo.description || 'See the amazing results customers achieve with Total Essential',
      src: resultsVideo.src,
      poster: resultsVideo.poster,
      badge: 'Results',
      duration: resultsVideo.duration
    }] : [])
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container px-4 md:px-6">
        <Heading
          title="Our Premium Products"
          description="Choose the perfect fiber supplement for your health needs."
          centered
          className="mb-8"
        />

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('products')}
              className="rounded-md"
            >
              <Eye className="h-4 w-4 mr-2" />
              Products
            </Button>
            <Button
              variant={activeTab === 'videos' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('videos')}
              className="rounded-md"
            >
              <Play className="h-4 w-4 mr-2" />
              Product Videos
            </Button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:gap-12 mb-8">
              <ProductCard
                variant="green"
                image="/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png"
                title="Total Essential"
                price="$79.99"
                description="PREMIUM 15-DAY DETOX & WELLNESS PROGRAM - Transform your digestive health with our scientifically formulated blend of 100% natural ingredients."
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
                description="ADVANCED 15-DAY BEAUTY & WELLNESS PROGRAM - Enhanced formula with superfruits for superior antioxidant protection and radiant skin health."
                badge="New"
                productId="total-essential-plus-base"
                productType="total_essential_plus"
                originalPrice="$94.99"
                savings={10}
              />
            </div>
            
            <div className="flex justify-center gap-8">
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
          </motion.div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {showcaseVideos.length > 0 ? (
              <VideoShowcase
                videos={showcaseVideos}
                layout="grid"
                showTitles={true}
                className="mb-8"
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Product videos are loading...</p>
                </div>
              </div>
            )}
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setActiveTab('products')}
                size="lg"
              >
                View Product Details
              </Button>
            </div>
          </motion.div>
        )}

        {/* Comparison Table */}
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
                  <td className="p-3 text-left">Antioxidant Power</td>
                  <td className="p-3 text-center">High</td>
                  <td className="p-3 text-center">Ultra High</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 text-left">Beauty Benefits</td>
                  <td className="p-3 text-center">Basic</td>
                  <td className="p-3 text-center">Advanced</td>
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

export default ProductShowcaseWithVideo;
