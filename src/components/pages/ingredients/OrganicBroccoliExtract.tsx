'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Organic Broccoli Extract",
    "description": "A concentrated extract rich in sulforaphane and fiber that supports natural detoxification pathways and provides essential nutrients for digestive and overall health.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition",
      "Preventive Medicine"
    ],
    "activeIngredient": "Sulforaphane and broccoli fiber",
    "mechanismOfAction": "Activates phase II detoxification enzymes; provides dietary fiber for digestive health; delivers antioxidant protection"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const BroccoliExtractHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/broccoli-bg.jpg')`,
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
              Organic Broccoli Extract<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Rich in sulforaphane and fiber, our broccoli extract supports detoxification pathways and provides essential nutrients for digestive and overall health.
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
              <Zap className="h-4 w-4 text-green-500 mr-1" />
              <span>Rich in Sulforaphane</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>100% Organic</span>
            </div>
            <div className="flex items-center">
              <Microscope className="h-4 w-4 text-green-500 mr-1" />
              <span>Scientifically Backed</span>
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
            src="/lovable-uploads/broccoli-extract-hero.jpg" 
            alt="Organic Broccoli Extract" 
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

const OrganicBroccoliExtract = () => {
  const benefits = [
    {
      title: "Powerful Detoxification",
      description: "Sulforaphane activates phase II detoxification enzymes in the liver, helping your body neutralize and eliminate harmful toxins and carcinogens.",
      icon: Zap
    },
    {
      title: "Digestive Health Support",
      description: "The fiber content in broccoli extract promotes regular bowel movements, feeds beneficial gut bacteria, and supports overall digestive function.",
      icon: Heart
    },
    {
      title: "Antioxidant Protection",
      description: "Rich in powerful antioxidants that neutralize free radicals, reducing oxidative stress and protecting cells from damage.",
      icon: Shield
    },
    {
      title: "Anti-Inflammatory Effects",
      description: "Contains compounds that help reduce inflammation throughout the body, supporting overall health and wellbeing.",
      icon: Droplets
    },
    {
      title: "Immune System Support",
      description: "The vitamins, minerals, and bioactive compounds in broccoli extract help strengthen immune function and enhance the body's natural defenses.",
      icon: Microscope
    },
    {
      title: "Cellular Health Promotion",
      description: "Sulforaphane supports the body's natural cellular defense mechanisms, promoting healthy cell function and longevity.",
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
        <BroccoliExtractHero />
        
        {/* What is Organic Broccoli Extract */}
        <SplitSection
          image="/lovable-uploads/broccoli-closeup.jpg"
          imageAlt="Fresh Broccoli Closeup"
          title="What is Organic Broccoli Extract?"
          description="A concentrated form of broccoli's most powerful compounds, carefully extracted to maximize health benefits."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Organic Broccoli Extract is a concentrated form of the beneficial compounds found in broccoli 
              (Brassica oleracea), particularly sulforaphane—a potent plant compound with remarkable health 
              benefits. Our extract is derived from young broccoli sprouts, which contain up to 100 times 
              more sulforaphane than mature broccoli.
            </p>
            <p>
              What makes our Organic Broccoli Extract particularly valuable is its high concentration of 
              sulforaphane, a sulfur-rich compound that belongs to the isothiocyanate family. Sulforaphane 
              is formed when the enzyme myrosinase interacts with glucoraphanin, a process that occurs when 
              broccoli is chopped, chewed, or otherwise damaged. Our specialized extraction process ensures 
              maximum conversion of glucoraphanin to sulforaphane, delivering optimal benefits.
            </p>
            <p>
              In addition to sulforaphane, our Organic Broccoli Extract contains natural fiber, vitamins 
              (including vitamins C, K, and various B vitamins), minerals (such as potassium, calcium, and 
              magnesium), and other beneficial plant compounds. This comprehensive nutritional profile makes 
              it an exceptional ingredient for supporting overall health, with particular benefits for 
              detoxification pathways and digestive wellness.
            </p>
          </div>
        </SplitSection>
        
        {/* Extraction Process */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Premium Extraction Process" 
              description="How we create our high-potency organic broccoli extract" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-3">Organic Cultivation</h3>
                  <p className="text-gray-600">
                    We source broccoli from certified organic farms that use sustainable growing practices, ensuring a pure, pesticide-free raw material.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-3">Enzymatic Activation</h3>
                  <p className="text-gray-600">
                    Our proprietary process activates the myrosinase enzyme to maximize conversion of glucoraphanin to bioactive sulforaphane.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-3">Gentle Extraction</h3>
                  <p className="text-gray-600">
                    Using low-temperature extraction methods to preserve heat-sensitive compounds and maintain the full spectrum of nutrients.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our careful extraction process ensures that our Organic Broccoli Extract retains the maximum 
                  amount of sulforaphane and other beneficial compounds. Each batch is tested for potency and 
                  purity, guaranteeing a consistent, high-quality ingredient that delivers powerful health benefits.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Organic Broccoli Extract" 
              description="Discover the powerful ways Organic Broccoli Extract supports your health and wellness" 
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
          image="/lovable-uploads/detoxification-diagram.jpg"
          imageAlt="Detoxification Pathway Diagram"
          title="How Organic Broccoli Extract Works"
          description="The science behind this powerful detoxification supporter"
          reverse
          className="bg-green-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Activates Detoxification Enzymes</h4>
                <p className="text-gray-600">
                  Sulforaphane activates the Nrf2 pathway, which regulates the expression of phase II detoxification 
                  enzymes. These enzymes neutralize harmful toxins and carcinogens, making them water-soluble so 
                  they can be safely eliminated from the body.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Provides Dietary Fiber</h4>
                <p className="text-gray-600">
                  The fiber in broccoli extract adds bulk to stool, promotes regular bowel movements, and 
                  serves as food for beneficial gut bacteria. These bacteria produce short-chain fatty acids 
                  that nourish colon cells and support digestive health.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Delivers Antioxidant Protection</h4>
                <p className="text-gray-600">
                  The antioxidants in broccoli extract neutralize free radicals—unstable molecules that can 
                  damage cells and contribute to aging and disease. This protection helps maintain cellular 
                  health and function throughout the body.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Reduces Inflammation</h4>
                <p className="text-gray-600">
                  Sulforaphane inhibits the NF-κB pathway, a key regulator of inflammatory responses. By 
                  reducing inflammation, broccoli extract helps protect against chronic diseases and supports 
                  overall health and wellbeing.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Supports Gut Barrier Function</h4>
                <p className="text-gray-600">
                  Compounds in broccoli extract help maintain the integrity of the intestinal barrier, preventing 
                  "leaky gut" and reducing the risk of harmful substances entering the bloodstream.
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
                description="Research supporting the benefits of Organic Broccoli Extract" 
                centered 
                className="mb-8" 
              />
              
              <div className="bg-green-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  Extensive scientific research has demonstrated the significant health benefits of broccoli extract 
                  and its active compound, sulforaphane. Clinical studies have shown that:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Detoxification Support:</strong> Research published in the journal Cancer Prevention Research demonstrated that sulforaphane increases the activity of detoxification enzymes by up to 200%, enhancing the body's ability to eliminate harmful toxins.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Digestive Health:</strong> Studies have shown that the fiber and bioactive compounds in broccoli extract support a healthy gut microbiome, improve digestive function, and may help prevent digestive disorders.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Anti-Inflammatory Effects:</strong> Clinical research published in the Journal of Allergy and Clinical Immunology found that sulforaphane reduces inflammation markers and oxidative stress in human subjects.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Cellular Protection:</strong> Studies published in multiple scientific journals have demonstrated sulforaphane's ability to protect cells against damage from environmental toxins and oxidative stress.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Organic Broccoli Extract is not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Nutritional Composition */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Nutritional Composition" 
              description="Understanding the rich nutrient profile of Organic Broccoli Extract" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Bioactive Compounds</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Sulforaphane:</strong> Potent activator of detoxification enzymes
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Glucosinolates:</strong> Precursors to isothiocyanates like sulforaphane
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Indole-3-Carbinol:</strong> Supports hormone balance and cellular health
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Dietary Fiber:</strong> Supports digestive health and regularity
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Vitamins & Minerals</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin C:</strong> Powerful antioxidant that supports immune function
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin K:</strong> Essential for blood clotting and bone health
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Folate:</strong> Important for cell division and DNA synthesis
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Potassium:</strong> Supports heart health and fluid balance
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Calcium:</strong> Essential for bone health and cellular signaling
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
              description="Common questions about Organic Broccoli Extract" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">What makes sulforaphane in broccoli extract so beneficial?</h3>
                  <p className="text-gray-600">
                    Sulforaphane is a powerful activator of the Nrf2 pathway, which regulates over 200 genes involved in detoxification, antioxidant protection, and cellular defense. This unique mechanism allows sulforaphane to provide comprehensive support for the body's natural detoxification processes and protect cells from damage. Unlike many antioxidants that simply neutralize free radicals, sulforaphane works at the genetic level to enhance the body's own protective mechanisms.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Why is broccoli extract more effective than just eating broccoli?</h3>
                  <p className="text-gray-600">
                    While eating fresh broccoli is certainly healthy, our Organic Broccoli Extract offers several advantages. First, it's concentrated, providing a higher dose of sulforaphane and other beneficial compounds than you could reasonably consume through diet alone. Second, our extract is derived from young broccoli sprouts, which contain up to 100 times more sulforaphane than mature broccoli. Finally, our specialized processing ensures maximum conversion of glucoraphanin to active sulforaphane, optimizing its bioavailability and effectiveness.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How does broccoli extract support digestive health?</h3>
                  <p className="text-gray-600">
                    Broccoli extract supports digestive health through multiple mechanisms. The fiber content promotes regular bowel movements and feeds beneficial gut bacteria. Sulforaphane helps protect the gut lining from damage and inflammation, maintaining the integrity of the intestinal barrier. Additionally, the anti-inflammatory effects of broccoli extract can help soothe digestive discomfort and support overall gut function.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Is Organic Broccoli Extract suitable for everyone?</h3>
                  <p className="text-gray-600">
                    Organic Broccoli Extract is generally safe for most people as part of a balanced diet. However, individuals taking blood-thinning medications should consult with their healthcare provider, as the vitamin K in broccoli extract may interact with these medications. Those with thyroid conditions should also consult their healthcare provider, as compounds in broccoli may affect thyroid function in some individuals. As with any supplement, it's always best to consult with your healthcare provider before adding it to your regimen.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How quickly will I notice benefits from taking Organic Broccoli Extract?</h3>
                  <p className="text-gray-600">
                    The timeframe for experiencing benefits varies from person to person. Some individuals notice improvements in digestive comfort and energy levels within a few days, while the full detoxification and cellular health benefits may develop over several weeks of consistent use. For optimal results, we recommend incorporating Organic Broccoli Extract into your daily wellness routine as part of our Total Essential formula.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-green-50 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Benefits of Organic Broccoli Extract</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our premium supplements harness the power of Organic Broccoli Extract to support your body's natural detoxification processes and overall wellness.
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

export default OrganicBroccoliExtract;
