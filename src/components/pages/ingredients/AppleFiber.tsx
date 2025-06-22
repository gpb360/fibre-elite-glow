'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Premium Apple Fiber",
    "description": "A gentle yet effective source of both soluble and insoluble fiber that supports digestive regularity and helps maintain healthy cholesterol levels.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Cardiology",
      "Nutrition"
    ],
    "activeIngredient": "Apple fiber (soluble and insoluble fiber including pectin)",
    "mechanismOfAction": "Forms gel in digestive tract that binds to cholesterol; adds bulk to stool; feeds beneficial gut bacteria; slows glucose absorption"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const AppleFiberHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/apple-orchard-bg.jpg')`,
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
            <p className="text-green-500 font-semibold">Premium Ingredient</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Premium Apple Fiber<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A gentle yet effective source of both soluble and insoluble fiber that supports digestive regularity and helps maintain healthy cholesterol levels.
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
              <Heart className="h-4 w-4 text-green-500 mr-1" />
              <span>Digestive Health</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>Cholesterol Support</span>
            </div>
            <div className="flex items-center">
              <Leaf className="h-4 w-4 text-green-500 mr-1" />
              <span>100% Natural</span>
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
            src="/lovable-uploads/apple-fiber.jpg" 
            alt="Premium Apple Fiber" 
            className="rounded-lg shadow-xl"
            width={600}
            height={400}
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
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
      <Icon className="h-6 w-6 text-green-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const AppleFiber = () => {
  const benefits = [
    {
      title: "Promotes Digestive Regularity",
      description: "The balanced blend of soluble and insoluble fiber helps maintain healthy bowel movements and prevents constipation naturally and gently.",
      icon: Droplets
    },
    {
      title: "Supports Cholesterol Management",
      description: "Soluble fiber, particularly pectin, binds to cholesterol in the digestive tract, helping to reduce its absorption and maintain healthy cholesterol levels.",
      icon: Heart
    },
    {
      title: "Balances Blood Sugar",
      description: "By slowing the absorption of sugar into the bloodstream, apple fiber helps prevent rapid spikes in blood glucose levels after meals.",
      icon: BarChart3
    },
    {
      title: "Promotes Satiety",
      description: "The fiber in apples creates a feeling of fullness, which can help with appetite control and support healthy weight management goals.",
      icon: Shield
    },
    {
      title: "Nourishes Gut Microbiome",
      description: "Acts as a prebiotic, providing nourishment for beneficial gut bacteria and supporting a balanced, diverse microbiome.",
      icon: Sparkles
    },
    {
      title: "Gentle Detoxification",
      description: "Helps bind to and remove toxins from the digestive tract, supporting the body's natural detoxification processes.",
      icon: Leaf
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <IngredientSchema />
      </Head>
      <Header />
      <main className="flex-1">
        <AppleFiberHero />
        
        {/* What is Premium Apple Fiber */}
        <SplitSection
          image="/lovable-uploads/apple-closeup.jpg"
          imageAlt="Fresh Apple Close-up"
          title="What is Premium Apple Fiber?"
          description="A balanced source of both soluble and insoluble fiber derived from carefully selected apples."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Premium Apple Fiber is derived from the pulp and peel of specially selected apples, 
              providing a perfect balance of both soluble and insoluble fiber. This natural fiber 
              source is carefully processed to preserve its nutritional integrity and functional 
              benefits while removing excess sugars and moisture.
            </p>
            <p>
              What makes apple fiber unique is its balanced composition of approximately 2-3% total fiber, 
              with an optimal ratio of soluble to insoluble fiber. The primary soluble fiber in apples 
              is pectin, a gel-forming compound with remarkable health benefits, particularly for 
              cholesterol management and digestive health.
            </p>
            <p>
              Our premium apple fiber undergoes a specialized low-temperature drying process that 
              preserves the functional properties of both fiber types. This gentle processing ensures 
              that the pectin remains intact and effective, while the insoluble fiber maintains its 
              structure for optimal digestive benefits.
            </p>
          </div>
        </SplitSection>
        
        {/* Dual-Fiber Advantage */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="The Dual-Fiber Advantage" 
              description="Understanding the complementary benefits of soluble and insoluble fiber in apples" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Droplets className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-3">Soluble Fiber (Pectin)</h3>
                  <p className="text-gray-600">
                    Dissolves in water to form a gel-like substance that slows digestion, binds to cholesterol, 
                    and helps regulate blood sugar levels. Apple pectin is particularly effective at forming a 
                    viscous gel that traps cholesterol and bile acids, facilitating their removal from the body.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-3">Insoluble Fiber (Cellulose)</h3>
                  <p className="text-gray-600">
                    Doesn't dissolve in water but adds bulk to stool and helps food pass more quickly through 
                    the stomach and intestines. This type of fiber is essential for preventing constipation 
                    and maintaining regular bowel movements, supporting overall digestive health.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-green-700 text-center">Synergistic Effects</h3>
                <p className="text-gray-600 mb-6">
                  The combination of both fiber types in apple fiber creates a synergistic effect that provides 
                  more comprehensive health benefits than either type alone. This balanced approach supports:
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">
                      <strong>Complete Digestive Support:</strong> Addresses multiple aspects of digestive health from transit time to nutrient absorption.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">
                      <strong>Balanced Microbiome:</strong> Different fiber types nourish diverse beneficial bacteria species in the gut.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">
                      <strong>Gentle Yet Effective:</strong> Provides effective benefits without the harsh effects sometimes associated with single-fiber supplements.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Premium Apple Fiber" 
              description="Discover the powerful ways apple fiber supports your digestive and cardiovascular health" 
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
          image="/lovable-uploads/digestive-system-diagram.jpg"
          imageAlt="Digestive System Diagram"
          title="How Apple Fiber Works"
          description="The science behind this gentle yet powerful digestive and heart health supporter"
          reverse
          className="bg-green-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Cholesterol Binding</h4>
                <p className="text-gray-600">
                  The pectin in apple fiber forms a gel-like substance in the digestive tract that binds to 
                  cholesterol and bile acids (which are made from cholesterol). This prevents their reabsorption 
                  and facilitates their elimination from the body, helping to lower blood cholesterol levels.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Stool Bulking</h4>
                <p className="text-gray-600">
                  The insoluble fiber in apples adds bulk to stool and absorbs water, making waste softer 
                  and easier to pass. This helps prevent constipation and supports regular, comfortable 
                  bowel movements without causing dependency or irritation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Prebiotic Activity</h4>
                <p className="text-gray-600">
                  Apple fiber serves as food for beneficial gut bacteria, promoting their growth and activity. 
                  As these bacteria ferment the fiber, they produce short-chain fatty acids (SCFAs) like 
                  butyrate, which nourish colon cells and support gut health.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Blood Sugar Regulation</h4>
                <p className="text-gray-600">
                  The soluble fiber in apples slows the absorption of sugar into the bloodstream by forming 
                  a barrier between carbohydrates and digestive enzymes. This helps prevent rapid spikes in 
                  blood glucose levels after meals, supporting stable energy and metabolic health.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Satiety Signaling</h4>
                <p className="text-gray-600">
                  Apple fiber absorbs water and expands in the stomach, creating a feeling of fullness that 
                  helps regulate appetite and support healthy weight management. This effect is enhanced by 
                  the slower digestion and absorption of nutrients that fiber promotes.
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
                description="Research supporting the benefits of Premium Apple Fiber" 
                centered 
                className="mb-8" 
              />
              
              <div className="bg-green-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  The health benefits of apple fiber are supported by extensive scientific research:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Cholesterol Reduction:</strong> Studies published in the European Food Safety Authority Journal have confirmed that apple pectin can help lower blood cholesterol levels. Research indicates that consuming at least 6g of apple pectin daily can reduce LDL (bad) cholesterol by 5-10%.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Digestive Health:</strong> Research in the Journal of Nutrition has shown that the fiber in apples increases stool bulk and improves transit time, helping to prevent constipation and support regular bowel movements.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Blood Sugar Control:</strong> Studies in the American Journal of Clinical Nutrition have demonstrated that apple fiber can help regulate post-meal blood glucose levels by slowing the absorption of sugar into the bloodstream.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Gut Microbiome:</strong> Research published in Nutrients has shown that apple fiber acts as a prebiotic, promoting the growth of beneficial bacteria like Bifidobacteria and Lactobacilli in the gut, which supports overall digestive and immune health.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Premium apple fiber is not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Nutritional Value */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Nutritional Profile" 
              description="Beyond fiber: The comprehensive nutritional benefits of Premium Apple Fiber" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Fiber Composition</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Total Dietary Fiber:</strong> Approximately 70-80% by weight
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Soluble Fiber:</strong> 20-25% of total fiber, primarily pectin
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Insoluble Fiber:</strong> 75-80% of total fiber, including cellulose and hemicellulose
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Low Caloric Value:</strong> Approximately 2-3 calories per gram
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Additional Nutrients</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Polyphenols:</strong> Natural antioxidants that support cellular health
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Potassium:</strong> Supports healthy blood pressure and fluid balance
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin C:</strong> Trace amounts that contribute to antioxidant activity
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Quercetin:</strong> A flavonoid with anti-inflammatory properties
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Frequently Asked Questions" 
              description="Common questions about Premium Apple Fiber" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How is apple fiber different from other fiber supplements?</h3>
                  <p className="text-gray-600">
                    Apple fiber offers a unique advantage by providing a natural balance of both soluble and insoluble 
                    fiber in one ingredient. Unlike some fiber supplements that contain only one type of fiber, 
                    apple fiber delivers the benefits of both: soluble fiber (primarily pectin) for cholesterol 
                    management and blood sugar regulation, and insoluble fiber for digestive regularity. Additionally, 
                    apple fiber is generally gentler on the digestive system than some other fiber sources, making it 
                    suitable for sensitive individuals.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How much apple fiber should I consume daily?</h3>
                  <p className="text-gray-600">
                    For general digestive health, most adults benefit from 3-5 grams of apple fiber daily. For 
                    cholesterol management, research suggests that 6-10 grams daily may be more effective. It's 
                    best to start with a lower amount and gradually increase to allow your digestive system to 
                    adjust. Our Total Essential products contain an optimal dose of apple fiber as part of a 
                    comprehensive fiber blend designed for digestive wellness and heart health.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Can apple fiber cause digestive discomfort?</h3>
                  <p className="text-gray-600">
                    Apple fiber is generally well-tolerated and gentler than many other fiber sources. However, 
                    as with any fiber supplement, some individuals may experience mild gas or bloating when first 
                    introducing it, particularly if they're not accustomed to a fiber-rich diet. Starting with a 
                    smaller amount and gradually increasing intake allows your digestive system to adapt. It's also 
                    important to drink plenty of water when consuming fiber supplements to help them work effectively.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How quickly will I notice benefits from taking apple fiber?</h3>
                  <p className="text-gray-600">
                    The timeframe for experiencing benefits varies depending on the specific benefit and individual factors. 
                    Many people notice improvements in digestive regularity within a few days of consistent use. 
                    Cholesterol-lowering effects typically take 4-8 weeks of regular consumption to become measurable. 
                    For optimal results, apple fiber should be taken daily as part of a balanced diet and healthy lifestyle.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Can apple fiber interact with medications?</h3>
                  <p className="text-gray-600">
                    Fiber supplements, including apple fiber, may affect the absorption of certain medications by binding 
                    to them or slowing their absorption in the digestive tract. To minimize potential interactions, it's 
                    generally recommended to take medications at least 1-2 hours before or after consuming fiber supplements. 
                    If you're taking prescription medications, especially those for diabetes, cholesterol, or thyroid conditions, 
                    consult with your healthcare provider before adding apple fiber to your regimen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-green-50 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Benefits of Premium Apple Fiber</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our premium supplements harness the power of apple fiber to support your digestive health, cholesterol management, and overall wellness.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products/total-essential">
                <Button variant="premium" size="lg">
                  Shop Total Essential
                </Button>
              </Link>
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
    </div>
  );
};

export default AppleFiber;
