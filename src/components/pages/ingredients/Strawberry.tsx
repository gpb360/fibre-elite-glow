'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sun, Shield, Heart, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Activity } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Strawberry",
    "description": "A delicious fruit rich in Vitamin C, antioxidants, and fiber that supports immune health, skin vitality, and overall wellness.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Immunology",
      "Dermatology",
      "Nutrition"
    ],
    "activeIngredient": "Vitamin C, Anthocyanins, Ellagic acid",
    "mechanismOfAction": "Boosts immune function, neutralizes free radicals, supports collagen production, and reduces inflammation"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const StrawberryHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/assets/16x9_three_ripe_strawberries_with_bri.png')`,
        width: '100%'
      }}
    />
    
    <div className="container px-4 md:px-6 relative z-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
        <div className="flex flex-col justify-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-500 font-semibold">Premium Ingredient</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Strawberry<span className="text-red-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Packed with Vitamin C and antioxidants, our premium Strawberry powder supports immune function, promotes radiant skin, and offers a delicious way to stay healthy.
            </p>
          </motion.div>
          <motion.div 
            className="flex flex-col gap-2 min-[400px]:flex-row" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/products/total-essential">
              <Button size="xl" variant="premium">
                View Products
              </Button>
            </Link>
            <Link href="#benefits">
              <Button size="xl" variant="outline">
                Explore Benefits
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4 text-sm" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-red-500 mr-1" />
              <span>Immune Support</span>
            </div>
            <div className="flex items-center">
              <Sun className="h-4 w-4 text-red-500 mr-1" />
              <span>Skin Vitality</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-red-500 mr-1" />
              <span>Heart Healthy</span>
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="mx-auto flex items-center justify-center" 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.7 }}
        >
          <img 
            src="/assets/16x9_three_ripe_strawberries_with_bri.png" 
            alt="Strawberry" 
            className="rounded-lg shadow-xl"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

const BenefitCard = ({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) => (
  <motion.div 
    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
      <Icon className="h-6 w-6 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const Strawberry = () => {
  const benefits = [
    {
      title: "Boosts Immune System",
      description: "Strawberries are an excellent source of Vitamin C, a key nutrient for a strong and healthy immune system.",
      icon: Shield
    },
    {
      title: "Promotes Healthy Skin",
      description: "The Vitamin C in strawberries is essential for collagen production, which helps maintain skin elasticity and youthfulness.",
      icon: Sun
    },
    {
      title: "Supports Heart Health",
      description: "Rich in antioxidants and polyphenols, strawberries help protect the heart by reducing oxidative stress and inflammation.",
      icon: Heart
    },
    {
      title: "Regulates Blood Sugar",
      description: "Strawberries have a low glycemic index and may help regulate blood sugar levels, making them a great choice for a healthy diet.",
      icon: BarChart3
    },
    {
      title: "Aids in Weight Management",
      description: "Low in calories and high in fiber, strawberries can help you feel full and satisfied, supporting healthy weight management.",
      icon: Activity
    },
    {
      title: "Enhances Brain Function",
      description: "The antioxidants in strawberries may help protect brain cells from damage and support cognitive health as you age.",
      icon: Brain
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <IngredientSchema />
      </Head>
      <Header />
      <main className="flex-1">
        <StrawberryHero />
        
        {/* What is Strawberry */}
        <SplitSection
          image="/lovable-uploads/strawberry-closeup.jpg"
          imageAlt="Strawberry Close-up"
          title="What is Strawberry?"
          description="A sweet, juicy fruit celebrated for its delicious taste and powerful nutritional benefits."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              The strawberry is a beloved fruit known for its bright red color, juicy texture, and sweet flavor. But beyond its delicious taste, the strawberry is a nutritional powerhouse, packed with vitamins, minerals, and antioxidants that offer a wide range of health benefits.
            </p>
            <p>
              Strawberries are one of the best natural sources of Vitamin C, an essential nutrient that plays a crucial role in immune function and skin health. They are also rich in antioxidants like anthocyanins and ellagic acid, which help protect the body from oxidative stress and inflammation.
            </p>
            <p>
              Our premium strawberry powder is made from carefully selected, ripe strawberries that are freeze-dried to preserve their flavor, color, and nutritional value, providing a convenient way to enjoy the benefits of this amazing fruit.
            </p>
          </div>
        </SplitSection>
        
        {/* Processing Method */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Premium Processing Method" 
              description="How we preserve the goodness of fresh strawberries" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-red-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-3">Peak Harvest</h3>
                  <p className="text-gray-600">
                    We select strawberries at their peak of ripeness to ensure maximum flavor and nutritional content.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-red-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-3">Gentle Freeze-Drying</h3>
                  <p className="text-gray-600">
                    The strawberries are freeze-dried to remove water while preserving their natural vitamins, antioxidants, and flavor.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-red-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-3">Quality Assurance</h3>
                  <p className="text-gray-600">
                    Our strawberry powder is tested for purity and potency to ensure you receive a high-quality product with every serving.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our careful processing captures the vibrant taste and nutritional benefits of fresh strawberries in a convenient, easy-to-use powder.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Strawberry" 
              description="Discover the delicious ways Strawberry supports your health and wellness" 
              centered 
              className="mb-12" 
            />
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map(benefit => (
                <BenefitCard 
                  key={benefit.title} 
                  title={benefit.title} 
                  description={benefit.description} 
                  icon={benefit.icon} 
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <SplitSection
          image="/lovable-uploads/vitamin-c-diagram.jpg"
          imageAlt="Strawberry Vitamin C Mechanism"
          title="How Strawberry Works"
          description="The science behind this vibrant fruit"
          reverse
          className="bg-red-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-800">Boosting Immune Cells</h4>
                <p className="text-gray-600">
                  Vitamin C is vital for the function of various immune cells. It supports the production and activity of white blood cells, which are essential for fighting off infections.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-800">Supporting Collagen Synthesis</h4>
                <p className="text-gray-600">
                  Vitamin C is a crucial cofactor in the synthesis of collagen, a protein that provides structure to your skin, bones, and connective tissues, helping to keep skin firm and youthful.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-800">Fighting Oxidative Stress</h4>
                <p className="text-gray-600">
                  The antioxidants in strawberries, including Vitamin C and anthocyanins, neutralize harmful free radicals, protecting cells from damage and reducing inflammation.
                </p>
              </div>
            </div>
          </div>
        </SplitSection>
        
        {/* Scientific Evidence */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Heading 
                title="Scientific Evidence" 
                description="Research supporting the benefits of Strawberry" 
                centered 
                className="mb-8" 
              />
              
              <div className="bg-red-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  The health benefits of strawberries are supported by a growing body of scientific research. Studies have highlighted their positive effects on various aspects of health:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Cardiovascular Health:</strong> A study in the American Journal of Clinical Nutrition found that regular consumption of strawberries and other berries was associated with a lower risk of heart attack in women due to their high anthocyanin content.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Blood Sugar Control:</strong> Research published in the British Journal of Nutrition suggests that strawberries may improve insulin resistance and help regulate blood sugar, particularly after a high-carbohydrate meal.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Cognitive Function:</strong> A study in the Annals of Neurology linked regular berry consumption to a slower rate of cognitive decline in older adults, attributed to the neuroprotective effects of their flavonoids.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Strawberry is not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Nutritional Composition */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Nutritional Composition" 
              description="Understanding the vibrant profile of Strawberry" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-red-700">Key Components</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin C:</strong> An exceptional source, providing over 100% of the daily value in a single serving.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Manganese:</strong> An essential mineral that plays a role in bone health and metabolism.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Dietary Fiber:</strong> Supports digestive health and promotes a feeling of fullness.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-red-700">Antioxidants</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Anthocyanins:</strong> Responsible for the red color and provide potent antioxidant benefits.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Ellagic Acid:</strong> A polyphenol with anti-inflammatory and antioxidant properties.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-red-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <Heading 
              title="Enjoy the Sweet Taste of Health" 
              description="Add the delicious power of strawberries to your daily routine and nourish your body from the inside out." 
              centered 
              className="mb-8" 
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products/total-essential">
                <Button size="xl" variant="premium">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ingredients">
                <Button size="xl" variant="outline">
                  Explore More Ingredients
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Strawberry;