'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Shield, Award, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Sustainable Palm Fiber",
    "description": "A balanced, natural dietary fiber from sustainable oil palm trunks, rich in lignin and beneficial for digestive health, cholesterol reduction, and blood sugar regulation.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition"
    ],
    "activeIngredient": "Lignin-rich dietary fiber",
    "mechanismOfAction": "Binds to cholesterol, toxins, and bile salts; increases stool bulk; normalizes gut bacteria balance"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const SustainablePalmFiberHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
      style={{
        backgroundImage: `url('/assets/16x9_a_photorealistic_palme-oil.png')`,
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
              Sustainable Palm Fiber<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A revolutionary, balanced dietary fiber source with exceptional health benefits, extracted from sustainable oil palm trunks.
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
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>Balanced Fiber</span>
            </div>
            <div className="flex items-center">
              <Award className="h-4 w-4 text-green-500 mr-1" />
              <span>Sustainably Sourced</span>
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
            src="/assets/16x9_a_photorealistic_palme-oil.png"
            alt="Sustainable Palm Fiber"
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
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
      <Icon className="h-6 w-6 text-green-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const SustainablePalmFiber = () => {
  const benefits = [
    {
      title: "Prevents Constipation",
      description: "Sustainable Palm Fiber increases stool bulk by retaining moisture, softening fecal matter and stimulating intestinal movement for easier passage.",
      icon: Droplets
    },
    {
      title: "Healthy Digestive System",
      description: "Maintains optimal digestive function by promoting regular bowel movements and preventing the accumulation of toxins in the colon.",
      icon: Heart
    },
    {
      title: "Normalizes Gut Bacteria",
      description: "Creates a balanced microbiome by supporting beneficial bacteria while suppressing pathological bacteria in the colon.",
      icon: Microscope
    },
    {
      title: "Blood Sugar Regulation",
      description: "Slows the release of sugar into the bloodstream, preventing insulin spikes and helping to maintain healthy blood glucose levels.",
      icon: BarChart3
    },
    {
      title: "Lowers Cholesterol",
      description: "Binds to cholesterol and bile salts, facilitating their removal from the body and reducing overall blood cholesterol levels.",
      icon: Shield
    },
    {
      title: "Cancer Prevention",
      description: "Rich in lignin which helps prevent colon cancer and reduces breast cancer risk by binding to toxins and regulating hormone levels.",
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
        <SustainablePalmFiberHero />
        
        {/* What is Sustainable Palm Fiber */}
        <SplitSection
          image="/lovable-uploads/oil-palm-trunk.jpg"
          imageAlt="Oil Palm Trunk Cross Section"
          title="What is Sustainable Palm Fiber?"
          description="A revolutionary, balanced dietary fiber source extracted from the trunks of mature oil palm trees."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Sustainable Palm Fiber (OPF) is a premium dietary fiber extracted from fiber-enriched oil palm trunks.
              For many years, scientists and researchers were aware that oil palm trunks contained substantial
              amounts of dietary fiber, but extraction was challenging due to the complex structure of
              parenchyma cells, dietary fiber, and vascular bundles within the trunk.
            </p>
            <p>
              After 12 years of intensive research and development, scientists successfully developed an
              advanced technology for extracting this valuable fiber. Analysis has confirmed that oil palm
              trunks contain more than 70% dietary fiber, making it an exceptionally rich source of this
              essential nutrient.
            </p>
            <p>
              What makes Sustainable Palm Fiber truly special is its high lignin content. Lignin is a component of
              fiber that undergoes minimal changes in the body and is particularly valuable for its binding
              ability – effectively binding cholesterol, bile salts, fats, carbohydrates, and toxins.
            </p>
          </div>
        </SplitSection>
        
        {/* Extraction Process */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Sustainable Extraction Process" 
              description="How we transform oil palm trunks into premium dietary fiber" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-3">Sustainable Sourcing</h3>
                  <p className="text-gray-600">
                    We only use oil palm trunks from trees that are over 20 years old and would otherwise be discarded, making this a highly sustainable ingredient.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-3">Advanced Extraction</h3>
                  <p className="text-gray-600">
                    Using proprietary technology, we carefully separate the fiber from other components of the trunk, preserving its nutritional integrity.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-3">Quality Processing</h3>
                  <p className="text-gray-600">
                    The extracted fiber undergoes rigorous quality control to ensure purity, potency, and consistency in every batch.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our innovative extraction process allows us to harness the powerful health benefits of oil palm fiber 
                  while supporting sustainable agricultural practices. By utilizing parts of the plant that would otherwise 
                  be discarded, we're creating value from agricultural byproducts and reducing waste.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Sustainable Palm Fiber"
              description="Discover the powerful ways Sustainable Palm Fiber supports your health and wellness"
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
          image="/lovable-uploads/digestive-system.jpg"
          imageAlt="Digestive System Illustration"
          title="How Sustainable Palm Fiber Works"
          description="The science behind this powerful natural fiber supplement"
          reverse
          className="bg-green-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Increases Bulk and Softness</h4>
                <p className="text-gray-600">
                  Sustainable Palm Fiber increases the bulk and softness of feces, reducing pressure on the colon wall
                  and making elimination easier and more comfortable.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Decreases Transit Time</h4>
                <p className="text-gray-600">
                  By promoting regular bowel movements, Sustainable Palm Fiber reduces the time waste spends in the colon,
                  preventing the absorption of toxins and harmful substances.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Binds Bile Acids and Cholesterol</h4>
                <p className="text-gray-600">
                  The high lignin content in Sustainable Palm Fiber effectively binds to bile acids and cholesterol,
                  facilitating their removal from the body and helping to maintain healthy cholesterol levels.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Binds Toxic Chemicals</h4>
                <p className="text-gray-600">
                  Sustainable Palm Fiber acts as a natural detoxifier, binding to toxic chemicals and preventing
                  their absorption into the bloodstream.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Promotes Beneficial Bacteria</h4>
                <p className="text-gray-600">
                  By creating an optimal environment in the colon, Sustainable Palm Fiber helps beneficial bacteria
                  flourish while inhibiting the growth of harmful bacteria.
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
                description="Research supporting the benefits of Sustainable Palm Fiber"
                centered 
                className="mb-8" 
              />
              
              <div className="bg-green-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  Scientific research has consistently demonstrated the significant health benefits of dietary fiber, 
                  particularly fiber sources rich in lignin like Sustainable Palm Fiber. Studies show that sufficient intake
                  of lignin-rich fiber can help reduce the risk of various health conditions:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Digestive Health:</strong> Clinical studies have shown that fiber supplements can significantly reduce constipation symptoms and improve overall bowel function.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Cholesterol Management:</strong> Research demonstrates that lignin-rich fiber can bind to cholesterol in the digestive tract, reducing its absorption and lowering blood cholesterol levels.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Cancer Prevention:</strong> Studies indicate that individuals with higher fiber intake have lower rates of colon cancer. Breast cancer patients typically excrete fewer lignans (produced from lignin) than healthy individuals.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Blood Sugar Control:</strong> Clinical research shows that fiber slows the absorption of sugar, helping to maintain healthy blood glucose levels.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Sustainable Palm Fiber is not intended to diagnose, treat, cure, or prevent any disease.
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
              description="Understanding the unique profile of Sustainable Palm Fiber"
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
                          <strong>High Dietary Fiber:</strong> Contains more than 70% dietary fiber
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Rich in Lignin:</strong> A powerful fiber component that binds to toxins and cholesterol
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Balanced Fiber Ratio:</strong> Contains both soluble and insoluble fiber
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>100% Natural:</strong> No additives or synthetic compounds
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
                          Supports digestive regularity and prevents constipation
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          Helps lower cholesterol and regulate blood sugar
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          Aids in detoxification and supports a healthy gut microbiome
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
              title="Embrace Sustainable Wellness" 
              description="Incorporate the power of Sustainable Palm Fiber into your daily routine for optimal digestive health." 
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

export default SustainablePalmFiber;
