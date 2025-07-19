
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { PackageSelector } from '@/components/ui/package-selector';
import { FaqSection } from '@/components/FaqSection';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Loader2, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { usePackages, Package } from '@/hooks/usePackages';
import { useCart } from '@/contexts/CartContext';
import { ProductTestimonials, ProductTestimonial } from '@/components/ui/product-testimonials';

const totalEssentialTestimonials: ProductTestimonial[] = [
  {
    id: '1',
    name: 'Celine C',
    rating: 5,
    text: 'I simply love this product... I took it at night before I go to bed and when I woke up, I got the best release ever.',
    verified: true
  },
  {
    id: '2',
    name: 'Nina',
    rating: 5,
    text: 'I have used 5 days only and can feel the result of losing weight',
    verified: true
  },
  {
    id: '3',
    name: 'Jamie',
    rating: 5,
    text: 'I used to feel so bloated after a long flight... after taking this product, it\'s totally changed my life',
    verified: true
  },
  {
    id: '4',
    name: 'G Normandeau',
    location: 'Nova Scotia',
    rating: 5,
    text: 'I cannot believe how great Total Essential is working for me... I endured 6 years of Dr\'s prescriptions that did not work. Imagine the relief I am finally experiencing.'
  },
  {
    id: '5',
    name: 'R Nunnikhoven',
    location: 'Maple Ridge, BC',
    rating: 5,
    text: 'The Total Cleansing (Total Essential) 15 Day Detox Program is simply wonderful. It tastes great, is easy to take and works as promised.'
  },
  {
    id: '6',
    name: 'J Neels',
    location: 'Chilliwack, BC',
    rating: 5,
    text: 'I have been using the Total Cleansing (Total Essential) Detox program for about 2 years now. It has been life changing for me... After taking the detox I was able to be regular, gain extra energy and feel really great.'
  }
];

export function ProductEssential() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { data: packages, isLoading } = usePackages('total_essential');
  const { addToCart, isLoading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Set default package to the most popular one when data loads
  React.useEffect(() => {
    if (packages && !selectedPackage) {
      const popularPackage = packages.find(pkg => pkg.is_popular) || packages[0];
      setSelectedPackage(popularPackage);
    }
  }, [packages, selectedPackage]);

  const handleAddToCart = async () => {
    if (!selectedPackage) return;

    setIsAdding(true);

    try {
      await addToCart({
        id: selectedPackage.id,
        productName: selectedPackage.product_name,
        productType: selectedPackage.product_type,
        price: selectedPackage.price,
        originalPrice: selectedPackage.original_price || undefined,
        savings: selectedPackage.savings || undefined,
        image: '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp',
        packageSize: `${selectedPackage.quantity} box${selectedPackage.quantity > 1 ? 'es' : ''} (${selectedPackage.quantity * 15} sachets)`,
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const faqData = [
    {
      question: "What's the difference between prebiotics and probiotics?",
      answer: "Prebiotics are specialized plant fibers that feed the beneficial bacteria already living in your gut, while probiotics are live bacteria that you add to your digestive system. Our Total Essential contains oligosaccharides, which are prebiotics that nourish your existing beneficial gut bacteria, supporting a naturally healthy digestive ecosystem without introducing foreign bacteria."
    },
    {
      question: "How long should I take Total Essential?",
      answer: "Total Essential is designed as a comprehensive 15-day wellness program. For optimal results, take one sachet daily for the complete 15-day cycle. Many customers incorporate this program into their monthly wellness routine or use it seasonally for ongoing digestive health maintenance and detoxification support."
    },
    {
      question: "What makes Total Essential uniquely effective?",
      answer: "Total Essential combines both soluble and insoluble fiber from premium natural sources in scientifically balanced ratios. This dual-fiber approach ensures comprehensive digestive support: soluble fiber helps regulate blood sugar and cholesterol while insoluble fiber promotes healthy elimination and detoxification. The addition of oligosaccharides provides prebiotic support for optimal gut microbiome health."
    },
    {
      question: "Is Total Essential safe for daily use and long-term consumption?",
      answer: "Yes, Total Essential is formulated with 100% natural, food-grade ingredients and is certified non-GMO and gluten-free. Our gentle fiber blend is well-tolerated by most individuals. However, as with any nutritional supplement, we recommend consulting with your healthcare practitioner before beginning any new wellness program, especially if you have existing health conditions."
    },
    {
      question: "Can I take Total Essential if I have dietary restrictions or allergies?",
      answer: "Total Essential is gluten-free, non-GMO, and made exclusively with natural plant-based ingredients. It contains no artificial preservatives, colors, or synthetic additives. If you have specific food allergies or dietary restrictions, please review our complete ingredient list and consult with your healthcare provider to ensure compatibility with your individual needs."
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
                    PREMIUM DAILY FIBER BLEND - 15 SACHETS PER BOX
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
                
                {/* Serving Information */}
                <div className="mt-4 text-gray-700 text-sm leading-6">
                  <p><strong>1 Box</strong> = 15 Sachets</p>
                  <p><strong>1 Sachet</strong> = 1 Serving</p>
                  <p>15-Day Supply per Box</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button
                    variant="premium"
                    size="lg"
                    disabled={!selectedPackage || isAdding || cartLoading}
                    onClick={handleAddToCart}
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Adding to Cart...
                      </>
                    ) : justAdded ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Added to Cart!
                      </>
                    ) : (
                      `Add to Cart - $${selectedPackage?.price || '0.00'}`
                    )}
                  </Button>
                  <Link href="/products">
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
                <Image
                  alt="Total Essential Product - Complete fiber supplement for digestive health"
                  className="aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  src="/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp"
                  width={550}
                  height={550}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Product Description */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <Heading
              title="Revolutionary Fiber Technology"
              description="Scientifically formulated for optimal digestive health and wellness"
              className="mb-10"
            />
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                In today's fast-paced world, modern dietary habits consisting of processed foods, refined sugars, and nutrient-poor options have created a widespread fiber deficiency crisis. These high-fat, low-fiber diets severely disrupt intestinal function, leading to digestive irregularity, weight gain, insulin resistance, cardiovascular stress, and numerous metabolic complications.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                <strong>Total Essential</strong> represents a breakthrough in nutritional science, meticulously formulated with 100% natural fruit and vegetable extracts, premium oat bran, and sustainably sourced palm tree trunk fiber. This scientifically balanced blend of top-grade soluble and insoluble fiber works synergistically to restore digestive harmony, support cardiovascular health, regulate blood sugar levels, and promote healthy weight management.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-green-700">Understanding Fiber Science</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-green-800">Soluble Fiber</h4>
                  <p className="text-gray-700">
                    Dissolves in water to form a gel-like substance, primarily found in fruits and oat bran. This fiber type helps regulate cholesterol levels, stabilizes blood sugar, and creates a feeling of fullness that supports healthy weight management by slowing digestion and nutrient absorption.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-green-800">Insoluble Fiber</h4>
                  <p className="text-gray-700">
                    Remains intact through the digestive process, acting as nature's detoxifier. This fiber type adds bulk to stool, promotes regular bowel movements, and effectively binds to toxins and waste products, facilitating their elimination from the body.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4 text-green-700">The Critical Importance of Daily Fiber</h3>
              <p className="text-lg leading-relaxed mb-4">
                While many people associate fiber supplementation solely with digestive regularity, research reveals that adequate fiber intake provides comprehensive health benefits that extend far beyond simple constipation relief. Clinical studies demonstrate that individuals consuming optimal fiber levels experience:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-lg">
                <li>Reduced risk of cardiovascular disease and improved heart health</li>
                <li>Better blood sugar control and insulin sensitivity</li>
                <li>Enhanced weight management and appetite regulation</li>
                <li>Improved gut microbiome diversity and immune function</li>
                <li>Lower inflammation markers throughout the body</li>
                <li>Reduced risk of certain cancers, particularly colorectal cancer</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        <SplitSection
          image="/lovable-uploads/webp/2Fd98185ae-142e-45e8-9804-7b3e5aee3680.webp"
          imageAlt="Total Essential Ingredients"
          title="Premium Natural Ingredients"
          description="Every ingredient in Total Essential is carefully sourced from certified suppliers worldwide and meets the highest quality standards. All components are verified non-GMO (non-genetically modified organism) and certified Gluten-Free, ensuring purity and safety for daily consumption."
          className="bg-gray-50"
        >
          <div className="grid grid-cols-2 gap-4 mt-6">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Link href="/ingredients/detoxifying-broccoli-extract" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Detoxifying Broccoli Extract
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/prebiotic-powerhouse" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prebiotic Powerhouse
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/fresh-spinach-powder" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Nutrient-Dense Spinach Powder
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/apple-fiber" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dual-Action Apple Fiber
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/beta-glucan-oat-bran" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Beta-Glucan Oat Bran
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/nutrient-rich-carrot" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Nutrient-Rich Carrot
                </Link>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Link href="/ingredients/sustainable-palm-fiber" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sustainable Palm Fiber
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/soluble-corn-fiber" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Soluble Corn Fiber
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/fresh-cabbage-extract" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fresh Cabbage Extract
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/enzyme-rich-papaya" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enzyme-Rich Papaya
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/antioxidant-parsley" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Antioxidant Parsley
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/soothing-aloe-vera-powder" className="flex items-center hover:text-green-700">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Soothing Aloe Vera Powder
                </Link>
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
          image="/lovable-uploads/webp/a9768c7e-625a-4016-8baa-79cea10189ac.webp"
          imageAlt="How to use Total Essential"
          title="Simple Daily Protocol"
          description="Total Essential is designed for effortless integration into your daily wellness routine with maximum convenience and effectiveness."
          reverse
        >
          <div className="space-y-4 mt-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                <span className="font-bold text-green-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Mix with Water</h4>
                <p className="text-gray-600">Take one sachet daily. Empty the contents into a glass of water (at least 200ml).</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                <span className="font-bold text-green-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">Shake Well</h4>
                <p className="text-gray-600">We do not stir this product it must be shanken for best results.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                <span className="font-bold text-green-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Drink Immediately</h4>
                <p className="text-gray-600">Consume immediately. Best taken before bedtime, as our product will need 6 to 10 hours to work.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                <span className="font-bold text-green-600">4</span>
              </div>
              <div>
                <h4 className="font-medium">Continue for 15 Days</h4>
                <p className="text-gray-600">For optimal results, use one sachet daily until you've completed your box (15 servings).</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              <em>This is not intended as medical advice. Consult your health care practitioner before starting any health program.</em>
            </p>
          </div>
        </SplitSection>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <ProductTestimonials testimonials={totalEssentialTestimonials} />
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection faqs={faqData} />

        {/* CTA Section */}
        <section className="bg-green-50 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Transform Your Health Today</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have experienced the life-changing benefits of Total Essential's premium fiber technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="premium"
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedPackage || isAdding || cartLoading}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding to Cart...
                  </>
                ) : justAdded ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  'Start Your Wellness Journey'
                )}
              </Button>
              <Link href="/products/total-essential-plus">
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
