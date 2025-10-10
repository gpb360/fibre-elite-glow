'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, Shield, Droplets, Leaf, Flame, Heart } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Antioxidant Parsley",
    "description": "A vibrant herb packed with antioxidants like flavonoids and vitamin C, supporting cellular health, detoxification, and kidney function.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Nutrition",
      "Urology",
      "Preventive Medicine"
    ],
    "activeIngredient": "Myricetin, Apigenin, Vitamin K, Vitamin C",
    "mechanismOfAction": "Provides potent antioxidants to combat oxidative stress; acts as a natural diuretic to support kidney health; rich in Vitamin K for bone and blood health."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const AntioxidantParsleyHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div className="absolute inset-0 z-0 opacity-20">
      <Image
        src="/lovable-uploads/webp/antioxidant-parsley-fresh-herb.webp"
        alt="Fresh vibrant parsley - antioxidant-rich herb ingredient for digestive health and detoxification"
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
              Antioxidant Parsley<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A potent source of antioxidants and vitamins to protect your cells, support detoxification, and promote overall vitality.
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
              <span>Rich in Antioxidants</span>
            </div>
            <div className="flex items-center">
              <Droplets className="h-4 w-4 text-green-500 mr-1" />
              <span>Kidney Support</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>Cellular Protection</span>
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
            src="/lovable-uploads/webp/antioxidant-parsley-fresh-herb.webp"
            alt="Antioxidant Parsley - Fresh herb rich in vitamins and detoxifying compounds"
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

const AntioxidantParsley = () => {
  const benefits = [
    {
      title: "Powerful Antioxidant Source",
      description: "Loaded with flavonoids like myricetin and apigenin, which combat free radical damage and reduce oxidative stress.",
      icon: Zap
    },
    {
      title: "Supports Kidney Health",
      description: "Acts as a natural diuretic, helping to flush toxins from the kidneys and reduce bloating.",
      icon: Droplets
    },
    {
      title: "Rich in Vitamin K",
      description: "Provides a significant amount of Vitamin K, essential for proper blood clotting and building strong bones.",
      icon: Heart
    },
    {
      title: "Boosts Vitamin C",
      description: "A great source of Vitamin C, which is vital for a healthy immune system and vibrant skin.",
      icon: Shield
    },
    {
      title: "Anti-Inflammatory Effects",
      description: "The antioxidants in parsley have anti-inflammatory properties that can help reduce the risk of chronic diseases.",
      icon: Flame
    },
    {
      title: "Protects Eye Health",
      description: "Contains carotenoids like lutein and zeaxanthin, which are known to protect vision and eye health.",
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
        <AntioxidantParsleyHero />
        
        <SplitSection
          image="/lovable-uploads/webp/antioxidant-parsley-fresh-herb.webp"
          imageAlt="Antioxidant Parsley - Fresh vibrant cluster of parsley leaves"
          title="What is Antioxidant Parsley?"
          description="More than just a garnish, parsley is a surprisingly potent medicinal herb."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Antioxidant Parsley extract is derived from the fresh leaves of the Petroselinum crispum plant. While commonly used to flavor dishes, parsley is a nutritional powerhouse packed with a unique combination of vitamins, minerals, and volatile oils that provide significant health benefits.
            </p>
            <p>
              Our extract concentrates these beneficial compounds, particularly the flavonoids myricetin and apigenin, which are powerful antioxidants. This makes parsley a valuable ingredient for protecting the body against cellular damage and supporting overall wellness.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Antioxidant Parsley" 
              description="Discover the protective and detoxifying power of this vibrant green herb" 
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
          image="/lovable-uploads/webp/antioxidant-parsley-fresh-herb.webp"
          imageAlt="Antioxidant Parsley - Natural detoxifying herb for cleansing"
          title="A Natural Detoxifier"
          description="How parsley supports the body's natural cleansing processes"
          reverse
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Parsley has long been valued for its ability to support detoxification. It acts as a natural diuretic, which means it helps to increase urine flow. This process aids the kidneys in flushing out excess toxins, salt, and water from the body.
            </p>
            <p>
              By promoting healthy kidney function and reducing water retention, parsley can help you feel lighter and less bloated. Its chlorophyll content also helps to purify the blood, further enhancing its detoxifying effects.
            </p>
          </div>
        </SplitSection>

      </main>
      <Footer />
    </div>
  );
};

export default AntioxidantParsley;
