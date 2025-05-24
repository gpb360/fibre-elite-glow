import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { PackageSelector } from '@/components/ui/package-selector';
import { FaqSection } from '@/components/FaqSection';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { usePackages, Package } from '@/hooks/usePackages';

export function ProductEssentialPlus() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { data: packages, isLoading } = usePackages('total_essential_plus');

  // Set default package to the most popular one when data loads
  React.useEffect(() => {
    if (packages && !selectedPackage) {
      const popularPackage = packages.find(pkg => pkg.is_popular) || packages[0];
      setSelectedPackage(popularPackage);
    }
  }, [packages, selectedPackage]);

  const faqData = [
    {
      question: "What's the difference between prebiotics and probiotics?",
      answer: "Prebiotics are food for the good bacteria in your gut, while probiotics are the actual live bacteria. Our Total Essential Plus contains oligosaccharides, which are prebiotics that help feed and nourish your existing beneficial gut bacteria, supporting a healthy digestive system naturally."
    },
    {
      question: "How long should I take Total Essential Plus?",
      answer: "Total Essential Plus is designed as a 15-day program. For best results, take one sachet daily for the full 15 days. Many customers repeat the program monthly or as needed for ongoing digestive health support."
    },
    {
      question: "What makes Total Essential Plus different from the original?",
      answer: "Total Essential Plus contains all the benefits of our original formula plus added superfruits (Acai berry, Strawberry, Cranberry, and Raspberry) that provide additional antioxidants for skin health and a more enjoyable berry flavor."
    },
    {
      question: "Is Total Essential Plus safe for daily use?",
      answer: "Yes, Total Essential Plus is made with 100% natural ingredients and is certified non-GMO and gluten-free. However, as with any supplement, we recommend consulting with your healthcare practitioner before starting any new health program."
    },
    {
      question: "Can I take Total Essential Plus if I have dietary restrictions?",
      answer: "Total Essential Plus is gluten-free and made with natural plant-based ingredients. If you have specific allergies or dietary restrictions, please review the ingredient list and consult with your healthcare provider."
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-50 to-white py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Total Essential Plus
                  </h1>
                  {selectedPackage && (
                    <p className="text-purple-500 text-xl font-semibold">
                      ${selectedPackage.price}
                      {selectedPackage.savings && selectedPackage.savings > 0 && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${selectedPackage.original_price}
                        </span>
                      )}
                    </p>
                  )}
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">(7 customer reviews)</span>
                  </div>
                  <p className="max-w-[600px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    15 DAY FRUITS AND VEGETABLE FIBER DRINK
                  </p>
                </div>
                
                {/* Package Selection */}
                <div className="mt-6">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                  ) : packages && (
                    <PackageSelector
                      packages={packages}
                      selectedPackage={selectedPackage}
                      onSelectPackage={setSelectedPackage}
                      variant="purple"
                    />
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button variant="premium2" size="lg" disabled={!selectedPackage}>
                    Add to Cart - ${selectedPackage?.price || '0.00'}
                  </Button>
                  <Link to="/products">
                    <Button variant="outline" size="lg">
                      Back to Products
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                className="mx-auto flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  alt="Total Essential Plus Product"
                  className="aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  src="/lovable-uploads/5f8f72e3-397f-47a4-8bce-f15924c32a34.png"
                  width={550}
                  height={550}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Product Description */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <Heading
              title="Product Description"
              description="Advanced formula with superfruits for skin health and enhanced flavor"
              className="mb-10"
            />
            <div className="prose max-w-none">
              <p>
                Total Essential Plus features all the benefits of the original formula plus added Acai berry, Strawberry, Cranberry, and Raspberry to boost skin health and flavor. We added berries in this formula to make it taste fruitier and offer good benefits to your skin especially those people with acne problems.
              </p>
              
              <p>
                Combining powerful natural fibers—soluble and insoluble—from premium fruits and vegetables, PLUS is a great choice for those looking for improved skin, better digestion, and greater vitality. Certified non-GMO, gluten-free, and packed with nourishing plant-based ingredients for visible results.
              </p>

              <h3>What are soluble and insoluble fiber?</h3>
              <p>
                <strong>Soluble fiber</strong> dissolves in water and is found mostly in fruits, oat bran etc. It has a gel-like consistency that increase bowel by increasing the volume of bulk in colon.
              </p>
              <p>
                <strong>Insoluble fiber</strong> which doesn't dissolves in water and is found mostly in vegetables. It works like a sponge and it grabs the toxins in our body to eliminate them out to the toilet.
              </p>

              <h3>Why choose Total Essential Plus?</h3>
              <p>
                The PLUS formula includes superfruit berries that not only enhance the flavor but provide additional antioxidants and nutrients that support skin health, making it ideal for those concerned about complexion and overall skin appearance.
              </p>
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        <SplitSection
          image="public/lovable-uploads/d98185ae-142e-45e8-9804-7b3e5aee3680.png"
          imageAlt="Total Essential Plus Ingredients"
          title="Premium Natural Ingredients"
          description="All of the ingredients used in our products are certified non-GMO (non-genetically modified organism) and Gluten Free. We sourced the best ingredients from all over the world to make this product top grade standard."
          className="bg-gray-50"
        >
          <div className="grid grid-cols-2 gap-4 mt-6">
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Broccoli
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apple Fibre
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Oat Bran Fibre
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Oligosaccharide
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Soluble Corn Fiber
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Palm Tree Trunk Fibre
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Spinach
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Papaya
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Carrot
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cabbage
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Parsley
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guar Gum
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Celery
              </li>
              <li className="flex items-center font-semibold">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Acai Berry
              </li>
              <li className="flex items-center font-semibold">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Strawberry
              </li>
              <li className="flex items-center font-semibold">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cranberry
              </li>
              <li className="flex items-center font-semibold">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Raspberry
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Aloe Vera Powder
              </li>
            </ul>
          </div>
        </SplitSection>

        {/* Skin Benefits Section */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <Heading
              title="Skin Health Benefits"
              description="The additional superfruits in Total Essential Plus offer added benefits for your skin"
              centered
              className="mb-12"
            />
            
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Acai Berry</h3>
                <p className="text-gray-600">
                  Packed with antioxidants that help combat premature aging and environmental stressors. Acai berries contain anthocyanins that promote skin cell regeneration and reduce inflammation.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Strawberry</h3>
                <p className="text-gray-600">
                  Rich in alpha-hydroxy acids that help exfoliate skin and vitamin C that promotes collagen production. Strawberries also contain ellagic acid that may prevent collagen destruction and inflammatory responses.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Cranberry</h3>
                <p className="text-gray-600">
                  Contains resveratrol that helps protect the skin from damage. Cranberries are also high in vitamins A and C, which help in skin maintenance and repair processes.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Raspberry</h3>
                <p className="text-gray-600">
                  High in ellagic acid and anthocyanins that protect against UV damage. Raspberries also contain vitamin C and tannins that help reduce inflammation and tighten pores.
                </p>
              </motion.div>
            </div>
            
            <div className="mt-12 text-center">
              <a 
                href="https://www.health.harvard.edu/staying-healthy/foods-for-healthy-skin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-800"
              >
                Learn more about food benefits for skin health from Harvard Health
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Expert Testimonial */}
        <section className="bg-gray-50 py-16">
          <div className="container px-4 md:px-6">
            <blockquote className="relative max-w-3xl mx-auto">
              <svg className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-purple-300" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-xl text-gray-700 italic ml-10 md:ml-16">
                "In our natural health center the TOTAL ESSENTIAL PLUS two week program has become a favourite for improving colon health and regularity. The gentle vegetable, oat & corn bran and the palm trunk fibers are well tolerated by much more people than some of today's popular yet harsh and often irritating herbs used in most colon cleansing formulas."
              </p>
              <footer className="mt-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full bg-purple-100" src="public/placeholder.svg" alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-base font-semibold text-gray-900">Tinesja Vanel</div>
                    <div className="text-sm text-gray-600">Colon Hydro-therapist in North Vancouver</div>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* How to Use Section */}
        <SplitSection
          image="public/lovable-uploads/c159fdf8-1fcc-418f-a95b-70543b77a5ae.png"
          imageAlt="How to use Total Essential Plus"
          title="How to Use"
          description="Total Essential Plus is easy to incorporate into your daily routine."
          reverse
        >
          <div className="space-y-4 mt-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 mr-4">
                <span className="font-bold text-purple-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Mix with Water</h4>
                <p className="text-gray-600">Take one sachet daily. Empty the contents into a glass of water (at least 350ml).</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 mr-4">
                <span className="font-bold text-purple-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">Stir Well</h4>
                <p className="text-gray-600">Stir thoroughly until the powder is completely dissolved.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 mr-4">
                <span className="font-bold text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Drink Immediately</h4>
                <p className="text-gray-600">Consume immediately. Best taken before bedtime or first thing in the morning.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 mr-4">
                <span className="font-bold text-purple-600">4</span>
              </div>
              <div>
                <h4 className="font-medium">Continue for 15 Days</h4>
                <p className="text-gray-600">For best results, use daily for the full 15-day program.</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              <em>This is not intended as medical advice. Consult your health care practitioner before starting any health program.</em>
            </p>
          </div>
        </SplitSection>

        {/* CTA Section */}
        <section className="bg-purple-50 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience Enhanced Benefits Today</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upgrade your health routine with Total Essential Plus for improved digestion and beautiful skin.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="premium2" size="lg">
                Add to Cart
              </Button>
              <Link to="/products/total-essential">
                <Button variant="outline" size="lg">
                  Explore Total Essential
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection faqs={faqData} />
      </main>
      <Footer />
    </>
  );
}

export default ProductEssentialPlus;
