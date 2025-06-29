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
    "name": "Prebiotic Powerhouse",
    "description": "A blend of diverse prebiotic fibers designed to nourish a wide range of beneficial gut bacteria, promoting a balanced and resilient microbiome.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition",
      "Immunology"
    ],
    "activeIngredient": "Inulin, Fructooligosaccharides (FOS), Galactooligosaccharides (GOS), Soluble Corn Fiber",
    "mechanismOfAction": "Provides a food source for beneficial gut bacteria; promotes production of short-chain fatty acids (SCFAs); supports gut barrier function; enhances immune response."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const PrebioticPowerhouseHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div 
      className="absolute inset-0 z-0 bg-cover bg-center opacity-20" 
      style={{ 
        backgroundImage: `url('/assets/16x9_a_prebiotic-powerhouse.png')`,
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
            <p className="text-purple-500 font-semibold">Premium Ingredient Blend</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Prebiotic Powerhouse<span className="text-purple-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Fuel your gut's best bacteria with our diverse blend of powerful prebiotic fibers for ultimate digestive harmony.
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
              <Leaf className="h-4 w-4 text-purple-500 mr-1" />
              <span>Microbiome Fuel</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-purple-500 mr-1" />
              <span>Immune Support</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-purple-500 mr-1" />
              <span>Digestive Harmony</span>
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
            src="/assets/16x9_a_prebiotic-powerhouse.png"
            alt="Prebiotic Powerhouse" 
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
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
      <Icon className="h-6 w-6 text-purple-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const PrebioticPowerhouse = () => {
  const benefits = [
    {
      title: "Diverse Microbiome Fuel",
      description: "Our blend of multiple prebiotic fibers nourishes a wider variety of beneficial gut bacteria than single-fiber sources.",
      icon: Leaf
    },
    {
      title: "Enhanced Gut Barrier",
      description: "Promotes the production of short-chain fatty acids (SCFAs) like butyrate, which strengthen the gut lining and prevent 'leaky gut'.",
      icon: Shield
    },
    {
      title: "Improved Digestion",
      description: "Supports smooth and regular bowel function by adding healthy bulk and fostering a balanced gut environment.",
      icon: Droplets
    },
    {
      title: "Boosted Immunity",
      description: "A healthy gut microbiome is key to a strong immune system. Our prebiotic blend helps your body's natural defenses.",
      icon: Check
    },
    {
      title: "Mood and Brain Health",
      description: "The gut-brain axis is real. A nourished microbiome can positively influence mood, stress resilience, and cognitive function.",
      icon: Brain
    },
    {
      title: "Metabolic Support",
      description: "A balanced gut can improve nutrient absorption and support healthy metabolic processes throughout the body.",
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
        <PrebioticPowerhouseHero />
        
        <SplitSection
          image="/lovable-uploads/prebiotic-foods.jpg"
          imageAlt="Prebiotic Foods"
          title="What is the Prebiotic Powerhouse?"
          description="A synergistic blend of nature's best prebiotic fibers."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              The Prebiotic Powerhouse isn't just one ingredient—it's a carefully selected blend of different types of prebiotic fibers. This diversity is key, as different beneficial bacteria in your gut prefer different types of fuel. By providing a variety of fibers, we ensure a wider range of your gut's 'good guys' get the nourishment they need to thrive.
            </p>
            <p>
              Our blend includes fibers like Fructooligosaccharides (FOS) from sources like chicory root, Galactooligosaccharides (GOS), and other specialized fibers, each with unique benefits for your microbiome.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Benefits of a Diverse Prebiotic Blend" 
              description="Why feeding your entire microbiome is better than focusing on just one part" 
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

export default PrebioticPowerhouse;
