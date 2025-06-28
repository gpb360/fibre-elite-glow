'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Prebiotic Powerhouse",
    "description": "Specialized plant fibers that feed beneficial bacteria in the gut, supporting digestive health and immune function without introducing foreign bacteria.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition"
    ],
    "activeIngredient": "Various types of oligosaccharides including fructo-oligosaccharides (FOS), galacto-oligosaccharides (GOS), and xylo-oligosaccharides (XOS)",
    "mechanismOfAction": "Selectively feeds beneficial gut bacteria; promotes production of short-chain fatty acids; supports gut barrier integrity"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const PrebioticPowerhouseHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/prebiotics-bg.jpg')`,
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
              Prebiotic Powerhouse<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Specialized plant fibers that feed the beneficial bacteria already living in your gut, supporting a naturally healthy digestive ecosystem.
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
              <Microscope className="h-4 w-4 text-green-500 mr-1" />
              <span>Microbiome Support</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>100% Natural</span>
            </div>
            <div className="flex items-center">
              <Microscope className="h-4 w-4 text-green-500 mr-1" />
              <span>Scientifically Proven</span>
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
            src="/lovable-uploads/prebiotics.jpg" 
            alt="Prebiotic Powerhouse"
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

const PrebioticPowerhouse = () => {
  const benefits = [
    {
      title: "Promotes Beneficial Bacteria",
      description: "Selectively feeds beneficial bacteria like Bifidobacteria and Lactobacilli, helping them thrive and outcompete potentially harmful bacteria in your gut.",
      icon: Microscope
    },
    {
      title: "Enhances Digestive Health",
      description: "Supports regular bowel movements, reduces digestive discomfort, and helps maintain a healthy intestinal environment.",
      icon: Heart
    },
    {
      title: "Produces Short-Chain Fatty Acids",
      description: "When fermented by gut bacteria, prebiotics produce short-chain fatty acids that nourish colon cells and provide numerous health benefits.",
      icon: Sparkles
    },
    {
      title: "Supports Immune Function",
      description: "Strengthens the gut-associated immune system, which makes up approximately 70% of the body's immune tissue, enhancing overall immunity.",
      icon: Shield
    },
    {
      title: "Improves Mineral Absorption",
      description: "Enhances the absorption of essential minerals like calcium and magnesium by making them more bioavailable in the digestive tract.",
      icon: BarChart3
    },
    {
      title: "Maintains Gut Barrier Integrity",
      description: "Helps maintain the integrity of the intestinal barrier, preventing leaky gut and reducing systemic inflammation.",
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
        <PrebioticPowerhouseHero />
        
        {/* What is the Prebiotic Powerhouse */}
        <SplitSection
          image="/lovable-uploads/gut-microbiome.jpg"
          imageAlt="Gut Microbiome Illustration"
          title="What is the Prebiotic Powerhouse?"
          description="Specialized plant fibers that nourish beneficial bacteria in your digestive system."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Prebiotic oligosaccharides are specialized plant fibers that resist digestion in the human small intestine 
              and reach the colon where they are selectively fermented by beneficial bacteria. Unlike probiotics, which 
              introduce new bacteria into your gut, prebiotics feed the beneficial bacteria already present in your digestive system.
            </p>
            <p>
              These non-digestible carbohydrates act as food for probiotics, the beneficial bacteria in your gut. When prebiotics 
              are fermented by your gut microbiota, they produce short-chain fatty acids (SCFAs) like acetate, propionate, and butyrate, 
              which provide numerous health benefits.
            </p>
            <p>
              Oligosaccharides are chains of simple sugars linked together, with the prefix "oligo" meaning "few." They typically 
              contain 3-10 sugar molecules. The most common types include fructo-oligosaccharides (FOS), galacto-oligosaccharides (GOS), 
              and xylo-oligosaccharides (XOS), each with unique structures and slightly different benefits.
            </p>
          </div>
        </SplitSection>
        
        {/* Types of Prebiotics */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Types of Prebiotics"
              description="Different varieties with unique structures and benefits" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-3">Fructo-oligosaccharides (FOS)</h3>
                  <p className="text-gray-600">
                    Derived from fruits, vegetables, and grains like chicory root and Jerusalem artichoke. FOS particularly stimulates the growth of Bifidobacteria.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Droplets className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-3">Galacto-oligosaccharides (GOS)</h3>
                  <p className="text-gray-600">
                    Naturally found in human milk and produced from lactose. GOS closely mimics the prebiotic effects of human milk oligosaccharides.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-3">Xylo-oligosaccharides (XOS)</h3>
                  <p className="text-gray-600">
                    Derived from plant cell walls and bamboo shoots. XOS has potent prebiotic effects even at lower doses compared to other prebiotics.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Each type of prebiotic oligosaccharide has unique properties and benefits. Our formulations 
                  incorporate a balanced blend of these prebiotics to provide comprehensive support for your 
                  gut microbiome and overall digestive health.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of the Prebiotic Powerhouse"
              description="Discover how these specialized fibers support your overall health and wellness" 
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
        
        {/* How They Work */}
        <SplitSection
          image="/lovable-uploads/gut-bacteria.jpg"
          imageAlt="Beneficial Gut Bacteria"
          title="How the Prebiotic Powerhouse Works"
          description="The science behind these powerful gut-supporting fibers"
          reverse
          className="bg-green-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Selective Fermentation</h4>
                <p className="text-gray-600">
                  Prebiotic oligosaccharides resist digestion in the small intestine and reach the colon intact, 
                  where they are selectively fermented by beneficial bacteria like Bifidobacteria and Lactobacilli.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Production of Short-Chain Fatty Acids</h4>
                <p className="text-gray-600">
                  When beneficial bacteria ferment prebiotics, they produce short-chain fatty acids (SCFAs) 
                  like butyrate, acetate, and propionate, which nourish colon cells and provide numerous health benefits.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Competitive Inhibition</h4>
                <p className="text-gray-600">
                  By promoting the growth of beneficial bacteria, prebiotics help crowd out potentially harmful 
                  bacteria through competitive inhibition, improving the overall balance of your gut microbiome.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">pH Modulation</h4>
                <p className="text-gray-600">
                  SCFAs produced during fermentation lower the pH in the colon, creating an environment 
                  that favors beneficial bacteria while inhibiting the growth of pathogenic organisms.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Enhanced Barrier Function</h4>
                <p className="text-gray-600">
                  Prebiotics help maintain the integrity of the intestinal barrier, preventing "leaky gut" 
                  and reducing the risk of harmful substances entering the bloodstream.
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
                description="Research supporting the benefits of the Prebiotic Powerhouse"
                centered 
                className="mb-8" 
              />
              
              <div className="bg-green-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  Extensive scientific research has demonstrated the significant health benefits of prebiotic oligosaccharides 
                  for digestive health and overall wellness. Clinical studies have shown that regular consumption of prebiotics can:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Increase Beneficial Bacteria:</strong> Multiple studies have shown that prebiotic oligosaccharides significantly increase the population of beneficial Bifidobacteria and Lactobacilli in the gut.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Improve Digestive Health:</strong> Research has demonstrated that prebiotics can reduce symptoms of irritable bowel syndrome (IBS), constipation, and other digestive disorders.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Enhance Immune Function:</strong> Studies indicate that prebiotics can modulate immune responses and reduce the risk of infections and allergies, particularly in children.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Support Metabolic Health:</strong> Research shows that prebiotics may help regulate blood sugar levels, improve insulin sensitivity, and support healthy cholesterol levels.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Prebiotic oligosaccharides are not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Nutritional Value */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Nutritional Benefits" 
              description="Understanding the unique nutritional profile of the Prebiotic Powerhouse"
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Key Properties</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Low Caloric Value:</strong> Provides minimal calories while offering significant health benefits
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Non-Digestible:</strong> Resists digestion in the small intestine to reach the colon intact
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Selective Fermentation:</strong> Specifically nourishes beneficial bacteria in the gut
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>100% Natural:</strong> Derived from plant sources without synthetic additives
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Health Contributions</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Enhanced Mineral Absorption:</strong> Improves calcium and magnesium uptake
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>SCFA Production:</strong> Generates beneficial short-chain fatty acids that nourish colon cells
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Immune Modulation:</strong> Supports healthy immune system function through gut-associated lymphoid tissue
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Anti-Inflammatory Effects:</strong> Helps reduce intestinal and systemic inflammation
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
              description="Common questions about Prebiotic Oligosaccharides" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">What's the difference between prebiotics and probiotics?</h3>
                  <p className="text-gray-600">
                    Prebiotics are specialized plant fibers that feed the beneficial bacteria already living in your gut, 
                    while probiotics are live beneficial bacteria that you add to your digestive system. Prebiotics essentially 
                    serve as food for probiotics, helping them thrive and maintain a healthy balance in your gut microbiome.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How much prebiotic fiber should I consume daily?</h3>
                  <p className="text-gray-600">
                    Most research suggests that 5-8 grams of prebiotic fiber per day is beneficial for gut health. 
                    Our Total Essential products provide an optimal dose of prebiotic oligosaccharides as part of 
                    a balanced approach to digestive wellness.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Can prebiotic oligosaccharides cause digestive discomfort?</h3>
                  <p className="text-gray-600">
                    Some people may experience mild gas or bloating when first introducing prebiotics into their diet, 
                    as the gut microbiome adjusts to the increased fiber. This is typically temporary and subsides as 
                    your digestive system adapts. Starting with smaller amounts and gradually increasing intake can help minimize any discomfort.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Are prebiotic oligosaccharides suitable for everyone?</h3>
                  <p className="text-gray-600">
                    Prebiotic oligosaccharides are generally safe for most people. However, individuals with specific 
                    digestive conditions like SIBO (Small Intestinal Bacterial Overgrowth) or certain types of IBS may 
                    need to approach prebiotics with caution. As with any supplement, it's advisable to consult with 
                    your healthcare provider before adding prebiotics to your regimen.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How quickly will I notice benefits from taking prebiotic oligosaccharides?</h3>
                  <p className="text-gray-600">
                    The timeframe varies from person to person. Some individuals notice improvements in digestive 
                    comfort within a few days, while others may take several weeks to experience the full benefits. 
                    Consistency is key—regular consumption of prebiotics supports long-term gut health and overall wellness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-green-50 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Benefits of Prebiotic Oligosaccharides</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our premium supplements harness the power of prebiotic oligosaccharides to support your digestive health and overall wellness.
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

export default PrebioticPowerhouse;
