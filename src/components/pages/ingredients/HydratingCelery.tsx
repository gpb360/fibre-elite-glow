'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Droplets, Flame, Shield, ArrowRight, Microscope, Leaf, BarChart3, Brain, Check, Zap, Heart } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Hydrating Celery",
    "description": "A low-calorie vegetable extract packed with water, electrolytes, and antioxidants to support hydration, reduce inflammation, and aid digestion.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Nutrition",
      "Gastroenterology",
      "Sports Medicine"
    ],
    "activeIngredient": "Apigenin, Luteolin, Electrolytes (potassium, sodium), Phthalides",
    "mechanismOfAction": "Provides essential electrolytes for hydration; contains antioxidants that reduce inflammation; supports digestion with fiber and water content."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const HydratingCeleryHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/assets/16x9_a_celery_plant_with_vibrant_gree.png')`,
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
              Hydrating Celery<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A refreshing source of hydration, electrolytes, and antioxidants to reduce inflammation and support overall wellness.
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
              <Droplets className="h-4 w-4 text-green-500 mr-1" />
              <span>Rich in Electrolytes</span>
            </div>
            <div className="flex items-center">
              <Flame className="h-4 w-4 text-green-500 mr-1" />
              <span>Anti-Inflammatory</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>Antioxidant Power</span>
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
            src="/assets/webp/16x9_a_celery_plant_with_vibrant_gree.webp" 
            alt="Hydrating Celery - Natural electrolyte source for hydration and mineral balance" 
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

const HydratingCelery = () => {
  const benefits = [
    {
      title: "Excellent for Hydration",
      description: "With a water content of about 95%, celery is a fantastic way to replenish fluids and electrolytes like potassium and sodium.",
      icon: Droplets
    },
    {
      title: "Reduces Inflammation",
      description: "Contains antioxidants like apigenin and luteolin, which have powerful anti-inflammatory properties.",
      icon: Flame
    },
    {
      title: "Supports Digestion",
      description: "The combination of water and insoluble fiber in celery helps to support digestive regularity and prevent constipation.",
      icon: Heart
    },
    {
      title: "Rich in Antioxidants",
      description: "Provides a rich source of flavonoids and vitamin C that protect cells from damage caused by free radicals.",
      icon: Shield
    },
    {
      title: "Supports Heart Health",
      description: "Compounds called phthalides in celery may help relax artery walls, promoting healthy blood pressure.",
      icon: Leaf
    },
    {
      title: "Low in Calories",
      description: "An incredibly low-calorie food, making it an ideal, nutrient-dense addition to any health-conscious diet.",
      icon: Check
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <IngredientSchema />
      </Head>
      <Header />
      <main className="flex-1">
        <HydratingCeleryHero />
        
        <SplitSection
          image="/lovable-uploads/celery-closeup.jpg"
          imageAlt="Celery Close-up"
          title="What is Hydrating Celery?"
          description="A crisp, refreshing vegetable that's a powerhouse of hydration and nutrients."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Hydrating Celery extract is derived from the stalks of the Apium graveolens plant. Long valued for its crisp texture and distinctive flavor, celery is now celebrated for its impressive health benefits. It is composed of approximately 95% water, making it one of the most hydrating foods available.
            </p>
            <p>
              Beyond its water content, celery is a rich source of essential electrolytes, vitamins, and powerful plant compounds. Our extract captures these benefits in a concentrated form, providing a convenient way to support hydration and overall wellness.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Hydrating Celery" 
              description="Discover the refreshing and restorative power of this incredible vegetable" 
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
        
        <SplitSection
          image="/lovable-uploads/hydration-illustration.jpg"
          imageAlt="Hydration Illustration"
          title="Nature's Electrolyte Drink"
          description="How celery helps to restore and maintain the body's fluid balance"
          reverse
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Proper hydration is about more than just drinking water; it's about maintaining a balance of electrolytes. Celery is a natural source of key electrolytes like potassium and sodium, along with magnesium and chloride.
            </p>
            <p>
              These minerals are crucial for nerve function, muscle contraction, and maintaining the body's pH levels. Consuming celery or its extract can help replenish these vital nutrients, especially after exercise or during hot weather, making it a superior choice for natural hydration.
            </p>
          </div>
        </SplitSection>

      </main>
      <Footer />
    </div>
  );
};

export default HydratingCelery;