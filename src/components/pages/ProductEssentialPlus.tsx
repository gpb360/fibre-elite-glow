"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { OptimizedMotion, fadeInUp, fadeIn, scaleIn } from '@/components/performance/OptimizedMotion';
import { IntersectionLazy } from '@/components/performance/LazyComponent';
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
import { Breadcrumb } from '@/components/ui/breadcrumb';

// Memoized testimonials data to prevent recalculation
const totalEssentialPlusTestimonials: ProductTestimonial[] = [
  {
    id: '1',
    name: 'Jennifer M',
    rating: 5,
    text: 'Total Essential Plus is a game-changer! The enhanced formula with probiotics has completely transformed my digestive health. I feel lighter and more energetic.',
    verified: true
  },
  {
    id: '2',
    name: 'David K',
    location: 'Toronto, ON',
    rating: 5,
    text: 'As someone who has struggled with digestive issues for years, Total Essential Plus has been a lifesaver. The combination of fiber and probiotics works wonders.',
    verified: true
  },
  {
    id: '3',
    name: 'Sarah L',
    location: 'Vancouver, BC',
    rating: 5,
    text: 'I love that Total Essential Plus includes both fiber and probiotics in one convenient sachet. It\'s simplified my daily supplement routine.',
    verified: true
  },
  {
    id: '4',
    name: 'Michael R',
    rating: 4,
    text: 'Great product, helped with my digestion. Mixes easily and has no taste.',
    verified: true
  }
];

// Loading fallback component
const OptimizedLoadingFallback = () => (
  <div className="animate-pulse">
    <div className="bg-gray-100 rounded-lg h-48 w-full mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-100 rounded h-4 w-3/4"></div>
      <div className="bg-gray-100 rounded h-4 w-1/2"></div>
    </div>
  </div>
);

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
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Memoize FAQ data to prevent recreation
  const faqData = useMemo(() => [
    {
      question: "What's the difference between Total Essential and Total Essential Plus?",
      answer: "Total Essential Plus contains all the benefits of our original Total Essential formula with the added advantage of premium probiotics. While Total Essential focuses on providing comprehensive fiber support, Total Essential Plus combines the same high-quality fiber blend with clinically-studied probiotic strains to provide enhanced digestive wellness, immune support, and gut microbiome balance."
    },
    {
      question: "How long should I take Total Essential Plus?",
      answer: "Total Essential Plus is designed as a comprehensive 15-day wellness program. For optimal results, take one sachet daily for the complete 15-day cycle. Many customers incorporate this program into their monthly wellness routine or use it seasonally for ongoing digestive health maintenance and microbiome support."
    },
    {
      question: "Can I take Total Essential Plus if I'm already taking other probiotics?",
      answer: "Yes, Total Essential Plus can be safely taken alongside other probiotic supplements. However, to optimize your regimen and avoid potential redundancy, we recommend consulting with your healthcare practitioner to ensure you're getting the right balance of probiotic strains and dosages for your specific needs."
    },
    {
      question: "What probiotic strains are included in Total Essential Plus?",
      answer: "Total Essential Plus features a carefully selected blend of clinically-studied probiotic strains that work synergistically with our premium fiber blend. These strains are chosen for their stability, efficacy, and complementary benefits to digestive health. Each probiotic strain is specifically selected to enhance the prebiotic effects of our fiber formula."
    },
    {
      question: "Is Total Essential Plus safe for daily use and long-term consumption?",
      answer: "Yes, Total Essential Plus is formulated with 100% natural, food-grade ingredients, including premium probiotic strains that are Generally Recognized As Safe (GRAS). Our gentle yet effective formula is well-tolerated by most individuals. However, as with any nutritional supplement, we recommend consulting with your healthcare practitioner before beginning any new wellness program, especially if you have existing health conditions or compromised immune function."
    }
  ], []);

  // Memoize benefits data
  const benefitsData = useMemo(() => [
    {
      title: "Enhanced Digestive Health",
      description: "Combines premium fiber blend with clinically-studied probiotics for comprehensive digestive wellness and regularity.",
      icon: ExternalLink
    },
    {
      title: "Gut Microbiome Support",
      description: "Probiotics help maintain healthy gut flora while prebiotic fiber nourishes beneficial bacteria for optimal microbiome balance.",
      icon: ExternalLink
    },
    {
      title: "Immune System Support",
      description: "The gut-immune connection is strengthened through the synergistic action of fiber and probiotics supporting overall immunity.",
      icon: ExternalLink
    },
    {
      title: "Nutrient Absorption",
      description: "Improved gut health enhances nutrient absorption from foods, maximizing the nutritional value of your diet.",
      icon: ExternalLink
    },
    {
      title: "Sustained Energy",
      description: "Better digestive function leads to improved energy metabolism and sustained vitality throughout the day.",
      icon: ExternalLink
    },
    {
      title: "Comprehensive Wellness",
      description: "Addresses multiple aspects of digestive health with a scientifically-formulated combination of fiber and probiotics.",
      icon: ExternalLink
    }
  ], []);

  return (
    <>
      <Header />
      <div className="container px-4 md:px-6 py-4">
        <Breadcrumb
          items={[
            { name: 'Products', url: '/products' },
            { name: 'Total Essential Plus', url: '/products/total-essential-plus', current: true }
          ]}
          className="text-sm"
        />
      </div>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-50 to-white py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <OptimizedMotion className="flex flex-col justify-center space-y-4" {...fadeInUp}>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Total Essential Plus
                  </h1>
                  {selectedPackage && (
                    <p className="text-purple-600 text-xl font-semibold">
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
                    <span className="ml-2 text-sm text-gray-600">(4 customer reviews)</span>
                  </div>
                  <p className="max-w-[600px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    PREMIUM FIBER & PROBIOTIC BLEND - 15 SACHETS PER BOX
                  </p>
                </div>

                {/* Package Selection */}
                <div className="mt-6">
                  {isLoading ? (
                    <OptimizedLoadingFallback />
                  ) : packages && (
                    <PackageSelector
                      packages={packages}
                      selectedPackage={selectedPackage}
                      onSelectPackage={setSelectedPackage}
                      variant="premium2"
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
              </OptimizedMotion>

              <OptimizedMotion className="mx-auto flex items-center justify-center" {...scaleIn}>
                <Image
                  alt="Total Essential Plus Product - Canadian-made premium fiber supplement with probiotics for enhanced digestive health - Available in Canada"
                  className="aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  src="/lovable-uploads/webp/total-essential-plus-fiber-supplement-bottle.webp"
                  width={550}
                  height={550}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                  placeholder="blur"
                  blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4WAoAAAAQAAAA8wAA8wAAQUxQSBIAAAABR0AEmQAP4A/kOw2G7k7I6H7G8N9O8Q9R/T0U1V1W2X3Y4Z5a6b7c8d9e+f/gH+gJ+iP6oL+pQ6pS+pT+pZ+pqPqw6rS6rT6rZ6rqPqw6rS6rT6rZ6rqPqw6rS6rT6rZ6rqPqw6rS6rT6rZ6rqPuw="
                />
              </OptimizedMotion>
            </div>
          </div>
        </section>

        {/* Product Description */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <Heading
              title="Advanced Fiber + Probiotic Technology"
              description="The next generation of digestive wellness with clinically-studied ingredients"
              className="mb-10"
            />
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                Building on the success of our original Total Essential formula, <strong>Total Essential Plus</strong> represents the pinnacle of digestive wellness innovation. This advanced formulation combines our premium, scientifically-balanced fiber blend with carefully selected probiotic strains, creating a synergistic approach to gut health that addresses both digestive regularity and microbiome balance.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                <strong>Total Essential Plus</strong> leverages cutting-edge microbiome research to deliver comprehensive digestive support. The soluble and insoluble fibers work to regulate digestion and promote regularity, while our proprietary probiotic blend helps maintain optimal gut flora, enhance nutrient absorption, and strengthen immune function. This powerful combination addresses modern dietary challenges more effectively than fiber alone.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-purple-700">The Science Behind Synergy</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-purple-800">Prebiotic Fiber</h4>
                  <p className="text-gray-700">
                    Our premium fiber blend serves as nourishment for beneficial gut bacteria, creating an optimal environment for probiotic colonization and activity while supporting regular digestive function.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-purple-800">Probiotic Strains</h4>
                  <p className="text-gray-700">
                    Clinically-studied probiotic strains work synergistically with our fiber blend to enhance gut microbiome diversity, support immune function, and improve overall digestive wellness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Benefits - Lazy load these as they're below the fold */}
        <IntersectionLazy rootMargin="100px">
          <section className="py-12 md:py-20">
            <div className="container px-4 md:px-6">
              <Heading
                title="Enhanced Health Benefits"
                description="Experience the power of fiber and probiotics working together"
                centered
                className="mb-12"
              />

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {benefitsData.map((benefit, index) => (
                  <OptimizedMotion key={benefit.title} {...fadeInUp}>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
                        <benefit.icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </OptimizedMotion>
                ))}
              </div>

              <div className="mt-12 bg-purple-50 rounded-lg p-8">
                <Heading
                  title="Clinical Evidence"
                  description="Backed by scientific research demonstrating the synergistic benefits of fiber and probiotics"
                  size="md"
                  className="mb-6"
                />
                <div className="text-gray-600 space-y-4">
                  <p>
                    Studies from leading research institutions demonstrate that the combination of prebiotic fiber and probiotics can be significantly more effective than either component alone, with improvements in digestive regularity, gut microbiome diversity, and immune function markers.
                  </p>
                  <p>
                    Research shows that this synergistic approach can enhance probiotic survival and colonization by up to 10x compared to probiotics taken without prebiotic support, ensuring maximum effectiveness and lasting gut health benefits.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </IntersectionLazy>

        {/* Lazy load heavy sections */}
        <IntersectionLazy rootMargin="200px">
          <Suspense fallback={<OptimizedLoadingFallback />}>
            <ProductTestimonials testimonials={totalEssentialPlusTestimonials} />
          </Suspense>
        </IntersectionLazy>

        <IntersectionLazy rootMargin="200px">
          <Suspense fallback={<OptimizedLoadingFallback />}>
            <FaqSection faqs={faqData} />
          </Suspense>
        </IntersectionLazy>

        {/* CTA Section */}
        <section className="bg-purple-50 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Transform Your Digestive Health Today</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the next generation of digestive wellness with Total Essential Plus's advanced fiber and probiotic formula.
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
                  'Start Your Enhanced Wellness Journey'
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
      </main>
      <Footer />
    </>
  );
}

export default ProductEssentialPlus;