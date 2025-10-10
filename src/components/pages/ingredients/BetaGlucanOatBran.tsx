'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Activity } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Beta-Glucan Oat Bran",
    "description": "A powerful soluble fiber extracted from oat bran that helps lower cholesterol levels, regulate blood sugar, and promote heart health.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Cardiology",
      "Endocrinology",
      "Nutrition"
    ],
    "activeIngredient": "Beta-glucan soluble fiber",
    "mechanismOfAction": "Forms a gel-like substance that binds to cholesterol; slows glucose absorption; promotes heart health through multiple pathways"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const BetaGlucanHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
      style={{
        backgroundImage: `url('/assets/webp/16x9_a_pile_of_oats_and_oat_straws_ar.webp')`,
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
              Beta-Glucan Oat Bran<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A powerful soluble fiber that helps lower cholesterol levels, regulate blood sugar, and promote heart health. Our premium oat bran is carefully processed to preserve maximum nutritional benefits.
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
              <span>Heart Healthy</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>Clinically Proven</span>
            </div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-green-500 mr-1" />
              <span>FDA Approved Claims</span>
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="mx-auto flex items-center justify-center" 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/assets/webp/16x9_a_pile_of_oats_and_oat_straws_ar.webp"
            alt="Beta-Glucan Oat Bran - Heart-healthy fiber for cholesterol management"
            className="rounded-lg shadow-xl"
            width={1280}
            height={720}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
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

const BetaGlucanOatBran = () => {
  const benefits = [
    {
      title: "Lowers Cholesterol",
      description: "Beta-glucan forms a gel-like substance that binds to cholesterol-rich bile acids in the intestines, preventing their reabsorption and lowering blood cholesterol levels.",
      icon: Heart
    },
    {
      title: "Regulates Blood Sugar",
      description: "The soluble fiber in beta-glucan slows the absorption of glucose into the bloodstream, helping to maintain stable blood sugar levels and improve insulin sensitivity.",
      icon: BarChart3
    },
    {
      title: "Promotes Heart Health",
      description: "Regular consumption of beta-glucan has been shown to reduce the risk of heart disease through multiple mechanisms, including cholesterol reduction and improved vascular function.",
      icon: Activity
    },
    {
      title: "Supports Digestive Health",
      description: "Beta-glucan promotes the growth of beneficial gut bacteria, enhances digestive function, and helps maintain regular bowel movements.",
      icon: Shield
    },
    {
      title: "Enhances Immune Function",
      description: "Research shows that beta-glucan can modulate immune response, enhancing the body's ability to fight infections and reduce inflammation.",
      icon: Microscope
    },
    {
      title: "Promotes Satiety",
      description: "The viscous nature of beta-glucan slows digestion and helps you feel fuller longer, supporting healthy weight management and reducing calorie intake.",
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
        <BetaGlucanHero />
        
        {/* What is Beta-Glucan Oat Bran */}
        <SplitSection
          image="/assets/webp/16x9_a_pile_of_oats_and_oat_straws_ar.webp"
          imageAlt="Beta-Glucan Oat Bran - Premium oats and oat straws"
          title="What is Beta-Glucan Oat Bran?"
          description="A powerful soluble fiber with exceptional health benefits, backed by extensive scientific research."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Beta-glucan is a soluble fiber found in the cell walls of oats, barley, and certain fungi. 
              Oat bran is particularly rich in beta-glucan, containing the highest concentration of this 
              beneficial fiber. Beta-glucan is classified as a polysaccharide—a large molecule made up of 
              multiple sugar units linked together in a specific structure that gives it unique properties.
            </p>
            <p>
              What makes beta-glucan especially valuable is its ability to form a viscous, gel-like substance 
              when mixed with liquids. This gel-forming property is responsible for many of its health benefits, 
              particularly its cholesterol-lowering and blood sugar-regulating effects. The viscosity slows 
              digestion and the absorption of nutrients, helping to control blood sugar levels and bind to 
              cholesterol in the digestive tract.
            </p>
            <p>
              Beta-glucan from oats is so well-researched and effective that it has received approval from 
              health authorities worldwide for health claims related to cholesterol reduction and heart health. 
              The FDA allows foods containing oat beta-glucan to carry the claim that they may reduce the risk 
              of heart disease when consumed as part of a diet low in saturated fat and cholesterol.
            </p>
          </div>
        </SplitSection>
        
        {/* Processing Method */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Premium Processing Method" 
              description="How we extract and preserve beta-glucan from premium oat bran" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-3">Selective Sourcing</h3>
                  <p className="text-gray-600">
                    We source only high-quality, non-GMO oats with naturally high beta-glucan content from sustainable farms.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-3">Gentle Extraction</h3>
                  <p className="text-gray-600">
                    Using a proprietary low-temperature process that preserves the molecular structure and functional properties of beta-glucan.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-3">Quality Verification</h3>
                  <p className="text-gray-600">
                    Each batch is tested to ensure optimal beta-glucan content, molecular weight, and viscosity for maximum health benefits.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our careful processing ensures that our Beta-Glucan Oat Bran retains its full functional properties 
                  and health benefits. Unlike heavily processed oat products that may lose their effectiveness, 
                  our premium oat bran delivers the clinically proven benefits that have been documented in 
                  scientific research.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Beta-Glucan Oat Bran" 
              description="Discover the powerful ways Beta-Glucan Oat Bran supports your health and wellness" 
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
          image="/assets/webp/16x9_a_pile_of_oats_and_oat_straws_ar.webp"
          imageAlt="Beta-Glucan Oat Bran - Scientific mechanism illustration"
          title="How Beta-Glucan Works"
          description="The science behind this powerful soluble fiber"
          reverse
          className="bg-green-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Cholesterol Reduction</h4>
                <p className="text-gray-600">
                  Beta-glucan forms a viscous gel in the digestive tract that binds to cholesterol-rich bile acids, 
                  preventing their reabsorption and promoting their excretion. This forces the liver to use more 
                  cholesterol to produce new bile acids, effectively lowering blood cholesterol levels.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Blood Sugar Control</h4>
                <p className="text-gray-600">
                  The viscous gel formed by beta-glucan slows the emptying of the stomach and creates a barrier 
                  between digestive enzymes and food, slowing the absorption of glucose into the bloodstream 
                  and preventing rapid spikes in blood sugar levels.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Gut Microbiome Support</h4>
                <p className="text-gray-600">
                  Beta-glucan serves as a prebiotic, providing food for beneficial gut bacteria. These bacteria 
                  ferment beta-glucan to produce short-chain fatty acids that nourish colon cells and provide 
                  various health benefits.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Immune Modulation</h4>
                <p className="text-gray-600">
                  Beta-glucan interacts with immune cells like macrophages and neutrophils, enhancing their 
                  function and helping to regulate immune response. This can improve the body's ability to 
                  fight infections while reducing inappropriate inflammation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Satiety Promotion</h4>
                <p className="text-gray-600">
                  The viscous nature of beta-glucan increases the volume and thickness of food in the digestive 
                  tract, creating a feeling of fullness that helps control appetite and reduce overall calorie intake.
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
                description="Research supporting the benefits of Beta-Glucan Oat Bran" 
                centered 
                className="mb-8" 
              />
              
              <div className="bg-green-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  Beta-glucan from oats is one of the most extensively researched dietary fibers, with numerous 
                  clinical studies demonstrating its health benefits. The evidence is so compelling that health 
                  authorities worldwide have approved specific health claims for beta-glucan:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Cholesterol Reduction:</strong> A meta-analysis of 28 clinical trials published in the American Journal of Clinical Nutrition found that consuming 3 grams of oat beta-glucan daily reduced total cholesterol by 5-7% and LDL ("bad") cholesterol by 7-10%.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Blood Sugar Control:</strong> Multiple clinical studies have shown that beta-glucan can reduce post-meal blood glucose and insulin responses by 20-30% and improve insulin sensitivity in both healthy individuals and those with type 2 diabetes.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Heart Disease Risk:</strong> The FDA has approved the health claim that consuming at least 3 grams of beta-glucan daily, as part of a diet low in saturated fat and cholesterol, may reduce the risk of heart disease.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Weight Management:</strong> Research published in the Journal of Nutrition found that beta-glucan increased satiety hormones and reduced hunger, leading to lower calorie intake in subsequent meals.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Beta-Glucan Oat Bran is not intended to diagnose, treat, cure, or prevent any disease.
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
              description="Understanding the unique profile of Beta-Glucan Oat Bran" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Key Components</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Beta-Glucan:</strong> High concentration of this soluble fiber (minimum 5%)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Total Dietary Fiber:</strong> Approximately 15-18% by weight
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Protein:</strong> Contains high-quality plant protein (approximately 15-20%)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamins & Minerals:</strong> Good source of B-vitamins, iron, magnesium, and zinc
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Health Impact</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          Clinically proven to lower cholesterol and reduce the risk of heart disease
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          Helps regulate blood sugar levels and improve insulin sensitivity
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          Supports a healthy gut microbiome and promotes digestive regularity
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
        <section className="bg-green-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <Heading 
              title="Harness the Power of Beta-Glucan" 
              description="Incorporate the clinically proven benefits of Beta-Glucan Oat Bran into your daily routine for a healthier heart and improved wellness." 
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
              <Link href="/products/total-essential-plus">
                <Button size="xl" variant="outline">
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

export default BetaGlucanOatBran;
