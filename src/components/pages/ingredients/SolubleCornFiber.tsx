'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Shield, Smile, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Zap, Flame } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Soluble Corn Fiber",
    "description": "A high-quality prebiotic fiber that supports digestive health, promotes satiety, and helps maintain healthy blood sugar levels.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition",
      "Endocrinology"
    ],
    "activeIngredient": "Soluble gluco-oligosaccharides",
    "mechanismOfAction": "Acts as a prebiotic to nourish beneficial gut bacteria; slows digestion to increase satiety and support blood sugar control; supports calcium absorption."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const SolubleCornFiberHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/corn-fiber-bg.jpg')`,
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
            <p className="text-yellow-500 font-semibold">Premium Ingredient</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Soluble Corn Fiber<span className="text-yellow-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A gentle, effective prebiotic fiber for superior digestive health, blood sugar support, and enhanced satiety.
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
              <Heart className="h-4 w-4 text-yellow-500 mr-1" />
              <span>Gut Health</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-yellow-500 mr-1" />
              <span>Blood Sugar Support</span>
            </div>
            <div className="flex items-center">
              <Microscope className="h-4 w-4 text-yellow-500 mr-1" />
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
            src="/lovable-uploads/soluble-corn-fiber.jpg" 
            alt="Soluble Corn Fiber" 
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
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 mb-4">
      <Icon className="h-6 w-6 text-yellow-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const SolubleCornFiber = () => {
  const benefits = [
    {
      title: "Excellent Prebiotic Source",
      description: "Nourishes beneficial gut bacteria, promoting a healthy and balanced microbiome for improved digestive wellness.",
      icon: Heart
    },
    {
      title: "Supports Healthy Blood Sugar",
      description: "Helps lower the glycemic response of foods, supporting stable blood sugar levels after meals.",
      icon: BarChart3
    },
    {
      title: "Promotes Satiety",
      description: "Increases feelings of fullness, which can help with weight management by reducing overall calorie intake.",
      icon: Smile
    },
    {
      title: "Well-Tolerated Fiber",
      description: "Known for its high digestive tolerance, making it a comfortable choice for individuals sensitive to other fibers.",
      icon: Shield
    },
    {
      title: "Enhances Calcium Absorption",
      description: "Studies show that soluble corn fiber can increase the absorption of calcium, supporting bone health.",
      icon: Check
    },
    {
      title: "Low Calorie & Sugar-Free",
      description: "An ideal ingredient for health-conscious individuals, providing the benefits of fiber without added sugars or calories.",
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
        <SolubleCornFiberHero />
        
        <SplitSection
          image="/lovable-uploads/corn-closeup.jpg"
          imageAlt="Corn Close-up"
          title="What is Soluble Corn Fiber?"
          description="A versatile and functional fiber derived from corn with significant health benefits."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Soluble Corn Fiber is a type of dietary fiber created from the enzymatic hydrolysis of corn starch. It is a high-quality, well-tolerated prebiotic fiber that is easily incorporated into a variety of foods and supplements. Unlike traditional corn syrup, it is not sweet and does not raise blood sugar levels.
            </p>
            <p>
              Its unique structure allows it to resist digestion in the small intestine, reaching the large intestine where it is fermented by beneficial gut bacteria. This process is key to its prebiotic effects and its role in supporting overall digestive health.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-yellow-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Soluble Corn Fiber" 
              description="Explore the science-backed benefits of this powerful prebiotic fiber" 
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
          title="A Superior Choice for Gut Health"
          description="Why Soluble Corn Fiber is an excellent prebiotic for a happy gut"
          reverse
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Soluble Corn Fiber is highly valued for its excellent digestive tolerance. Many individuals who experience gas or bloating with other prebiotic fibers like inulin find soluble corn fiber to be a much more comfortable alternative.
            </p>
            <p>
              By selectively feeding beneficial bacteria such as Bifidobacteria, it helps to create a healthier gut environment. A balanced microbiome is crucial for proper digestion, nutrient absorption, and a strong immune system. This makes soluble corn fiber a cornerstone ingredient for foundational digestive health.
            </p>
          </div>
        </SplitSection>

      </main>
      <Footer />
    </div>
  );
};

export default SolubleCornFiber;