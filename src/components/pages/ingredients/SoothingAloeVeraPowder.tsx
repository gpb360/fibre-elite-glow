'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Droplets, Sun, ArrowRight, Microscope, Leaf, BarChart3, Brain, Check, Zap, Flame } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Soothing Aloe Vera Powder",
    "description": "A concentrated powder from the aloe vera plant, known for its ability to soothe the digestive tract, support hydration, and promote skin health.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Dermatology",
      "Nutrition"
    ],
    "activeIngredient": "Acemannan (a polysaccharide), Anthraquinones, Vitamins, Minerals",
    "mechanismOfAction": "Soothes and protects the digestive lining; provides hydration and electrolytes; supports skin repair and moisture retention; offers anti-inflammatory benefits."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const SoothingAloeVeraPowderHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div className="absolute inset-0 z-0 opacity-20">
      <Image
        src="/assets/webp/16x9_a_close_up_shot_of_aleo.webp"
        alt="Fresh aloe vera plant - soothing succulent for digestive tract wellness and natural hydration support"
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
            <p className="text-green-500 font-semibold">Premium Ingredient</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Soothing Aloe Vera Powder<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A gentle, powerful extract to soothe the digestive system, hydrate the body, and nourish the skin from within.
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
              <Heart className="h-4 w-4 text-green-500 mr-1" />
              <span>Digestive Soothing</span>
            </div>
            <div className="flex items-center">
              <Droplets className="h-4 w-4 text-green-500 mr-1" />
              <span>Hydration Support</span>
            </div>
            <div className="flex items-center">
              <Sun className="h-4 w-4 text-green-500 mr-1" />
              <span>Skin Health</span>
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
            src="/assets/webp/16x9_a_close_up_shot_of_aleo.webp" 
            alt="Soothing Aloe Vera Powder - Natural supplement for digestive health and skin wellness" 
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

const SoothingAloeVeraPowder = () => {
  const benefits = [
    {
      title: "Soothes Digestive Tract",
      description: "Known for its ability to calm and soothe the entire digestive system, reducing irritation and inflammation.",
      icon: Heart
    },
    {
      title: "Promotes Gut Health",
      description: "Acts as a prebiotic to support beneficial gut bacteria and contains enzymes that aid in digestion.",
      icon: Check
    },
    {
      title: "Enhances Hydration",
      description: "Rich in electrolytes, it helps the body to hydrate more effectively than water alone.",
      icon: Droplets
    },
    {
      title: "Supports Skin Vitality",
      description: "Promotes skin repair and hydration from the inside out, leading to a more youthful and radiant complexion.",
      icon: Sun
    },
    {
      title: "Rich in Nutrients",
      description: "Contains a wealth of vitamins, minerals, and amino acids that support overall health and wellness.",
      icon: Leaf
    },
    {
      title: "Boosts Antioxidant Levels",
      description: "Provides powerful antioxidants that help protect the body from oxidative stress and cellular damage.",
      icon: Zap
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <IngredientSchema />
      </Head>
      <Header />
      <main className="flex-1">
        <SoothingAloeVeraPowderHero />
        
        <SplitSection
          image="/lovable-uploads/aloe-vera-closeup.jpg"
          imageAlt="Aloe Vera Close-up"
          title="What is Soothing Aloe Vera Powder?"
          description="A legendary succulent known for its profound healing and hydrating properties."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Soothing Aloe Vera Powder is created from the inner gel of the Aloe barbadensis miller plant. This gel has been used for thousands of years in traditional medicine for its remarkable therapeutic properties. Our powder is carefully processed to concentrate the bioactive compounds, most notably acemannan, a unique polysaccharide.
            </p>
            <p>
              Acemannan is believed to be responsible for many of aloe's benefits, including its anti-inflammatory, antiviral, and immune-supporting effects. The powder form provides a convenient and potent way to incorporate this ancient healer into your daily wellness routine.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Soothing Aloe Vera Powder" 
              description="Experience the gentle yet powerful benefits of this ancient medicinal plant" 
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
          image="/lovable-uploads/skin-health-illustration.jpg"
          imageAlt="Skin Health Illustration"
          title="The Ultimate Skin Food"
          description="How aloe vera nourishes and revitalizes your skin from within"
          reverse
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              While famous for its topical use on sunburns, consuming aloe vera provides profound benefits for skin health. It works from the inside out to hydrate, nourish, and repair.
            </p>
            <p>
              The polysaccharides in aloe help the skin to retain moisture, improving elasticity and reducing the appearance of fine lines. Its anti-inflammatory properties can help calm skin conditions like acne and eczema, while its rich supply of antioxidants protects against premature aging.
            </p>
          </div>
        </SplitSection>

      </main>
      <Footer />
    </div>
  );
};

export default SoothingAloeVeraPowder;