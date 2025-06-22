'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Zap, Flame } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Organic Broccoli Extract",
    "description": "A natural extract rich in sulforaphane that supports detoxification pathways and provides essential nutrients for digestive and overall health.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition",
      "Preventive Medicine"
    ],
    "activeIngredient": "Sulforaphane and other bioactive compounds",
    "mechanismOfAction": "Activates Nrf2 pathway; induces phase 2 detoxification enzymes; supports gut barrier integrity; exhibits anti-inflammatory and antimicrobial properties"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const OrganicBroccoliExtractHero = () => (
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
              Rich in sulforaphane and fiber, supporting detoxification pathways and providing essential nutrients for digestive and overall health.
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
              <span>Detoxification</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>Antioxidant</span>
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
            src="/lovable-uploads/broccoli-extract.jpg" 
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
      description: "Sulforaphane activates the body's natural detoxification enzymes, helping to neutralize and eliminate harmful toxins and carcinogens.",
      icon: Zap
    },
    {
      title: "Gut Protection",
      description: "Helps protect the gastrointestinal tract from oxidative stress and inflammation, supporting a healthy gut lining and digestion.",
      icon: Heart
    },
    {
      title: "Antimicrobial Properties",
      description: "Research shows sulforaphane has antimicrobial activity against H. pylori and other harmful bacteria that can disrupt digestive health.",
      icon: Shield
    },
    {
      title: "Anti-Inflammatory Effects",
      description: "Reduces inflammation throughout the digestive system and body by inhibiting inflammatory pathways and oxidative stress.",
      icon: Flame
    },
    {
      title: "Supports Digestive Regularity",
      description: "The fiber content in broccoli extract helps promote regular bowel movements and prevents constipation.",
      icon: Droplets
    },
    {
      title: "Cellular Protection",
      description: "Activates the Nrf2 pathway, which triggers the production of antioxidant proteins that protect cells from damage and oxidative stress.",
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
        <OrganicBroccoliExtractHero />
        
        {/* What is Organic Broccoli Extract */}
        <SplitSection
          image="/lovable-uploads/broccoli-closeup.jpg"
          imageAlt="Broccoli Close-up"
          title="What is Organic Broccoli Extract?"
          description="A concentrated source of sulforaphane and other beneficial compounds from premium organic broccoli."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Organic Broccoli Extract is derived from carefully selected, organically grown broccoli 
              (Brassica oleracea), particularly broccoli sprouts which contain the highest concentration 
              of beneficial compounds. The extract is created through a specialized process that preserves 
              and concentrates the bioactive components, especially sulforaphane.
            </p>
            <p>
              Sulforaphane is a powerful phytochemical that belongs to the isothiocyanate family. It's formed 
              when the enzyme myrosinase interacts with glucoraphanin, a compound naturally present in broccoli. 
              This reaction occurs when broccoli is chopped, chewed, or otherwise damaged, creating a natural 
              defense mechanism in the plant that translates to remarkable health benefits for humans.
            </p>
            <p>
              Our organic broccoli extract is carefully processed to maximize sulforaphane content while 
              preserving the natural fiber and other beneficial nutrients. We use a proprietary extraction 
              method that ensures optimal bioavailability and potency, making it significantly more effective 
              than simply consuming raw broccoli.
            </p>
          </div>
        </SplitSection>
        
        {/* Sulforaphane: The Power Compound */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Sulforaphane: The Power Compound" 
              description="Understanding the remarkable bioactive molecule that makes broccoli extract so effective" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Molecular Magic</h3>
                    <p className="text-gray-600 mb-4">
                      Sulforaphane (SFN) has the chemical structure C<sub>6</sub>H<sub>11</sub>NOS<sub>2</sub> and contains 
                      the -N=C=S group that characterizes isothiocyanates. This unique structure is responsible for its 
                      ability to interact with cellular pathways and trigger powerful biological responses.
                    </p>
                    <p className="text-gray-600">
                      What makes sulforaphane particularly special is its ability to cross cell membranes easily and 
                      activate the Nrf2 pathway—a master regulator of antioxidant response that protects cells against 
                      oxidative damage and stress.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Bioavailability Champion</h3>
                    <p className="text-gray-600 mb-4">
                      Sulforaphane is highly bioavailable, meaning it's readily absorbed in the digestive tract and can 
                      quickly reach tissues throughout the body. It peaks in the bloodstream within 1-3 hours after 
                      consumption and remains active for up to 72 hours.
                    </p>
                    <p className="text-gray-600">
                      Our extraction process ensures that the sulforaphane in our broccoli extract is in its most 
                      bioavailable form, maximizing its effectiveness and ensuring consistent results with each dose.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-green-700">How Sulforaphane Works</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">
                        <strong>Nrf2 Activation:</strong> Sulforaphane activates the Nrf2 pathway, which controls the expression of over 200 genes involved in cellular protection and detoxification.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">
                        <strong>Phase 2 Enzyme Induction:</strong> It upregulates phase 2 detoxification enzymes that neutralize harmful compounds and facilitate their elimination from the body.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">
                        <strong>Anti-inflammatory Action:</strong> Sulforaphane inhibits NF-κB, a protein complex that controls inflammation and is linked to many chronic diseases.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">
                        <strong>Gut Microbiome Support:</strong> It selectively targets harmful bacteria while supporting beneficial gut flora, helping to maintain a balanced microbiome.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Organic Broccoli Extract" 
              description="Discover the powerful ways broccoli extract and sulforaphane support your digestive and overall health" 
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
        
        {/* Gut Health Focus */}
        <SplitSection
          image="/lovable-uploads/gut-health-illustration.jpg"
          imageAlt="Gut Health Illustration"
          title="Broccoli Extract & Gut Health"
          description="How sulforaphane specifically supports digestive wellness and gut integrity"
          reverse
          className="bg-green-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Protects Against H. pylori</h4>
                <p className="text-gray-600">
                  Research shows that sulforaphane has potent antibacterial activity against Helicobacter pylori, 
                  a bacterium that can cause gastritis, ulcers, and is linked to stomach cancer. It inhibits bacterial 
                  growth and reduces inflammation in the stomach lining.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Strengthens Gut Barrier Function</h4>
                <p className="text-gray-600">
                  Sulforaphane helps maintain the integrity of the intestinal barrier, preventing "leaky gut" 
                  syndrome where harmful substances can pass through the intestinal wall into the bloodstream, 
                  triggering inflammation and immune responses.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Reduces Digestive Inflammation</h4>
                <p className="text-gray-600">
                  By inhibiting inflammatory pathways, sulforaphane helps reduce inflammation throughout the 
                  digestive tract, which can alleviate symptoms of various digestive disorders and support 
                  overall gut comfort.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Improves Constipation</h4>
                <p className="text-gray-600">
                  Clinical studies have shown that broccoli sprout extract can improve symptoms of constipation, 
                  increasing bowel movement frequency and reducing discomfort. The combination of sulforaphane 
                  and fiber works synergistically to support digestive regularity.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Supports Healthy Microbiome</h4>
                <p className="text-gray-600">
                  Sulforaphane helps create an environment that favors beneficial gut bacteria while 
                  inhibiting harmful pathogens, supporting a balanced and diverse gut microbiome that is 
                  essential for optimal digestive health and overall wellness.
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
                  The health benefits of broccoli extract and sulforaphane are supported by extensive scientific research:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Gastrointestinal Protection:</strong> Studies published in the journal "Nutrients" demonstrate that sulforaphane protects the gastrointestinal tract against H. pylori and NSAID-induced oxidative stress, reducing inflammation and supporting gut barrier function.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Constipation Relief:</strong> A 4-week clinical study involving 48 adults showed that consuming 20 grams of sulforaphane-rich broccoli sprouts daily significantly improved symptoms of constipation compared to control groups.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Detoxification Pathways:</strong> Research from Johns Hopkins University has demonstrated that sulforaphane is a potent inducer of phase 2 detoxification enzymes, enhancing the body's ability to neutralize and eliminate harmful compounds.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Gut Barrier Support:</strong> Studies published in the journal "Gut Microbes" show that sulforaphane helps maintain gut barrier integrity and reduces intestinal permeability ("leaky gut"), which is associated with numerous digestive and systemic health issues.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Organic broccoli extract is not intended to diagnose, treat, cure, or prevent any disease.
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
              description="Beyond sulforaphane: The comprehensive nutritional benefits of Organic Broccoli Extract" 
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
                          <strong>Sulforaphane:</strong> The primary bioactive compound with antioxidant and detoxification properties
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Glucosinolates:</strong> Precursors to sulforaphane with additional health benefits
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
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Indole-3-carbinol:</strong> Supports hormone balance and cellular health
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
                          <strong>Vitamin C:</strong> Powerful antioxidant supporting immune function
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
                          <strong>Chromium:</strong> Supports blood sugar regulation and metabolism
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Potassium:</strong> Essential for fluid balance and nerve function
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
                  <h3 className="text-lg font-semibold mb-2">How is broccoli extract different from eating raw broccoli?</h3>
                  <p className="text-gray-600">
                    While raw broccoli is certainly nutritious, our organic broccoli extract contains a significantly 
                    higher concentration of sulforaphane and other beneficial compounds. The extraction process 
                    maximizes the bioavailability of these compounds, making them more easily absorbed and utilized 
                    by the body. Additionally, the extract eliminates the variability in sulforaphane content that 
                    can occur in raw broccoli due to growing conditions, storage, and preparation methods.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How quickly will I notice benefits from taking broccoli extract?</h3>
                  <p className="text-gray-600">
                    The timeframe for experiencing benefits varies from person to person. Some individuals notice 
                    improvements in digestive comfort and regularity within a few days, while the detoxification 
                    and long-term health benefits may take several weeks of consistent use to become apparent. 
                    For optimal results, we recommend taking broccoli extract daily as part of your regular 
                    wellness routine.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Are there any side effects associated with broccoli extract?</h3>
                  <p className="text-gray-600">
                    Organic broccoli extract is generally well-tolerated by most people. Some individuals may 
                    experience mild digestive symptoms like gas when first introducing it into their diet, which 
                    typically subsides as the body adjusts. Those with thyroid conditions should consult with a 
                    healthcare provider before use, as cruciferous vegetables contain compounds that can affect 
                    thyroid function when consumed in very large amounts. However, the amounts in our supplement 
                    are unlikely to cause issues for most people.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Can broccoli extract interact with medications?</h3>
                  <p className="text-gray-600">
                    Broccoli extract may interact with blood-thinning medications like warfarin due to its vitamin K 
                    content. Additionally, because it affects detoxification pathways, it could potentially influence 
                    the metabolism of certain medications. If you are taking prescription medications, particularly 
                    blood thinners or medications metabolized by the liver, consult with your healthcare provider 
                    before adding broccoli extract to your regimen.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Is your broccoli extract suitable for all diets?</h3>
                  <p className="text-gray-600">
                    Yes, our organic broccoli extract is vegan, gluten-free, non-GMO, and contains no artificial 
                    additives or preservatives. It's suitable for most dietary preferences and restrictions. The 
                    extract is carefully processed to maintain its natural integrity while ensuring purity and potency.
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
              Our premium supplements harness the power of sulforaphane to support your digestive health, detoxification, and overall wellness.
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
