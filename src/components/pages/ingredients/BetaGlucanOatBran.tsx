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
    "name": "Beta-Glucan Oat Bran",
    "description": "A soluble fiber derived from oats that helps lower cholesterol levels, regulate blood sugar, and promote heart health.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Cardiology",
      "Nutrition",
      "Endocrinology"
    ],
    "activeIngredient": "Beta-glucan soluble fiber",
    "mechanismOfAction": "Forms a gel-like substance in the digestive tract that binds to cholesterol and bile acids; slows glucose absorption; promotes satiety"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const BetaGlucanOatBranHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/oat-field-bg.jpg')`,
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
              A powerful soluble fiber that helps lower cholesterol levels, regulate blood sugar, and promote heart health.
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
              <span>Heart Health</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>Cholesterol Control</span>
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
            src="/lovable-uploads/oat-bran.jpg" 
            alt="Beta-Glucan Oat Bran" 
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

const BetaGlucanOatBran = () => {
  const benefits = [
    {
      title: "Lowers Cholesterol",
      description: "Beta-glucan forms a gel-like substance that binds to cholesterol and bile acids in the intestine, preventing their absorption and helping to lower LDL (bad) cholesterol levels.",
      icon: Heart
    },
    {
      title: "Regulates Blood Sugar",
      description: "By slowing the absorption of sugar into the bloodstream, beta-glucan helps prevent rapid spikes in blood glucose levels, supporting stable energy and improved insulin sensitivity.",
      icon: BarChart3
    },
    {
      title: "Promotes Heart Health",
      description: "Regular consumption of beta-glucan has been shown to reduce the risk of heart disease by improving cholesterol profiles and supporting healthy blood pressure levels.",
      icon: Shield
    },
    {
      title: "Supports Weight Management",
      description: "The high viscosity of beta-glucan increases feelings of fullness and satiety, potentially reducing overall calorie intake and supporting healthy weight management.",
      icon: Droplets
    },
    {
      title: "Enhances Digestive Health",
      description: "As a soluble fiber, beta-glucan supports regular bowel movements, feeds beneficial gut bacteria, and helps maintain a healthy digestive system.",
      icon: Leaf
    },
    {
      title: "Boosts Immune Function",
      description: "Research suggests that beta-glucan may enhance immune system function by activating certain immune cells and improving the body's defense against pathogens.",
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
        <BetaGlucanOatBranHero />
        
        {/* What is Beta-Glucan Oat Bran */}
        <SplitSection
          image="/lovable-uploads/oat-bran-close.jpg"
          imageAlt="Beta-Glucan Oat Bran Close-up"
          title="What is Beta-Glucan Oat Bran?"
          description="A powerful soluble fiber with exceptional health benefits derived from premium oats."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Beta-glucan is a soluble fiber found in the cell walls of oats, barley, and certain fungi. 
              Oat bran is particularly rich in beta-glucan, containing the highest concentration in the 
              outer layer (bran) of the oat grain. This makes oat bran one of the most potent natural 
              sources of this beneficial fiber.
            </p>
            <p>
              What makes beta-glucan special is its unique molecular structure—a complex polysaccharide 
              composed of glucose molecules linked by β-(1,3) and β-(1,4) bonds. This structure gives 
              beta-glucan its gel-forming properties, which are responsible for many of its health benefits.
            </p>
            <p>
              Our premium oat bran is carefully processed to preserve maximum beta-glucan content and 
              nutritional benefits. Unlike heavily processed oat products, our oat bran maintains the 
              integrity of the beta-glucan molecules, ensuring optimal effectiveness for cholesterol 
              reduction, blood sugar regulation, and digestive health.
            </p>
          </div>
        </SplitSection>
        
        {/* Processing and Quality */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Premium Processing & Quality" 
              description="How we preserve the full potential of beta-glucan in our oat bran" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-3">Careful Selection</h3>
                  <p className="text-gray-600">
                    We source only the highest quality oats with naturally high beta-glucan content, grown in optimal conditions without harmful pesticides.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-3">Gentle Processing</h3>
                  <p className="text-gray-600">
                    Our oat bran undergoes a specialized low-temperature milling process that preserves the molecular structure and bioactivity of beta-glucan.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-green-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-3">Quality Testing</h3>
                  <p className="text-gray-600">
                    Each batch is rigorously tested to ensure optimal beta-glucan content and purity, guaranteeing consistent effectiveness in our products.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  The quality of beta-glucan can vary significantly based on processing methods. Our careful 
                  approach ensures that the molecular weight and solubility of the beta-glucan remain intact, 
                  maximizing its ability to form the viscous gel that delivers its health benefits.
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
              description="Discover the powerful ways beta-glucan supports your health and wellness" 
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
          image="/lovable-uploads/heart-health.jpg"
          imageAlt="Heart Health Illustration"
          title="How Beta-Glucan Works"
          description="The science behind this powerful cholesterol-lowering fiber"
          reverse
          className="bg-green-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Forms a Viscous Gel</h4>
                <p className="text-gray-600">
                  In the digestive tract, beta-glucan dissolves and forms a thick, gel-like substance that moves slowly 
                  through your intestines, interacting with food and digestive compounds.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Binds to Cholesterol</h4>
                <p className="text-gray-600">
                  This gel binds to cholesterol and bile acids (which are made from cholesterol) in the intestine, 
                  preventing their absorption and facilitating their excretion from the body.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Slows Nutrient Absorption</h4>
                <p className="text-gray-600">
                  The viscous nature of beta-glucan slows the absorption of carbohydrates, preventing rapid spikes 
                  in blood sugar and helping to maintain stable glucose levels.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Increases Bile Acid Production</h4>
                <p className="text-gray-600">
                  When beta-glucan binds to bile acids and removes them from the body, the liver must use more 
                  cholesterol to produce new bile acids, further reducing blood cholesterol levels.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Feeds Beneficial Bacteria</h4>
                <p className="text-gray-600">
                  Beta-glucan acts as a prebiotic, nourishing beneficial gut bacteria that produce short-chain 
                  fatty acids with additional health benefits for the digestive system and beyond.
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
                  The health benefits of beta-glucan have been extensively studied and are supported by robust scientific evidence, 
                  leading to approval by major health authorities worldwide:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>FDA-Approved Health Claim:</strong> The US Food and Drug Administration has authorized a health claim stating that consuming at least 3g of beta-glucan daily, as part of a diet low in saturated fat and cholesterol, may reduce the risk of heart disease.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>European Food Safety Authority:</strong> The EFSA has approved health claims for beta-glucan related to cholesterol reduction, blood glucose reduction, and improved digestion.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Clinical Research:</strong> Multiple clinical studies have shown that consuming 3-5g of beta-glucan daily can lower LDL cholesterol by 5-8%, with greater reductions in individuals with higher starting cholesterol levels.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Blood Sugar Research:</strong> Studies demonstrate that beta-glucan can reduce post-meal blood glucose and insulin responses by up to 30%, supporting better glycemic control.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Beta-glucan oat bran is not intended to diagnose, treat, cure, or prevent any disease.
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
              description="Understanding the nutritional benefits of Beta-Glucan Oat Bran" 
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
                          <strong>High in Soluble Fiber:</strong> Rich source of beta-glucan, the primary soluble fiber
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Plant Protein:</strong> Contains high-quality plant protein with essential amino acids
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Healthy Fats:</strong> Contains heart-healthy unsaturated fats
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Low Glycemic Index:</strong> Minimal impact on blood sugar levels
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
                          <strong>B Vitamins:</strong> Rich in thiamin, folate, and other B vitamins for energy metabolism
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Magnesium:</strong> Essential for muscle function, energy production, and bone health
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
                          <strong>Antioxidants:</strong> Contains avenanthramides, unique antioxidants found only in oats
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
              description="Common questions about Beta-Glucan Oat Bran" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How much beta-glucan do I need to consume for health benefits?</h3>
                  <p className="text-gray-600">
                    Health authorities recommend consuming at least 3 grams of beta-glucan daily to achieve 
                    cholesterol-lowering benefits. For blood sugar management, similar amounts have shown effectiveness. 
                    Our Total Essential products provide an optimal dose of beta-glucan as part of a comprehensive 
                    approach to digestive and cardiovascular health.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How quickly will beta-glucan lower my cholesterol?</h3>
                  <p className="text-gray-600">
                    Most studies show that regular consumption of beta-glucan begins to show measurable effects on 
                    cholesterol levels within 2-4 weeks, with optimal results typically seen after 8-12 weeks of 
                    consistent use. Individual results may vary based on diet, lifestyle, and initial cholesterol levels.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Is beta-glucan oat bran suitable for people with celiac disease?</h3>
                  <p className="text-gray-600">
                    While oats themselves do not contain gluten, they can sometimes be cross-contaminated during 
                    processing. Our beta-glucan oat bran is processed in a dedicated facility to minimize the risk 
                    of cross-contamination. However, individuals with celiac disease or severe gluten sensitivity 
                    should consult with their healthcare provider before adding any oat products to their diet.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Can beta-glucan interact with medications?</h3>
                  <p className="text-gray-600">
                    Beta-glucan may affect the absorption of certain medications due to its gel-forming properties. 
                    If you're taking medications, especially those for diabetes or cholesterol, consult with your 
                    healthcare provider about potential interactions. Generally, it's recommended to take medications 
                    at least 1-2 hours before or after consuming beta-glucan supplements.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">What makes your beta-glucan oat bran different from regular oatmeal?</h3>
                  <p className="text-gray-600">
                    Our beta-glucan oat bran contains a significantly higher concentration of beta-glucan than regular 
                    oatmeal. While whole oats contain approximately 4-5% beta-glucan, our specialized oat bran contains 
                    up to 7-8% beta-glucan. Additionally, our processing methods preserve the molecular structure and 
                    functionality of the beta-glucan, ensuring optimal health benefits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-green-50 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Benefits of Beta-Glucan Oat Bran</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our premium supplements harness the power of beta-glucan to support your heart health, blood sugar control, and overall wellness.
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

export default BetaGlucanOatBran;
