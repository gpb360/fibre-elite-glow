'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Droplets, Shield, Heart, ArrowRight, Microscope, Leaf, BarChart3, Brain, Check, Activity } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Cranberry",
    "description": "A tart superfood known for its ability to support urinary tract health, provide antioxidant protection, and boost the immune system.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Urology",
      "Nephrology",
      "Nutrition"
    ],
    "activeIngredient": "Proanthocyanidins (PACs)",
    "mechanismOfAction": "Prevents bacteria from adhering to the urinary tract walls, provides antioxidant effects, and supports immune function."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const CranberryHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/assets/webp/16x9_a_close_up_shot_cranberry_.webp')`,
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
            <p className="text-red-700 font-semibold">Premium Superfood</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Cranberry<span className="text-red-700">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Harness the power of cranberries to support urinary tract health, fight oxidative stress, and boost your immune system. Our premium cranberry extract is rich in proanthocyanidins.
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
              <Droplets className="h-4 w-4 text-red-700 mr-1" />
              <span>Urinary Health</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-red-700 mr-1" />
              <span>Antioxidant Power</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-red-700 mr-1" />
              <span>Gut & Heart Health</span>
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="mx-auto flex items-center justify-center relative" 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.7 }}
        >
          <Image 
            src="/assets/webp/16x9_a_close_up_shot_cranberry_.webp" 
            alt="Fresh cranberries close-up showing their natural vibrant red color and texture" 
            width={700}
            height={400}
            className="rounded-lg shadow-xl"
            priority={false}
            sizes="(max-width: 768px) 100vw, 700px"
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
      <Icon className="h-6 w-6 text-red-700" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const Cranberry = () => {
  const benefits = [
    {
      title: "Supports Urinary Tract Health",
      description: "Cranberries contain proanthocyanidins (PACs) that prevent bacteria from sticking to the urinary tract walls, reducing the risk of infections.",
      icon: Droplets
    },
    {
      title: "Rich in Antioxidants",
      description: "Loaded with antioxidants like Vitamin C and flavonoids, cranberries help protect your body from damage caused by free radicals.",
      icon: Shield
    },
    {
      title: "Boosts Immune Function",
      description: "The high Vitamin C content in cranberries helps strengthen the immune system, keeping you healthy and resilient.",
      icon: Activity
    },
    {
      title: "Promotes Gut Health",
      description: "Cranberries can help balance gut bacteria by promoting beneficial bacteria and inhibiting the growth of harmful ones.",
      icon: Leaf
    },
    {
      title: "Supports Heart Health",
      description: "The polyphenols in cranberries may help improve cholesterol levels, lower blood pressure, and support overall cardiovascular function.",
      icon: Heart
    },
    {
      title: "Enhances Oral Hygiene",
      description: "The same anti-adhesion properties that help the urinary tract also help prevent bacteria from sticking to teeth, promoting better oral health.",
      icon: Microscope
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <IngredientSchema />
      </Head>
      <Header />
      <main className="flex-1">
        <CranberryHero />
        
        {/* What is Cranberry */}
        <SplitSection
          image="/lovable-uploads/cranberry-closeup.jpg"
          imageAlt="Cranberry Close-up"
          title="What is Cranberry?"
          description="A tart, vibrant red berry renowned for its powerful health-promoting properties."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Cranberries are small, tart berries that grow on evergreen dwarf shrubs. While they are a popular holiday food, their health benefits have made them a staple in natural wellness for centuries. Cranberries are most famous for their role in supporting urinary tract health, but their benefits extend much further.
            </p>
            <p>
              The key to cranberry's power lies in a unique type of antioxidant called A-type proanthocyanidins (PACs). These compounds have a special structure that makes it difficult for harmful bacteria, particularly E. coli, to adhere to the lining of the urinary tract, helping to prevent infections.
            </p>
            <p>
              In addition to PACs, cranberries are packed with other antioxidants, vitamins, and fiber. Our premium cranberry extract is concentrated to provide a potent dose of these beneficial compounds, offering a convenient way to support your overall health.
            </p>
          </div>
        </SplitSection>
        
        {/* Processing Method */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Premium Processing Method" 
              description="How we concentrate the power of cranberries" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-red-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-700 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-3">Selective Sourcing</h3>
                  <p className="text-gray-600">
                    We source high-quality cranberries from trusted North American farms known for their rich PAC content.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-red-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-700 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-3">Advanced Extraction</h3>
                  <p className="text-gray-600">
                    A proprietary water-based extraction process is used to concentrate the PACs and other beneficial compounds without harsh solvents.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-red-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-700 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-3">Standardized Potency</h3>
                  <p className="text-gray-600">
                    Each batch is standardized to ensure a consistent and potent dose of proanthocyanidins for reliable health benefits.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our commitment to quality ensures you receive a cranberry extract that is both pure and powerful, delivering the targeted support you need for urinary health and beyond.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Cranberry" 
              description="Discover the powerful ways Cranberry supports your health and wellness" 
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
          image="/lovable-uploads/urinary-tract-diagram.jpg"
          imageAlt="Cranberry Urinary Tract Mechanism"
          title="How Cranberry Works"
          description="The science behind this protective berry"
          reverse
          className="bg-red-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-red-700" />
              </div>
              <div>
                <h4 className="font-medium text-red-800">Preventing Bacterial Adhesion</h4>
                <p className="text-gray-600">
                  The A-type proanthocyanidins (PACs) in cranberries have a unique structure that creates an anti-stick coating on the walls of the urinary tract. This makes it difficult for E. coli and other bacteria to attach and cause infection.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-red-700" />
              </div>
              <div>
                <h4 className="font-medium text-red-800">Providing Antioxidant Defense</h4>
                <p className="text-gray-600">
                  Cranberries are rich in various antioxidants that help neutralize free radicals throughout the body, protecting cells from oxidative stress and supporting overall health.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-red-700" />
              </div>
              <div>
                <h4 className="font-medium text-red-800">Supporting a Healthy Gut</h4>
                <p className="text-gray-600">
                  The compounds in cranberries can help promote a healthy balance of microorganisms in the gut, which is essential for proper digestion and immune function.
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
                description="Research supporting the benefits of Cranberry" 
                centered 
                className="mb-8" 
              />
              
              <div className="bg-red-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  Cranberry is one of the most well-researched natural supplements for urinary tract health, with numerous studies confirming its efficacy.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Urinary Tract Infection (UTI) Prevention:</strong> A landmark review by Cochrane, a global independent health network, concluded that cranberry products can help prevent UTIs in women with recurrent infections.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Mechanism of Action:</strong> Research published in the American Journal of Obstetrics and Gynecology confirmed that the proanthocyanidins (PACs) in cranberries are responsible for the anti-adhesion effect on bacteria.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Cardiovascular Benefits:</strong> A study in the British Journal of Nutrition showed that daily consumption of cranberry juice improved several risk factors for cardiovascular disease, including blood pressure and cholesterol levels.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Cranberry is not intended to diagnose, treat, cure, or prevent any disease.
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
              description="Understanding the protective profile of Cranberry" 
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
                          <svg className="h-3 w-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>A-type Proanthocyanidins (PACs):</strong> The key active compound for urinary tract health.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin C:</strong> A powerful antioxidant that supports immune function.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Dietary Fiber:</strong> Supports digestive health and regularity.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-red-700">Other Nutrients</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Manganese:</strong> An essential mineral for metabolism and bone health.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-red-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin E & K1:</strong> Important fat-soluble vitamins.
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
              title="Protect Your Health Naturally" 
              description="Incorporate the protective power of cranberry into your daily wellness routine." 
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

export default Cranberry;