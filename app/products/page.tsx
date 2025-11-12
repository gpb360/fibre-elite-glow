'use client';

import React from 'react';
import { EnhancedProductCard } from '@/components/ui/enhanced-product-card';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaqSection } from '@/components/FaqSection';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import {
  Heart,
  Shield,
  Zap,
  Award,
  Check,
  Truck,
  Star,
  Users,
  Leaf,
  Package,
  TrendingUp,
  Brain,
  Apple,
  Activity
} from 'lucide-react';

// Enhanced Hero Section Component
const ProductsHero = () => (
  <section className="relative bg-gradient-to-b from-green-50 to-white pt-20 pb-12 md:pt-32 md:pb-20 overflow-hidden">
    <div className="absolute inset-0 z-0 opacity-15">
      <Image
        src="/lovable-uploads/webp/fruit-veg-bottle.webp"
        alt="Natural Canadian fiber supplement bottles surrounded by fresh fruits and vegetables"
        fill
        className="object-cover"
        priority
      />
    </div>

    <div className="container mx-auto px-4 md:px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-green-500 font-semibold text-lg mb-4">Natural Balance for Daily Wellness</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Premium Fiber <span className="text-green-500">Collection</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect natural fiber blend for your daily wellness routine.
            Scientifically formulated to support digestive health and overall vitality.
          </p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-8 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            Non-GMO Ingredients
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            Gluten Free
          </div>
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            100% Natural
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// Enhanced Benefits Overview Component
const BenefitsOverview = () => {
  const benefits = [
    {
      title: "Digestive Harmony",
      description: "Promotes gentle, natural regularity without discomfort or urgency",
      icon: Heart
    },
    {
      title: "Sustained Energy",
      description: "Feel lighter and more energized throughout your day",
      icon: Zap
    },
    {
      title: "Immune Support",
      description: "Rich in antioxidants that support your body's natural defenses",
      icon: Shield
    },
    {
      title: "Weight Management",
      description: "Helps maintain healthy metabolism and supports weight goals",
      icon: Award
    },
    {
      title: "Premium Quality",
      description: "Made with 100% natural fruits and vegetables",
      icon: Leaf
    },
    {
      title: "Convenient Daily Routine",
      description: "Single-serve sachets for easy daily wellness",
      icon: Package
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <Heading
          title="Why Choose Our Fiber Supplements?"
          description="Experience the difference that premium, natural ingredients can make to your daily wellness"
          centered
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-green-100 p-3 flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Educational Content Component
const EducationalContent = () => {
  const educationalPoints = [
    {
      title: "The Fiber Deficiency Crisis",
      description: "Modern diets provide only 10-15g of fiber daily, while health experts recommend 25-35g. This widespread deficiency contributes to rising rates of heart disease, diabetes, obesity, and digestive disorders.",
      icon: TrendingUp,
      color: "red"
    },
    {
      title: "Gut-Brain Connection",
      description: "Your gut microbiome influences everything from mood regulation to mental clarity. Prebiotic fiber feeds beneficial bacteria that produce neurotransmitters supporting cognitive function.",
      icon: Brain,
      color: "purple"
    },
    {
      title: "Metabolic Optimization",
      description: "Fiber regulates blood sugar levels, supports healthy cholesterol ratios, and promotes sustainable weight management through improved insulin sensitivity.",
      icon: Activity,
      color: "blue"
    },
    {
      title: "Cellular Protection",
      description: "Antioxidant-rich superfruits in our formulas protect cells from oxidative stress, supporting healthy aging and cellular rejuvenation.",
      icon: Shield,
      color: "green"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <Heading
          title="Understanding Fiber: The Foundation of Wellness"
          description="Educational insights into why fiber is essential for optimal health and longevity"
          centered
          className="mb-12"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {educationalPoints.map((point, index) => (
            <motion.div
              key={point.title}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`mx-auto mb-6 h-16 w-16 rounded-full bg-${point.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <point.icon className={`h-8 w-8 text-${point.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{point.title}</h3>
              <p className="text-gray-600 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 max-w-4xl mx-auto bg-green-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-center mb-6">
            <Apple className="h-12 w-12 text-green-600 mr-4" />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Did You Know?</h3>
              <p className="text-green-600 font-medium">The Science Behind Our Formula</p>
            </div>
          </div>
          <p className="text-gray-700 text-center leading-relaxed">
            Research shows that every 10g increase in daily fiber intake can reduce your risk of heart disease by 14%,
            type 2 diabetes by 19%, and colorectal cancer by 10%. Our scientifically formulated blends provide optimal
            ratios of soluble and insoluble fiber for maximum health benefits.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Product Comparison Component
const ProductComparison = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4 md:px-6">
      <Heading
        title="Find Your Perfect Match"
        description="Compare our formulations to choose the best option for your wellness goals"
        centered
        className="mb-12"
      />

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-50 to-purple-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700">Feature</th>
                  <th className="p-4 text-center font-semibold text-green-700">Total Essential</th>
                  <th className="p-4 text-center font-semibold text-purple-700">Total Essential Plus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-left font-medium text-gray-700">Servings per Box</td>
                  <td className="p-4 text-center">15 sachets</td>
                  <td className="p-4 text-center">15 sachets</td>
                </tr>
                <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-left font-medium text-gray-700">Fruits & Vegetables</td>
                  <td className="p-4 text-center">14 varieties</td>
                  <td className="p-4 text-center font-semibold text-purple-600">18 varieties</td>
                </tr>
                <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-left font-medium text-gray-700">Superfruits</td>
                  <td className="p-4 text-center text-gray-400">Basic</td>
                  <td className="p-4 text-center font-semibold text-purple-600">Enhanced</td>
                </tr>
                <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-left font-medium text-gray-700">Antioxidant Support</td>
                  <td className="p-4 text-center">
                    <Check className="h-5 w-5 mx-auto text-green-500" />
                  </td>
                  <td className="p-4 text-center font-semibold text-purple-600">Advanced</td>
                </tr>
                <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-left font-medium text-gray-700">Best For</td>
                  <td className="p-4 text-center text-sm">Daily maintenance & beginners</td>
                  <td className="p-4 text-center text-sm font-semibold">Enhanced wellness support</td>
                </tr>
                <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-left font-medium text-gray-700">Price</td>
                  <td className="p-4 text-center font-bold text-green-600">$79.99</td>
                  <td className="p-4 text-center font-bold text-purple-600">$84.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "I've struggled with digestive issues for years, and Total Essential has been a game-changer. I feel lighter, more energetic, and more regular than ever before.",
      author: "Sarah Mitchell",
      role: "Verified Customer",
      rating: 5
    },
    {
      quote: "The convenience of single-serving sachets makes it so easy to maintain my daily wellness routine. Plus, the natural ingredients give me peace of mind.",
      author: "David Chen",
      role: "Verified Customer",
      rating: 5
    },
    {
      quote: "I tried Total Essential Plus for the enhanced antioxidant benefits, and I'm amazed at how much better my skin looks and feels. This is now a staple in my wellness routine!",
      author: "Emily Rodriguez",
      role: "Verified Customer",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <Heading
          title="Real Results from Real Customers"
          description="Join thousands of Canadians who have transformed their wellness journey with our premium fiber supplements"
          centered
          className="mb-12"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TestimonialCard
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                rating={testimonial.rating}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-8 p-6 bg-green-50 rounded-xl">
            <div className="text-left">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-2xl font-bold text-gray-900">4.9/5</p>
              <p className="text-sm text-gray-600">Average Customer Rating</p>
            </div>
            <div className="w-px h-16 bg-gray-300" />
            <div className="text-left">
              <p className="text-2xl font-bold text-green-600">50,000+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>
            <div className="w-px h-16 bg-gray-300" />
            <div className="text-left">
              <p className="text-2xl font-bold text-purple-600">98%</p>
              <p className="text-sm text-gray-600">Would Recommend</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// FAQ Section Component
const FAQSection = () => {
  const faqData = [
    {
      question: "What makes Total Essential different from other fiber supplements?",
      answer: "Total Essential stands apart with its scientifically formulated blend of both soluble and insoluble fiber from 100% natural sources. Unlike synthetic fiber supplements, our formula includes premium oat bran, sustainably sourced palm tree trunk fiber, and multiple varieties of fruits and vegetables. The addition of oligosaccharides provides prebiotic support, nourishing your existing beneficial gut bacteria naturally."
    },
    {
      question: "How quickly will I see results with Total Essential?",
      answer: "Most customers experience improved digestive regularity within 3-5 days of consistent use. Complete wellness benefits, including enhanced energy levels, better appetite control, and improved overall well-being, typically develop over the full 15-day program. Individual results may vary based on current fiber intake, diet, and overall health status."
    },
    {
      question: "What's the difference between Total Essential and Total Essential Plus?",
      answer: "Total Essential provides comprehensive digestive wellness with 14 varieties of fruits and vegetables. Total Essential Plus enhances this formula with four additional superfruits (Açaí Berry, Strawberry, Cranberry, and Raspberry) for a total of 18 varieties, providing powerful antioxidant protection and enhanced beauty benefits while maintaining all the digestive advantages."
    },
    {
      question: "Is Total Essential safe for long-term use?",
      answer: "Yes, Total Essential is formulated with 100% natural, food-grade ingredients and is safe for regular use. Our gentle fiber blend is well-tolerated by most individuals and contains no artificial preservatives, synthetic additives, or harmful chemicals. The product is certified non-GMO and gluten-free. However, as with any nutritional supplement, we recommend consulting with your healthcare practitioner before beginning any new wellness program."
    }
  ];

  return (
    <FaqSection
      title="Frequently Asked Questions"
      description="Get answers to common questions about our premium fiber supplements and how they can transform your wellness journey"
      faqs={faqData}
    />
  );
};

// Quality Assurance Component
const QualitySection = () => {
  const qualityFeatures = [
    {
      title: "Scientifically Validated Ingredients",
      description: "Each ingredient is selected based on scientific research demonstrating its effectiveness in supporting digestive health and overall wellness."
    },
    {
      title: "Premium Canadian Sourcing",
      description: "We partner with trusted Canadian suppliers who meet our rigorous quality standards for purity, potency, and sustainability."
    },
    {
      title: "Rigorous Testing Protocol",
      description: "Every batch undergoes comprehensive testing for purity, safety, and effectiveness to ensure you receive the highest quality product."
    },
    {
      title: "Synergistic Formulation",
      description: "Our ingredients work together harmoniously to enhance each other's benefits, providing comprehensive support for your wellness journey."
    }
  ];

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <Heading
            title="Quality You Can Trust"
            description="Our commitment to excellence in every sachet"
            centered
            className="mb-12"
          />

          <div className="space-y-6">
            {qualityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced CTA Section
const CTASection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4 md:px-6 text-center">
      <Heading
        title="Ready to Transform Your Wellness Journey?"
        description="Join thousands of satisfied customers who have discovered the natural benefits of our premium fiber supplements"
        centered
        className="mb-8"
      />

      <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
        <Link href="/products/total-essential">
          <Button variant="premium" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
            Shop Total Essential
          </Button>
        </Link>
        <Link href="/products/total-essential-plus">
          <Button variant="premium2" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
            Shop Total Essential Plus
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
        <div className="flex items-center">
          <Truck className="h-5 w-5 mr-2 text-green-500" />
          <span>Free shipping over $100</span>
        </div>
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-green-500" />
          <span>30-day satisfaction guarantee</span>
        </div>
        <div className="flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          <span>4.9/5 customer rating</span>
        </div>
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-green-500" />
          <span>50,000+ happy customers</span>
        </div>
      </div>
    </div>
  </section>
);

const ProductsPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <ProductsHero />

        {/* Benefits Overview */}
        <BenefitsOverview />

        {/* Educational Content */}
        <EducationalContent />

        {/* Product Showcase */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <Heading
              title="Choose Your Perfect Fiber Blend"
              description="Both formulations feature premium ingredients, but serve different wellness goals"
              centered
              className="mb-16"
            />

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <EnhancedProductCard
                  variant="green"
                  image="/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp"
                  title="Total Essential"
                  price="$79.99"
                  description="PREMIUM DAILY FIBER BLEND – Crafted from 100% fruit & vegetable fibers for gentle, natural regularity. Perfect for daily wellness maintenance."
                  badge="Best Seller"
                  productId="total-essential-base"
                  productType="total_essential"
                  originalPrice="$89.99"
                  savings={10}
                  priority={true}
                  features={[
                    "14 varieties of fruits & vegetables",
                    "Gentle daily support",
                    "Perfect for beginners",
                    "Non-GMO & Gluten Free"
                  ]}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <EnhancedProductCard
                  variant="purple"
                  image="/lovable-uploads/webp/total-essential-plus-fiber-supplement-bottle.webp"
                  title="Total Essential Plus"
                  price="$84.99"
                  description="ADVANCED DAILY FIBER BLEND – Enhanced with super-fruits for added antioxidants and vibrant wellness support. 15 sachets per box."
                  badge="Enhanced Formula"
                  productId="total-essential-plus-base"
                  productType="total_essential_plus"
                  originalPrice="$94.99"
                  savings={10}
                  features={[
                    "18 varieties including superfruits",
                    "Enhanced antioxidant support",
                    "Advanced wellness formula",
                    "Premium ingredient blend"
                  ]}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Product Comparison */}
        <ProductComparison />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Quality Assurance */}
        <QualitySection />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;