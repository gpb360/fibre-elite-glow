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
    "name": "Fresh Cabbage Extract",
    "description": "A nutrient-dense extract rich in Vitamin K and glutamine, supporting gut lining health and providing powerful anti-inflammatory benefits.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition",
      "Immunology"
    ],
    "activeIngredient": "Vitamin K, L-Glutamine, Sulforaphane, Anthocyanins",
    "mechanismOfAction": "Supports gut barrier integrity; provides anti-inflammatory compounds; rich in antioxidants to combat cellular damage."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const FreshCabbageExtractHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div className="absolute inset-0 z-0 opacity-20">
      <Image
        src="/assets/webp/16x9_a_close_up_shot_of_cabbage.webp"
        alt="Fresh organic cabbage - nutrient-dense cruciferous vegetable for gut lining support and wellness"
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
            <p className="text-green-600 font-semibold">Premium Ingredient</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Fresh Cabbage Extract<span className="text-green-600">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A powerhouse of gut-healing nutrients, supporting a healthy digestive lining and reducing inflammation.
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
              <Heart className="h-4 w-4 text-green-600 mr-1" />
              <span>Gut Lining Support</span>
            </div>
            <div className="flex items-center">
              <Flame className="h-4 w-4 text-green-600 mr-1" />
              <span>Anti-Inflammatory</span>
            </div>
            <div className="flex items-center">
              <Microscope className="h-4 w-4 text-green-600 mr-1" />
              <span>Nutrient-Rich</span>
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
            src="/assets/webp/16x9_a_close_up_shot_of_cabbage.webp"
            alt="Fresh Cabbage Extract - Vitamin C rich cruciferous vegetable for immune support" 
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
      <Icon className="h-6 w-6 text-green-700" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const FreshCabbageExtract = () => {
  const benefits = [
    {
      title: "Soothes Digestive Lining",
      description: "Rich in L-glutamine, an amino acid that is essential for the health and repair of the intestinal lining.",
      icon: Heart
    },
    {
      title: "Reduces Inflammation",
      description: "Contains powerful antioxidants like sulforaphane and anthocyanins that help combat inflammation throughout the body.",
      icon: Flame
    },
    {
      title: "Rich in Vitamin K",
      description: "An excellent source of Vitamin K, which is crucial for blood clotting and bone health.",
      icon: Shield
    },
    {
      title: "Supports Detoxification",
      description: "The compounds in cabbage help support the liver's natural detoxification pathways, aiding in the removal of toxins.",
      icon: Zap
    },
    {
      title: "Boosts Immunity",
      description: "High in Vitamin C and other antioxidants that help strengthen the immune system and protect against illness.",
      icon: Check
    },
    {
      title: "Promotes Heart Health",
      description: "Anthocyanins, found in red cabbage, have been linked to a lower risk of heart disease.",
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
        <FreshCabbageExtractHero />
        
        <SplitSection
          image="/lovable-uploads/cabbage-closeup.jpg"
          imageAlt="Cabbage Close-up"
          title="What is Fresh Cabbage Extract?"
          description="A concentrated source of the powerful nutrients found in fresh, leafy cabbage."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Fresh Cabbage Extract is derived from organically grown cabbage (Brassica oleracea), a cruciferous vegetable celebrated for its impressive nutritional profile. Our gentle extraction process preserves the delicate vitamins, minerals, and bioactive compounds, delivering a potent dose of goodness in every serving.
            </p>
            <p>
              Historically, cabbage juice has been used as a traditional remedy for stomach ulcers and other digestive complaints. Modern science now understands that this is largely due to its high content of L-glutamine and other gut-supportive nutrients.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Fresh Cabbage Extract" 
              description="Discover the science-backed benefits of this humble yet powerful vegetable" 
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
          title="The Ultimate Gut Healer"
          description="How Cabbage Extract provides critical support for the intestinal lining"
          reverse
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              The standout benefit of cabbage extract is its ability to heal and protect the gut lining. It is one of the richest natural sources of L-glutamine, the most abundant amino acid in the bloodstream.
            </p>
            <p>
              Glutamine is the primary fuel source for the cells of the small intestine, helping them to regenerate and repair. This strengthens the gut barrier, preventing "leaky gut" and reducing inflammation associated with various digestive disorders.
            </p>
          </div>
        </SplitSection>

      </main>
      <Footer />
    </div>
  );
};

export default FreshCabbageExtract;