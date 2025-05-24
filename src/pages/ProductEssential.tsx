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

export function ProductEssential() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { data: packages, isLoading } = usePackages('total_essential');

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
      answer: "Prebiotics are food for the good bacteria in your gut, while probiotics are the actual live bacteria. Our Total Essential contains oligosaccharides, which are prebiotics that help feed and nourish your existing beneficial gut bacteria, supporting a healthy digestive system naturally."
    },
    {
      question: "How long should I take Total Essential?",
      answer: "Total Essential is designed as a 15-day program. For best results, take one sachet daily for the full 15 days. Many customers repeat the program monthly or as needed for ongoing digestive health support."
    },
    {
      question: "What makes Total Essential effective?",
      answer: "Total Essential combines both soluble and insoluble fiber from premium natural sources. This balanced blend helps normalize bowel movements, supports heart health, aids in blood sugar control, and promotes weight management."
    },
    {
      question: "Is Total Essential safe for daily use?",
      answer: "Yes, Total Essential is made with 100% natural ingredients and is certified non-GMO and gluten-free. However, as with any supplement, we recommend consulting with your healthcare practitioner before starting any new health program."
    },
    {
      question: "Can I take Total Essential if I have dietary restrictions?",
      answer: "Total Essential is gluten-free and made with natural plant-based ingredients. If you have specific allergies or dietary restrictions, please review the ingredient list and consult with your healthcare provider."
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
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
                    Total Essential
                  </h1>
                  {selectedPackage && (
                    <p className="text-green-500 text-xl font-semibold">
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
                    <span className="ml-2 text-sm text-gray-600">(3 customer reviews)</span>
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
                      variant="green"
                    />
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button variant="premium" size="lg" disabled={!selectedPackage}>
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
                  alt="Total Essential Product"
                  className="aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  src="/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png"
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
              description="A balanced blend of top-grade soluble and insoluble fiber"
              className="mb-10"
            />
            <div className="prose max-w-none">
              <p>
                Today's modern diet consists of fast food, delicacies and temptations. Both fast food and lavish meals are mostly high-fat and low-fiber which will severely disrupt the function of intestinal tract, cause excess weight and addiction, affect insulin and diabetes, cause obesity and cardiovascular disease and many more….
              </p>
              
              <p>
                Total Essential is formulated with 100% natural fruit and vegetable extracts mixed with oat bran and Palm tree trunk fiber. This balanced blend of top-grade soluble and insoluble fiber helps normalize bowel movements, supports heart health, blood sugar control, aids in weight management, and more.
              </p>

              <h3>What are soluble and insoluble fiber?</h3>
              <p>
                <strong>Soluble fiber</strong> dissolves in water and is found mostly in fruits, oat bran etc. It has a gel-like consistency that increase bowel by increasing the volume of bulk in colon.
              </p>
              <p>
                <strong>Insoluble fiber</strong> which doesn't dissolves in water and is found mostly in vegetables. It works like a sponge and it grabs the toxins in our body to eliminate them out to the toilet.
              </p>

              <h3>Why taking adequate fiber daily is important?</h3>
              <p>
                Some people might think it's all about overcoming constipation. Actually, fiber offers numerous health benefits beyond just digestive regularity.
              </p>
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        <SplitSection
          image="public/lovable-uploads/6903ac0b-0e52-4260-bda8-07f24ce86b9a.png"
          imageAlt="Total Essential Ingredients"
          title="Premium Natural Ingredients"
          description="All of the ingredients used in our products are certified non-GMO (non-genetically modified organism) and Gluten Free. We sourced the best ingredients from all over the world to make this product top grade standard."
          className="bg-gray-50"
        >
          <div className="grid grid-cols-2 gap-4 mt-6">
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Broccoli
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Oligosaccharide
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Spinach
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apple Fibre
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Oat Bran Fibre
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Carrot
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Palm Tree Trunk Fibre
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Soluble Corn Fiber
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cabbage
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Papaya
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Parsley
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Aloe Vera Powder
              </li>
            </ul>
          </div>
        </SplitSection>

        {/* Health Benefits */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <Heading
              title="Health Benefits of Fiber"
              description="A high-fiber diet has many benefits for your overall health"
              centered
              className="mb-12"
            />
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Normalizes Bowel Movements</h3>
                <p className="text-gray-600">
                  Dietary fiber increases the weight and size of your stool and softens it. A bulky stool is easier to pass, decreasing your chance of constipation.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Heart Health</h3>
                <p className="text-gray-600">
                  Research shows that those eating a high-fiber diet have a 40 percent lower risk of heart disease, reducing blood pressure and inflammation.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Blood Sugar Control</h3>
                <p className="text-gray-600">
                  Soluble fiber may help to slow your body's breakdown of carbohydrates and the absorption of sugar, helping with blood sugar control.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Weight Management</h3>
                <p className="text-gray-600">
                  Fiber supplements have been shown to enhance weight loss, likely because fiber increases feelings of fullness and takes longer to eat.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Prevents Digestive Issues</h3>
                <p className="text-gray-600">
                  Dietary fiber may reduce your risk of diverticulitis, hemorrhoids, and provide relief from irritable bowel syndrome (IBS).
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Prevents Stones</h3>
                <p className="text-gray-600">
                  A high-fiber diet may reduce the risk of gallstones and kidney stones, likely because of its ability to help regulate blood sugar.
                </p>
              </motion.div>
            </div>
            
            <div className="mt-12 text-center">
              <a 
                href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-600 hover:text-green-800"
              >
                Learn more about fiber benefits from Mayo Clinic
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <SplitSection
          image="public/lovable-uploads/a9768c7e-625a-4016-8baa-79cea10189ac.png"
          imageAlt="How to use Total Essential"
          title="How to Use"
          description="Total Essential is easy to incorporate into your daily routine."
          reverse
        >
          <div className="space-y-4 mt-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                <span className="font-bold text-green-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Mix with Water</h4>
                <p className="text-gray-600">Take one sachet daily. Empty the contents into a glass of water (at least 350ml).</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                <span className="font-bold text-green-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">Stir Well</h4>
                <p className="text-gray-600">Stir thoroughly until the powder is completely dissolved.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                <span className="font-bold text-green-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Drink Immediately</h4>
                <p className="text-gray-600">Consume immediately. Best taken before bedtime or first thing in the morning.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                <span className="font-bold text-green-600">4</span>
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

        {/* FAQ Section */}
        <FaqSection faqs={faqData} />

        {/* CTA Section */}
        <section className="bg-green-50 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Your Health Journey Today</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the benefits of Total Essential's premium fiber blend for yourself.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="premium" size="lg">
                Add to Cart
              </Button>
              <Link to="/products/total-essential-plus">
                <Button variant="outline" size="lg">
                  Explore Total Essential Plus
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ProductEssential;
