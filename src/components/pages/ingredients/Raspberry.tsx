'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Leaf, Shield, Activity, ArrowRight, Microscope, BarChart3, Droplets, Brain, Check, Heart } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Raspberry",
    "description": "A delicious fruit packed with fiber, vitamins, and antioxidants to support digestive health, weight management, and overall wellness.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition",
      "Weight Management"
    ],
    "activeIngredient": "Dietary Fiber, Anthocyanins, Ellagic Acid, Raspberry Ketones",
    "mechanismOfAction": "Promotes digestive regularity, provides antioxidant protection, supports metabolic function, and reduces inflammation."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const RaspberryHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div className="absolute inset-0 z-0 opacity-20">
      <Image
        src="/assets/webp/16x9_A_close_up_shot_of_a_cluster_of_.webp"
        alt=""
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
            <p className="text-pink-500 font-semibold">Premium Superfruit</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Raspberry<span className="text-pink-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Rich in fiber and antioxidants, our premium Raspberry powder supports digestive health, aids in weight management, and provides a wealth of essential nutrients.
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
              <Leaf className="h-4 w-4 text-pink-500 mr-1" />
              <span>High in Fiber</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-pink-500 mr-1" />
              <span>Antioxidant-Rich</span>
            </div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-pink-500 mr-1" />
              <span>Metabolic Support</span>
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
            src="/assets/webp/16x9_A_close_up_shot_of_a_cluster_of_.webp"
            alt="Raspberry - High-fiber superfruit for digestive health and antioxidant support" 
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
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-pink-100 mb-4">
      <Icon className="h-6 w-6 text-pink-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const Raspberry = () => {
  const benefits = [
    {
      title: "Supports Digestive Health",
      description: "Raspberries are an excellent source of dietary fiber, which promotes regular bowel movements and supports a healthy gut microbiome.",
      icon: Leaf
    },
    {
      title: "Aids in Weight Management",
      description: "The high fiber content helps you feel full and satisfied, while compounds like raspberry ketones may support a healthy metabolism.",
      icon: Activity
    },
    {
      title: "Powerful Antioxidant Protection",
      description: "Rich in Vitamin C, quercetin, and ellagic acid, raspberries help protect cells from oxidative stress and inflammation.",
      icon: Shield
    },
    {
      title: "Promotes Heart Health",
      description: "The antioxidants and fiber in raspberries contribute to heart health by supporting healthy blood pressure and cholesterol levels.",
      icon: Heart
    },
    {
      title: "Supports Brain Function",
      description: "The flavonoids in raspberries may help improve cognitive function and protect the brain from age-related decline.",
      icon: Brain
    },
    {
      title: "May Have Anti-Aging Properties",
      description: "The potent antioxidants in raspberries help combat the effects of free radicals, which can contribute to the signs of aging.",
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
        <RaspberryHero />
        
        {/* What is Raspberry */}
        <SplitSection
          image="/lovable-uploads/raspberry-closeup.jpg"
          imageAlt="Raspberry Close-up"
          title="What is Raspberry?"
          description="A sweet and tangy berry packed with fiber, antioxidants, and unique phytonutrients."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Raspberries are beloved for their delicate texture and perfectly balanced sweet-tart flavor. A member of the rose family, this vibrant berry is not just a delicious treat but also a concentrated source of impressive health benefits.
            </p>
            <p>
              One of the standout features of raspberries is their high fiber content, which is crucial for a healthy digestive system. They are also loaded with a wide array of antioxidants, including Vitamin C and ellagic acid, which help protect the body from cellular damage.
            </p>
            <p>
              Furthermore, raspberries contain unique compounds known as raspberry ketones, which have been studied for their potential role in supporting metabolism and weight management. Our raspberry powder is carefully processed to retain these valuable nutrients, offering a delicious and convenient health boost.
            </p>
          </div>
        </SplitSection>
        
        {/* Processing Method */}
        <section className="py-16 bg-pink-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Premium Processing Method" 
              description="How we capture the essence of fresh raspberries" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-pink-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-pink-600 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-3">Optimal Ripeness</h3>
                  <p className="text-gray-600">
                    We harvest our raspberries at the perfect point of ripeness to ensure the best flavor and highest nutrient density.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-pink-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-pink-600 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-3">Freeze-Drying Process</h3>
                  <p className="text-gray-600">
                    The berries are immediately freeze-dried, a gentle process that preserves the delicate phytonutrients, flavor, and color.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="rounded-full bg-pink-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-pink-600 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-3">Purity and Potency</h3>
                  <p className="text-gray-600">
                    Every batch is tested to confirm its purity and to ensure it meets our high standards for antioxidant and fiber content.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our meticulous process ensures that you get all the benefits of fresh raspberries in a versatile and long-lasting powder.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Health Benefits */}
        <section id="benefits" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Raspberry" 
              description="Discover the delicious ways Raspberry supports your health and wellness" 
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
          image="/lovable-uploads/fiber-diagram.jpg"
          imageAlt="Raspberry Fiber Mechanism"
          title="How Raspberry Works"
          description="The science behind this fiber-rich berry"
          reverse
          className="bg-pink-50"
        >
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-pink-600" />
              </div>
              <div>
                <h4 className="font-medium text-pink-800">Promoting Digestive Regularity</h4>
                <p className="text-gray-600">
                  The insoluble fiber in raspberries adds bulk to stool, helping food move more quickly through the digestive system and promoting regularity. Soluble fiber forms a gel, slowing digestion and promoting satiety.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-pink-600" />
              </div>
              <div>
                <h4 className="font-medium text-pink-800">Supporting Metabolic Health</h4>
                <p className="text-gray-600">
                  Raspberry ketones are structurally similar to capsaicin and synephrine, compounds known to have metabolic-boosting effects. They may help increase the breakdown of fat and increase levels of adiponectin, a hormone that helps regulate metabolism.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                <Check className="h-3 w-3 text-pink-600" />
              </div>
              <div>
                <h4 className="font-medium text-pink-800">Combating Inflammation</h4>
                <p className="text-gray-600">
                  The rich concentration of antioxidants like anthocyanins helps to reduce inflammation throughout the body, which is a key factor in many chronic diseases.
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
                description="Research supporting the benefits of Raspberry" 
                centered 
                className="mb-8" 
              />
              
              <div className="bg-pink-50 rounded-lg p-8">
                <p className="text-gray-600 mb-4">
                  Research has begun to uncover the wide-ranging health benefits of raspberries, from digestive health to metabolic support.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Fiber Content and Gut Health:</strong> The high fiber content of raspberries is well-documented. The USDA National Nutrient Database confirms that raspberries are one of the highest-fiber fruits, supporting their role in digestive health.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Metabolic Effects of Raspberry Ketones:</strong> While more human research is needed, early studies in cells and animals, such as one published in the journal Planta Medica, have shown that raspberry ketones can increase fat breakdown.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                      <svg className="h-3 w-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600">
                      <strong>Anti-inflammatory Properties:</strong> A study in the Journal of Agricultural and Food Chemistry found that the ellagic acid in raspberries has significant anti-inflammatory effects, which can contribute to overall health.
                    </span>
                  </li>
                </ul>
                
                <p className="text-gray-600 text-sm italic">
                  Note: While these statements are supported by scientific research, individual results may vary. 
                  Raspberry is not intended to diagnose, treat, cure, or prevent any disease.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Nutritional Composition */}
        <section className="py-16 bg-pink-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Nutritional Composition" 
              description="Understanding the vibrant profile of Raspberry" 
              centered 
              className="mb-12" 
            />
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-pink-700">Key Components</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Dietary Fiber:</strong> One of the highest fiber fruits, with about 8 grams per cup.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Vitamin C:</strong> Provides over 50% of the daily recommended intake per cup.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Manganese:</strong> An essential mineral for bone health and metabolism.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-pink-700">Phytonutrients</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Raspberry Ketones:</strong> Unique compounds studied for metabolic support.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-100 mr-3 mt-1">
                          <svg className="h-3 w-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-600">
                          <strong>Ellagic Acid & Quercetin:</strong> Potent antioxidants with anti-inflammatory properties.
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
        <section className="bg-pink-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <Heading 
              title="Taste the Benefits of Raspberry" 
              description="Boost your fiber intake and support your wellness goals with the delicious power of raspberries." 
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

export default Raspberry;