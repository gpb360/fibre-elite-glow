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
    "name": "Fresh Spinach Powder",
    "description": "A nutrient-dense powder made from fresh spinach, rich in vitamins, minerals, and fiber to support digestive health and overall wellness.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition",
      "Preventive Medicine"
    ],
    "activeIngredient": "Concentrated spinach with natural fiber, vitamins, and minerals",
    "mechanismOfAction": "Provides prebiotic fiber for gut bacteria; delivers essential nutrients; supports alkaline balance; contains enzymes that aid digestion"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const SpinachPowderHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/spinach-field-bg.jpg')`,
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
              Fresh Spinach Powder<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Packed with essential vitamins, minerals, and fiber, supporting digestive health while providing nutritional benefits for overall wellness.
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
              <Leaf className="h-4 w-4 text-green-500 mr-1" />
              <span>Nutrient-Dense</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-green-500 mr-1" />
              <span>Digestive Support</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
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
            src="/lovable-uploads/spinach-powder.jpg" 
            alt="Fresh Spinach Powder" 
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

const SpinachPowder = () => {
  const benefits = [
    {
      title: "Promotes Digestive Regularity",
      description: "The fiber in spinach powder adds bulk to stool, easing elimination and preventing constipation for a healthier digestive system.",
      icon: Droplets
    },
    {
      title: "Prebiotic Support",
      description: "Acts as a prebiotic, nourishing beneficial gut bacteria and supporting a balanced microbiome essential for optimal digestive health.",
      icon: Sparkles
    },
    {
      title: "Nutrient Absorption",
      description: "Rich in enzymes that aid in the breakdown of food, enhancing nutrient absorption and reducing symptoms of indigestion.",
      icon: Zap
    },
    {
      title: "Anti-inflammatory Properties",
      description: "Contains natural compounds that help reduce inflammation in the digestive tract, soothing irritation and supporting gut comfort.",
      icon: Heart
    },
    {
      title: "Alkalizing Effect",
      description: "Helps balance pH levels in the body, creating an optimal environment for digestive enzymes to function effectively.",
      icon: Shield
    },
    {
      title: "Detoxification Support",
      description: "The chlorophyll in spinach powder supports the body's natural detoxification processes, helping to remove waste and toxins.",
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
        <SpinachPowderHero />
        
        {/* What is Fresh Spinach Powder */}
        <SplitSection
          image="/lovable-uploads/spinach-leaves-closeup.jpg"
          imageAlt="Fresh Spinach Leaves Close-up"
          title="What is Fresh Spinach Powder?"
          description="A concentrated form of nutrient-rich spinach, carefully processed to preserve maximum nutritional benefits."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Fresh Spinach Powder is created by carefully drying fresh, organic spinach leaves and grinding them 
              into a fine, nutrient-dense powder. This process concentrates all the beneficial compounds found 
              in spinach while making them more bioavailable and convenient to consume.
            </p>
            <p>
              Unlike heat-dried alternatives, our spinach powder is freeze-dried to preserve the delicate 
              nutrients, enzymes, and phytonutrients that make spinach such a powerful superfood. This 
              gentle processing method ensures that the powder retains the maximum nutritional profile 
              of fresh spinach.
            </p>
            <p>
              Just 10 grams of spinach powder is equivalent to approximately 100 grams of fresh spinach, 
              making it an incredibly efficient way to incorporate the benefits of this leafy green into 
              your daily routine. Our spinach powder is 100% pure with no additives, fillers, or 
              preservatives—just concentrated spinach goodness.
            </p>
          </div>
        </SplitSection>
        
        {/* Nutritional Powerhouse */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="A Nutritional Powerhouse" 
              description="Why spinach has earned its reputation as one of nature's most nutrient-dense foods" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Vitamin & Mineral Rich</h3>
                    <p className="text-gray-600 mb-4">
                      Spinach is exceptionally rich in vitamins A, C, K1, and several B vitamins, as well as minerals 
                      like iron, calcium, and magnesium. These nutrients play crucial roles in everything from immune 
                      function and bone health to energy production and oxygen transport.
                    </p>
                    <p className="text-gray-600">
                      In powdered form, these nutrients become more concentrated and bioavailable, allowing your body 
                      to absorb and utilize them more efficiently than it might from raw spinach.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Phytonutrient Complex</h3>
                    <p className="text-gray-600 mb-4">
                      Beyond basic vitamins and minerals, spinach contains an impressive array of phytonutrients 
                      including lutein, zeaxanthin, quercetin, kaempferol, and various flavonoids. These compounds 
                      have powerful antioxidant and anti-inflammatory properties.
                    </p>
                    <p className="text-gray-600">
                      Our gentle processing method preserves these delicate compounds, ensuring you receive the 
                      full spectrum of benefits that spinach has to offer.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-green-700">Concentrated Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">
                        <strong>Higher Nutrient Density:</strong> The dehydration process concentrates nutrients, making spinach powder more nutrient-dense per gram than fresh spinach.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">
                        <strong>Improved Bioavailability:</strong> The breakdown of plant cell walls during processing makes some nutrients more accessible to your body.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">
                        <strong>Longer Shelf Life:</strong> Unlike fresh spinach which wilts quickly, spinach powder retains its nutritional value for extended periods.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">
                        <strong>Versatility:</strong> Easily incorporated into various foods and supplements without altering taste significantly.
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
              title="Digestive Health Benefits" 
              description="How Fresh Spinach Powder supports optimal digestive function and gut health" 
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
        
        {/* Digestive Health Focus */}
        <SplitSection
          image="/lovable-uploads/digestive-wellness.jpg"
          imageAlt="Digestive Wellness Illustration"
          title="Spinach Powder & Digestive Wellness"
          description="How this green superfood specifically supports your digestive system"
          reverse
          className="bg-green-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Fiber-Rich Composition</h4>
                <p className="text-gray-600">
                  Spinach powder contains both soluble and insoluble fiber, which work together to promote 
                  digestive health. Soluble fiber forms a gel-like substance that slows digestion and 
                  helps regulate blood sugar, while insoluble fiber adds bulk to stool and helps food 
                  pass more quickly through the stomach and intestines.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Prebiotic Effects</h4>
                <p className="text-gray-600">
                  The fiber in spinach powder serves as a prebiotic, providing nourishment for beneficial 
                  gut bacteria. As these bacteria ferment the fiber, they produce short-chain fatty acids 
                  (SCFAs) like butyrate, which nourish colon cells and support gut barrier integrity.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Digestive Enzyme Support</h4>
                <p className="text-gray-600">
                  Spinach contains natural enzymes that can aid in the breakdown of food, complementing 
                  your body's own digestive enzymes. This can help improve nutrient absorption and reduce 
                  symptoms of indigestion such as bloating and discomfort.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Anti-inflammatory Properties</h4>
                <p className="text-gray-600">
                  The flavonoids and carotenoids in spinach have anti-inflammatory effects that can help 
                  soothe irritation in the digestive tract. This can be particularly beneficial for those 
                  with sensitive digestive systems or inflammatory conditions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Hydration Support</h4>
                <p className="text-gray-600">
                  The magnesium in spinach helps regulate fluid balance in the body, which is essential 
                  for proper digestion. Adequate hydration is necessary for maintaining the mucus lining 
                  of the digestive tract and for softening stool to prevent constipation.
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
                description="Research supporting the benefits of Fresh Spinach Powder" 
                centered 
                className="mb-8" 
              />
              
              <div className="bg-green-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  The health benefits of spinach and spinach powder are supported by a growing body of scientific research:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Digestive Health:</strong> Studies published in the Journal of Food Science have shown that the fiber content in spinach can significantly improve digestive transit time and stool consistency, helping to alleviate constipation and promote regular bowel movements.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Gut Microbiome:</strong> Research in the International Journal of Molecular Sciences has demonstrated that the compounds in spinach can positively influence the composition of gut bacteria, increasing the abundance of beneficial species like Bifidobacteria and Lactobacilli.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Anti-inflammatory Effects:</strong> Clinical studies published in the Journal of Nutrition have shown that the flavonoids in spinach can reduce markers of inflammation in the digestive tract, potentially benefiting those with inflammatory bowel conditions.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Nutrient Absorption:</strong> Research in the American Journal of Clinical Nutrition has demonstrated that the vitamin C in spinach enhances the absorption of non-heme iron, helping to improve iron status and prevent deficiency.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Fresh spinach powder is not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Nutritional Profile */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Nutritional Profile" 
              description="The comprehensive nutritional benefits of Fresh Spinach Powder" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Vitamins & Minerals</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin A:</strong> Essential for vision, immune function, and cellular communication
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin C:</strong> Supports immune function and acts as an antioxidant
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin K1:</strong> Important for blood clotting and bone health
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Iron:</strong> Essential for oxygen transport and energy production
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Calcium:</strong> Supports bone health, muscle function, and nerve signaling
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Magnesium:</strong> Involved in over 300 enzymatic reactions in the body
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Phytonutrients & Fiber</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Lutein & Zeaxanthin:</strong> Carotenoids that support eye health
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Quercetin:</strong> A flavonoid with anti-inflammatory and antioxidant effects
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Kaempferol:</strong> A flavonoid that helps reduce oxidative stress
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Chlorophyll:</strong> Supports detoxification and has anti-inflammatory properties
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Soluble Fiber:</strong> Forms a gel-like substance that slows digestion
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Insoluble Fiber:</strong> Adds bulk to stool and supports digestive health
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
              description="Common questions about Fresh Spinach Powder" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How does spinach powder compare to fresh spinach?</h3>
                  <p className="text-gray-600">
                    Spinach powder is more concentrated than fresh spinach, with approximately 10 grams of powder 
                    equivalent to 100 grams of fresh spinach. While fresh spinach has higher water content, 
                    spinach powder offers greater convenience, longer shelf life, and concentrated nutrients. 
                    Some water-soluble vitamins may be slightly reduced in the powder, but the fiber, minerals, 
                    and many phytonutrients remain intact and are often more bioavailable.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">How much spinach powder should I consume daily?</h3>
                  <p className="text-gray-600">
                    A typical serving of spinach powder is 1-2 teaspoons (approximately 5-10 grams) daily. 
                    This amount provides significant nutritional benefits without overwhelming your digestive system. 
                    If you're new to spinach powder, it's best to start with a smaller amount (½ teaspoon) and 
                    gradually increase as your body adjusts. Our Total Essential products contain an optimal 
                    dose of spinach powder as part of a balanced approach to digestive wellness.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Can spinach powder cause any digestive discomfort?</h3>
                  <p className="text-gray-600">
                    Some individuals may experience mild digestive adjustment when first introducing spinach powder, 
                    particularly if they're not accustomed to a fiber-rich diet. This can include temporary gas or 
                    bloating as your gut microbiome adapts to the increased fiber and nutrients. Starting with a 
                    small amount and gradually increasing can help minimize any discomfort. It's also important to 
                    drink plenty of water when consuming fiber-rich foods like spinach powder.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Is spinach powder suitable for people with certain health conditions?</h3>
                  <p className="text-gray-600">
                    While spinach powder is beneficial for most people, those taking blood thinners should consult 
                    with their healthcare provider due to spinach's high vitamin K content, which can affect these 
                    medications. Additionally, spinach contains oxalates, which may be a concern for individuals 
                    prone to calcium oxalate kidney stones. As with any supplement, it's always best to consult 
                    with your healthcare provider if you have specific health concerns or conditions.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">What's the best way to incorporate spinach powder into my diet?</h3>
                  <p className="text-gray-600">
                    Spinach powder is incredibly versatile and can be added to smoothies, soups, sauces, dips, 
                    and baked goods. It can also be mixed into water or juice for a quick nutrient boost. 
                    The mild flavor blends well with many foods without significantly altering their taste. 
                    For maximum nutritional benefit, add spinach powder to foods after cooking, as high heat 
                    can degrade some of the more delicate nutrients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-green-50 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Benefits of Fresh Spinach Powder</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our premium supplements harness the power of spinach powder to support your digestive health and overall wellness.
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

export default SpinachPowder;
