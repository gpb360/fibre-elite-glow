'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Wind, Shield, Heart, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Zap, Flame } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Enzyme-Rich Papaya",
    "description": "A tropical fruit extract rich in papain, a powerful digestive enzyme that helps break down proteins and supports digestive comfort.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition"
    ],
    "activeIngredient": "Papain, Chymopapain, Vitamin C, Antioxidants",
    "mechanismOfAction": "Provides proteolytic enzymes to aid protein digestion; reduces bloating and indigestion; offers anti-inflammatory and antioxidant benefits."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const EnzymeRichPapayaHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/papaya-bg.jpg')`,
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
            <p className="text-orange-500 font-semibold">Premium Ingredient</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Enzyme-Rich Papaya<span className="text-orange-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Harness the power of natural digestive enzymes to break down proteins, reduce bloating, and enhance nutrient absorption.
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
              <Wind className="h-4 w-4 text-orange-500 mr-1" />
              <span>Digestive Aid</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-orange-500 mr-1" />
              <span>Anti-Inflammatory</span>
            </div>
            <div className="flex items-center">
              <Microscope className="h-4 w-4 text-orange-500 mr-1" />
              <span>Nutrient Absorption</span>
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
            src="/lovable-uploads/papaya-extract.jpg" 
            alt="Enzyme-Rich Papaya" 
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
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 mb-4">
      <Icon className="h-6 w-6 text-orange-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const EnzymeRichPapaya = () => {
  const benefits = [
    {
      title: "Aids Protein Digestion",
      description: "The enzyme papain is a powerful protease that helps break down tough protein fibers, improving digestion and nutrient absorption.",
      icon: Wind
    },
    {
      title: "Reduces Bloating & Gas",
      description: "By improving the breakdown of food, papaya extract can significantly reduce symptoms of bloating, gas, and indigestion.",
      icon: Shield
    },
    {
      title: "Anti-Inflammatory Properties",
      description: "Papain and other compounds in papaya have natural anti-inflammatory effects, helping to soothe the digestive tract.",
      icon: Flame
    },
    {
      title: "Supports Immune Health",
      description: "Rich in Vitamin C and other antioxidants, papaya helps to strengthen the immune system and protect against oxidative stress.",
      icon: Heart
    },
    {
      title: "Promotes Skin Health",
      description: "The enzymes in papaya can help to exfoliate dead skin cells, while its vitamins and antioxidants promote a clear, radiant complexion.",
      icon: Zap
    },
    {
      title: "Enhances Nutrient Uptake",
      description: "Improved digestion means your body can more effectively absorb the essential nutrients from the food you eat.",
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
        <EnzymeRichPapayaHero />
        
        <SplitSection
          image="/lovable-uploads/papaya-closeup.jpg"
          imageAlt="Papaya Close-up"
          title="What is Enzyme-Rich Papaya?"
          description="A delicious tropical fruit celebrated for its powerful digestive enzymes."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Enzyme-Rich Papaya extract is sourced from the fruit of the Carica papaya plant. It is most famous for containing papain, a proteolytic enzyme that is highly effective at breaking down proteins. This makes it a popular natural remedy for a wide range of digestive issues.
            </p>
            <p>
              Our extract is carefully prepared to preserve the activity of these delicate enzymes, ensuring you receive the maximum benefit. Beyond papain, papaya is also a rich source of antioxidants, vitamins A, C, and E, and folate.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-orange-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Enzyme-Rich Papaya" 
              description="Unlock better digestion and wellness with the power of natural papaya enzymes" 
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
          image="/lovable-uploads/gut-health-illustration.jpg"
          imageAlt="Gut Health Illustration"
          title="Nature's Digestive Assistant"
          description="How papain works to support comfortable and efficient digestion"
          reverse
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              The primary role of papain is to assist in the digestion of proteins. It works in a wide range of pH levels, making it effective throughout the digestive tract. By breaking down large proteins into smaller, more easily absorbed peptides and amino acids, papain can alleviate the digestive burden on your body.
            </p>
            <p>
              This leads to improved comfort after meals, reduced feelings of heaviness or bloating, and better overall nutrient absorption. For individuals who struggle with protein digestion, papaya extract can be a game-changing natural supplement.
            </p>
          </div>
        </SplitSection>

      </main>
      <Footer />
    </div>
  );
};

export default EnzymeRichPapaya;