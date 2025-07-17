'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Shield, Leaf, ArrowRight, Microscope, BarChart3, Droplets, Brain, Check, Zap, Flame } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Fresh Spinach Powder",
    "description": "A nutrient-rich powder packed with vitamins, minerals, and antioxidants to support energy levels, eye health, and overall vitality.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Nutrition",
      "Ophthalmology",
      "Preventive Medicine"
    ],
    "activeIngredient": "Lutein, Zeaxanthin, Vitamin K, Iron, Nitrates",
    "mechanismOfAction": "Provides potent antioxidant protection; supports red blood cell production; enhances mitochondrial function; supports macular health."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const FreshSpinachPowderHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/assets/webp/16x9_a_bowl_filled_with_green_spinach.webp')`,
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
              A vibrant, nutrient-dense powder to boost your energy, protect your cells, and support overall wellness.
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
              <Zap className="h-4 w-4 text-green-500 mr-1" />
              <span>Energy Boost</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>Antioxidant Rich</span>
            </div>
            <div className="flex items-center">
              <Brain className="h-4 w-4 text-green-500 mr-1" />
              <span>Cognitive Support</span>
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
            src="/assets/webp/16x9_a_bowl_filled_with_green_spinach.webp"
            alt="Fresh Spinach Powder - Nutrient-dense green superfood for daily wellness" 
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

const FreshSpinachPowder = () => {
  const benefits = [
    {
      title: "Rich in Nutrients",
      description: "Loaded with vitamins A, C, K1, folic acid, iron, and calcium, providing a broad spectrum of essential nutrients.",
      icon: Leaf
    },
    {
      title: "Powerful Antioxidants",
      description: "Contains antioxidants like lutein, zeaxanthin, and quercetin, which combat oxidative stress and protect cells from damage.",
      icon: Shield
    },
    {
      title: "Supports Eye Health",
      description: "Lutein and zeaxanthin are crucial for protecting the eyes from blue light damage and reducing the risk of age-related macular degeneration.",
      icon: Heart // Eye icon would be better
    },
    {
      title: "Boosts Energy Levels",
      description: "A great source of iron and nitrates, which improve oxygen flow and mitochondrial efficiency, helping to reduce fatigue.",
      icon: Zap
    },
    {
      title: "Supports Brain Health",
      description: "The anti-inflammatory compounds and antioxidants in spinach help protect the brain from age-related cognitive decline.",
      icon: Brain
    },
    {
      title: "Promotes Healthy Blood Pressure",
      description: "The natural nitrates in spinach can help relax blood vessels, leading to improved blood flow and lower blood pressure.",
      icon: BarChart3
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <IngredientSchema />
      </Head>
      <Header />
      <main className="flex-1">
        <FreshSpinachPowderHero />
        
        <SplitSection
          image="/lovable-uploads/spinach-leaves.jpg"
          imageAlt="Spinach Leaves"
          title="What is Fresh Spinach Powder?"
          description="A convenient, concentrated form of one of nature's most powerful superfoods."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Fresh Spinach Powder is made from carefully harvested, vibrant green spinach leaves that are gently dried and milled to preserve their potent nutritional profile. This process concentrates the vitamins, minerals, and antioxidants, making it an easy and effective way to incorporate the benefits of spinach into your daily routine.
            </p>
            <p>
              Known for its mild flavor, our spinach powder blends seamlessly into smoothies, juices, and other recipes, providing a powerful boost of plant-based nutrition without altering the taste.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Fresh Spinach Powder" 
              description="Unlock the potent nutritional power of this leafy green superfood" 
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

      </main>
      <Footer />
    </div>
  );
};

export default FreshSpinachPowder;
