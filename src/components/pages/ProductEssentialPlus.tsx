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

const totalEssentialPlusTestimonials: ProductTestimonial[] = [
  {
    id: '1',
    name: 'Jasmine',
    rating: 5,
    text: 'Tasty and effective, my kids love it too.',
    verified: true
  },
  {
    id: '2',
    name: 'Yoki',
    rating: 5,
    text: 'Good during pregnancy to ease constipation.',
    verified: true
  },
  {
    id: '3',
    name: 'Casandra',
    rating: 5,
    text: 'Helps get enough daily dietary fiber.',
    verified: true
  },
  {
    id: '4',
    name: 'Sherry',
    rating: 5,
    text: 'Helped reduce stress-related pimples.',
    verified: true
  },
  {
    id: '5',
    name: 'Phoebe',
    rating: 5,
    text: 'Amazing results, noticed changes by 5th drink.',
    verified: true
  },
  {
    id: '6',
    name: 'Santos',
    rating: 5,
    text: 'Improved regularity, highly recommended.',
    verified: true
  },
  {
    id: '7',
    name: 'Coey',
    rating: 5,
    text: 'Best drink for detox, felt lighter with healthier skin.',
    verified: true
  },
  {
    id: '8',
    name: 'J Lemay',
    location: 'Kelowna, BC',
    rating: 5,
    text: 'I absolutely love the Program. Every time I have completed the 15 days, my family usually makes a comment about how good I look and how clear my complexion is.'
  },
  {
    id: '9',
    name: 'L Dunn',
    location: 'Calgary, AB',
    rating: 5,
    text: 'After the 15-days, I had never felt better! I didn\'t crave fatty, greasy foods anymore, my stomach didn\'t feel so bloated, and I just felt better overall.'
  }
];

export function ProductEssentialPlus() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { data: packages, isLoading } = usePackages('total_essential_plus');
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
        image: '/lovable-uploads/webp/total-essential-plus-fiber-supplement-bottle.webp',
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
      answer: "Prebiotics are specialized plant fibers that feed the beneficial bacteria already living in your gut, while probiotics are live bacteria that you add to your digestive system. Our Total Essential Plus contains oligosaccharides, which are prebiotics that nourish your existing beneficial gut bacteria, supporting a naturally healthy digestive ecosystem without introducing foreign bacteria."
    },
    {
      question: "How long should I take Total Essential Plus?",
      answer: "Total Essential Plus is designed as an advanced 15-day beauty and wellness program. For optimal results, take one sachet daily for the complete 15-day cycle. Many customers incorporate this enhanced program into their monthly beauty and wellness routine for ongoing digestive health and skin radiance support."
    },
    {
      question: "What makes Total Essential Plus different from the original formula?",
      answer: "Total Essential Plus contains all the powerful digestive benefits of our original formula plus four potent superfruits: Açaí Berry, Strawberry, Cranberry, and Raspberry. These additions provide enhanced antioxidant protection, promote radiant skin health, support anti-aging benefits, and deliver a deliciously refreshing berry flavor experience while maintaining all the original digestive and metabolic benefits."
    },
    {
      question: "Is Total Essential Plus safe for daily use and long-term consumption?",
      answer: "Yes, Total Essential Plus is formulated with 100% natural, food-grade ingredients and is certified non-GMO and gluten-free. Our gentle fiber blend enhanced with superfruit extracts is well-tolerated by most individuals. However, as with any nutritional supplement, we recommend consulting with your healthcare practitioner before beginning any new wellness program."
    },
    {
      question: "Can I take Total Essential Plus if I have dietary restrictions or allergies?",
      answer: "Total Essential Plus is gluten-free, non-GMO, and made exclusively with natural plant-based ingredients including superfruit extracts. It contains no artificial preservatives, colors, or synthetic additives. If you have specific food allergies or dietary restrictions, please review our complete ingredient list and consult with your healthcare provider to ensure compatibility."
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
                    ADVANCED DAILY FIBER BLEND - 15 SACHETS PER BOX
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
                
                {/* Serving Information */}
                <div className="mt-4 text-gray-700 text-sm leading-6">
                  <p><strong>1 Box</strong> = 15 Sachets</p>
                  <p><strong>1 Sachet</strong> = 1 Serving</p>
                  <p>15-Day Supply per Box</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button
                    variant="premium2"
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
                  alt="Total Essential Plus Product - Advanced fiber supplement with enhanced benefits"
                  className="aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  src="/lovable-uploads/webp/total-essential-plus-fiber-supplement-bottle.webp"
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
              title="Advanced Beauty & Wellness Technology"
              description="Revolutionary superfruit-enhanced formula for comprehensive health and radiant skin"
              className="mb-10"
            />
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                <strong>Total Essential Plus</strong> represents the next evolution in nutritional wellness, featuring all the powerful digestive benefits of our original formula enhanced with four potent superfruits: Açaí Berry, Strawberry, Cranberry, and Raspberry. This advanced formulation was specifically developed for individuals seeking comprehensive wellness with enhanced beauty benefits and superior antioxidant protection.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Our research team carefully selected these superfruit additions not only for their exceptional flavor profile but for their clinically proven skin health benefits. The result is a deliciously refreshing berry-flavored wellness drink that supports clearer skin, improved complexion, and overall vitality while maintaining all the digestive and metabolic benefits of our original formula.
              </p>

              <div className="bg-purple-50 p-6 rounded-lg mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-700">The Science Behind Superfruit Enhancement</h3>
                <p className="text-gray-700 mb-4">
                  Clinical studies demonstrate that the antioxidant compounds found in our selected superfruits work synergistically to combat oxidative stress, reduce inflammation, and support cellular regeneration. This enhanced formula is particularly beneficial for individuals concerned about:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>Skin health and complexion improvement</li>
                  <li>Anti-aging and premature skin aging prevention</li>
                  <li>Enhanced antioxidant protection against environmental stressors</li>
                  <li>Improved overall vitality and energy levels</li>
                  <li>Superior flavor experience for better compliance</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold mb-4 text-purple-700">Why Choose the Plus Formula?</h3>
              <p className="text-lg leading-relaxed mb-4">
                The PLUS formula is ideal for health-conscious individuals who want comprehensive wellness benefits with enhanced beauty support. The addition of superfruit berry extracts not only provides a superior taste experience but delivers measurable benefits for skin health, making it the perfect choice for those seeking both internal wellness and external radiance.
              </p>
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        <SplitSection
          image="/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp"
          imageAlt="Total Essential Plus Ingredients"
          title="Premium Natural Ingredients Plus Superfruits"
          description="Every ingredient in Total Essential Plus is carefully sourced from certified suppliers worldwide and meets the highest quality standards. All components are verified non-GMO and certified Gluten-Free, with the addition of four potent superfruit extracts for enhanced antioxidant protection and skin health benefits."
          className="bg-gray-50"
        >
          <div className="grid grid-cols-2 gap-4 mt-6">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Link href="/ingredients/detoxifying-broccoli-extract" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Detoxifying Broccoli Extract
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/apple-fiber" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dual-Action Apple Fiber
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/beta-glucan-oat-bran" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Beta-Glucan Oat Bran
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/prebiotic-powerhouse" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prebiotic Powerhouse
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/soluble-corn-fiber" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Soluble Corn Fiber
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/sustainable-palm-fiber" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sustainable Palm Fiber
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/fresh-spinach-powder" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Nutrient-Dense Spinach Powder
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/enzyme-rich-papaya" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enzyme-Rich Papaya
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/nutrient-rich-carrot" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Nutrient-Rich Carrot
                </Link>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Link href="/ingredients/fresh-cabbage-extract" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fresh Cabbage Extract
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/antioxidant-parsley" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Antioxidant Parsley
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/digestive-aid-guar-gum" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Digestive-Aid Guar Gum
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/hydrating-celery" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Hydrating Celery
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/acai-berry" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Acai Berry
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/strawberry" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Strawberry
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/cranberry" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cranberry
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/raspberry" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Raspberry
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/ingredients/soothing-aloe-vera-powder" className="flex items-center hover:text-purple-700">
                  <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Soothing Aloe Vera Powder
                </Link>
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
                    <Image className="h-10 w-10 rounded-full bg-purple-100" src="/lovable-uploads/webp/fiber-supplement-premium-ingredients.webp" alt="Tinesja Vanel - Colon Hydro-therapist testimonial for Total Essential Plus fiber supplement" width={40} height={40} />
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
          image="/lovable-uploads/webp/fiber-supplement-premium-ingredients.webp"
          imageAlt="How to use Total Essential Plus"
          title="Enhanced Daily Protocol"
          description="Total Essential Plus is designed for effortless integration into your daily beauty and wellness routine with maximum convenience and superior taste experience."
          reverse
        >
          <div className="space-y-4 mt-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 mr-4">
                <span className="font-bold text-purple-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Mix with Water</h4>
                <p className="text-gray-600">Take one sachet daily. Empty the contents into a glass of water (at least 200ml).</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 mr-4">
                <span className="font-bold text-purple-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">Shake Well</h4>
                <p className="text-gray-600">We do not stir this product it must be shanken for best results.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 mr-4">
                <span className="font-bold text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Drink Immediately</h4>
                <p className="text-gray-600">Consume immediately. Best taken before bedtime, as our product will need 6 to 10 hours to work.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 mr-4">
                <span className="font-bold text-purple-600">4</span>
              </div>
              <div>
                <h4 className="font-medium">Complete Your 15-Day Supply</h4>
                <p className="text-gray-600">For optimal results, use one sachet daily until you've completed your box (15 servings).</p>
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
            <h2 className="text-3xl font-bold mb-4">Elevate Your Beauty & Wellness Journey</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the enhanced benefits of Total Essential Plus for comprehensive health support and radiant skin from within.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="premium2"
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
                  'Start Your Enhanced Journey'
                )}
              </Button>
              <Link href="/products/total-essential">
                <Button variant="outline" size="lg">
                  Compare with Total Essential
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <ProductTestimonials testimonials={totalEssentialPlusTestimonials} />
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
