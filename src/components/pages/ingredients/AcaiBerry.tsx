'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, Shield, Sun, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Activity } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Acai Berry",
    "description": "A powerful superfood rich in antioxidants that supports cellular health, boosts energy levels, and promotes vibrant skin.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Dermatology",
      "Nutrition",
      "Anti-Aging"
    ],
    "activeIngredient": "Anthocyanins, polyphenols, and other antioxidants",
    "mechanismOfAction": "Neutralizes free radicals, reduces oxidative stress, and supports cellular regeneration"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const AcaiBerryHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div className="absolute inset-0 z-0 opacity-20">
      <Image
        src="/assets/webp/16x9_A_cluster_of_acai_berries.webp"
        alt="Fresh acai berries cluster on branch - superfruit antioxidant ingredient for Total Essential fiber supplement"
        fill
        className="object-cover"
        priority={false}
      />
    </div>
    
    <div className="container px-4 md:px-6 relative z-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
        <div className="flex flex-col justify-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <p className="text-purple-500 font-semibold">Premium Superfood</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Acai Berry<span className="text-purple-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A potent superfood packed with antioxidants to support cellular health, boost energy, and promote radiant skin. Our premium Acai Berry is sustainably sourced and carefully processed.
            </p>
          </motion.div>
          <motion.div 
            className="flex flex-col gap-2 min-[400px]:flex-row" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/products/total-essential-plus">
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
              <Zap className="h-4 w-4 text-purple-500 mr-1" />
              <span>Antioxidant Rich</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-purple-500 mr-1" />
              <span>Cellular Health</span>
            </div>
            <div className="flex items-center">
              <Sun className="h-4 w-4 text-purple-500 mr-1" />
              <span>Skin Vitality</span>
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
            src="/assets/webp/16x9_A_cluster_of_acai_berries.webp"
            alt="Acai Berry - Powerful antioxidant superfruit for energy and recovery" 
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
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
      <Icon className="h-6 w-6 text-purple-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const AcaiBerry = () => {
  const benefits = [
    {
      title: "Powerful Antioxidant",
      description: "Acai berries are loaded with anthocyanins, which neutralize free radicals and protect cells from oxidative damage.",
      icon: Shield
    },
    {
      title: "Boosts Energy Levels",
      description: "The unique nutritional profile of acai helps increase stamina and combat fatigue, providing a natural energy boost.",
      icon: Zap
    },
    {
      title: "Promotes Skin Health",
      description: "The antioxidants in acai help protect the skin from environmental stressors, promoting a youthful and radiant complexion.",
      icon: Sun
    },
    {
      title: "Supports Brain Function",
      description: "Acai's anti-inflammatory properties may protect brain cells from damage, supporting cognitive function and memory.",
      icon: Brain
    },
    {
      title: "Enhances Heart Health",
      description: "The anthocyanins in acai may help lower cholesterol levels and support overall cardiovascular health.",
      icon: Activity
    },
    {
      title: "Aids in Digestion",
      description: "Acai berries contain natural fiber that supports a healthy digestive system and promotes regular bowel movements.",
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
        <AcaiBerryHero />
        
        {/* What is Acai Berry */}
        <SplitSection
          image="/lovable-uploads/acai-closeup.jpg"
          imageAlt="Acai Berry Close-up"
          title="What is Acai Berry?"
          description="A deep purple superfood from the Amazon rainforest, celebrated for its exceptional antioxidant content."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Acai Berry is a small, dark purple fruit that grows on the acai palm tree in the Amazon rainforest. For centuries, it has been a staple food for indigenous communities, prized for its ability to provide energy and vitality. Today, acai is recognized globally as a superfood due to its incredible concentration of antioxidants, particularly anthocyanins, which give the berry its deep color.
            </p>
            <p>
              These powerful antioxidants help combat oxidative stress, a key factor in aging and various health issues. In addition to antioxidants, acai berries are a good source of fiber, healthy fats, and essential nutrients, making them a valuable addition to a healthy diet.
            </p>
            <p>
              Our Acai Berry is sustainably harvested and freeze-dried to preserve its potent nutritional profile, ensuring you receive the maximum benefits this remarkable superfood has to offer.
            </p>
          </div>
        </SplitSection>
        
        {/* Processing Method */}
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Premium Processing Method" 
              description="How we capture the full power of Acai Berry" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-purple-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-3">Sustainable Harvesting</h3>
                  <p className="text-gray-600">
                    We partner with local communities in the Amazon to sustainably harvest ripe acai berries, ensuring environmental protection.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-purple-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-3">Freeze-Drying</h3>
                  <p className="text-gray-600">
                    The berries are immediately freeze-dried to lock in their potent antioxidants, nutrients, and vibrant color without using high heat.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-purple-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-3">Purity Testing</h3>
                  <p className="text-gray-600">
                    Each batch is rigorously tested for purity and potency, ensuring you receive a high-quality product free from contaminants.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our advanced processing ensures that our Acai Berry powder delivers the full spectrum of benefits found in the fresh fruit, providing a convenient and potent source of antioxidants.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Acai Berry" 
              description="Discover the powerful ways Acai Berry supports your health and wellness" 
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
          image="/lovable-uploads/antioxidant-diagram.jpg"
          imageAlt="Acai Berry Antioxidant Mechanism"
          title="How Acai Berry Works"
          description="The science behind this potent superfood"
          reverse
          className="bg-purple-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-purple-800">Neutralizing Free Radicals</h4>
                <p className="text-gray-600">
                  Acai's anthocyanins and other antioxidants donate electrons to unstable free radicals, neutralizing them before they can cause cellular damage and contribute to aging.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-purple-800">Reducing Inflammation</h4>
                <p className="text-gray-600">
                  The polyphenols in acai help modulate inflammatory pathways in the body, reducing chronic inflammation that is linked to various health conditions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-purple-800">Supporting Cellular Repair</h4>
                <p className="text-gray-600">
                  By reducing oxidative stress, acai helps create a healthier environment for cells to repair and regenerate, which is crucial for maintaining healthy tissues and organs.
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
                description="Research supporting the benefits of Acai Berry" 
                centered 
                className="mb-8" 
              />
              
              <div className="bg-purple-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  Acai Berry has been the subject of numerous studies investigating its antioxidant capacity and health benefits. Research highlights its potential in several key areas:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>High Antioxidant Capacity:</strong> Studies published in the Journal of Agricultural and Food Chemistry have shown that acai has a higher antioxidant capacity than many other fruits, effectively increasing antioxidant levels in the blood after consumption.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Cardiovascular Health:</strong> Research suggests that the anthocyanins in acai may help improve cholesterol levels by reducing LDL ("bad") cholesterol and increasing HDL ("good") cholesterol.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Neuroprotective Effects:</strong> Preliminary studies indicate that the anti-inflammatory properties of acai may help protect the brain from age-related damage and support cognitive function.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Acai Berry is not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Nutritional Composition */}
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Nutritional Composition" 
              description="Understanding the unique profile of Acai Berry" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-purple-700">Key Components</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Anthocyanins:</strong> High concentration of these powerful antioxidants.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Healthy Fats:</strong> Rich in omega-3, -6, and -9 fatty acids.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Dietary Fiber:</strong> Supports digestive health and satiety.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-purple-700">Vitamins & Minerals</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin A & C:</strong> Essential for immune function and skin health.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Calcium & Iron:</strong> Important for bone health and oxygen transport.
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
        <section className="bg-purple-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <Heading 
              title="Experience the Power of Acai Berry" 
              description="Incorporate this antioxidant-rich superfood into your daily routine and feel the difference." 
              centered 
              className="mb-8" 
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products/total-essential-plus">
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

export default AcaiBerry;