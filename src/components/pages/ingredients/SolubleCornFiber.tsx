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

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Soluble Corn Fiber",
    "description": "A prebiotic fiber that supports digestive health by promoting the growth of beneficial gut bacteria, aiding in regularity, and supporting mineral absorption.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition",
      "Endocrinology"
    ],
    "activeIngredient": "Soluble Corn Fiber (SCF)",
    "mechanismOfAction": "Acts as a prebiotic to nourish beneficial gut bacteria; increases fecal bulk to promote regularity; slows glucose absorption; enhances calcium absorption."
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
        backgroundImage: `url('/assets/16x9_A_close_up_of_a_corn_plant_with_.png')`,
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
              A gentle, effective prebiotic fiber that nourishes your gut microbiome and supports digestive wellness.
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
              <Leaf className="h-4 w-4 text-yellow-500 mr-1" />
              <span>Prebiotic Power</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-yellow-500 mr-1" />
              <span>Blood Sugar Support</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-yellow-500 mr-1" />
              <span>Well-Tolerated</span>
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
            src="/assets/16x9_A_close_up_of_a_corn_plant_with_.png"
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
      title: "Nourishes Gut Bacteria",
      description: "As a prebiotic, it feeds beneficial bacteria like Bifidobacteria, helping them thrive and support a healthy gut microbiome.",
      icon: Leaf
    },
    {
      title: "Promotes Regularity",
      description: "Increases stool bulk and moisture, leading to more regular and comfortable bowel movements without harsh effects.",
      icon: Droplets
    },
    {
      title: "Supports Blood Sugar",
      description: "Has a low glycemic response, meaning it doesn't cause sharp spikes in blood sugar levels, making it suitable for metabolic health.",
      icon: BarChart3
    },
    {
      title: "Enhances Calcium Absorption",
      description: "Studies show that soluble corn fiber can increase the absorption of calcium, which is vital for bone density and health.",
      icon: Shield
    },
    {
      title: "Well-Tolerated Fiber",
      description: "Known for its high digestive tolerance, it is less likely to cause gas and bloating compared to other prebiotic fibers like inulin.",
      icon: Check
    },
    {
      title: "Supports Satiety",
      description: "As a dietary fiber, it can help you feel fuller for longer, which may aid in weight management efforts.",
      icon: Heart
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
          image="/lovable-uploads/corn-field.jpg"
          imageAlt="Corn Field"
          title="What is Soluble Corn Fiber?"
          description="A versatile and well-tolerated prebiotic fiber derived from corn."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Soluble Corn Fiber (SCF), also known as resistant maltodextrin, is a dietary fiber made from the enzymatic hydrolysis of cornstarch. Unlike regular cornstarch, it resists digestion in the small intestine and passes into the large intestine, where it functions as a prebiotic.
            </p>
            <p>
              This process makes it a valuable ingredient for supporting gut health. It provides the benefits of dietary fiber—such as promoting regularity and feeding beneficial gut bacteria—while being exceptionally well-tolerated, often causing less gas or bloating than other fiber sources.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-yellow-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Soluble Corn Fiber" 
              description="Explore the diverse ways this gentle fiber supports your digestive and overall health" 
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

export default SolubleCornFiber;
