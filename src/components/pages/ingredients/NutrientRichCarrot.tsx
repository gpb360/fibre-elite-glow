'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Eye, Sun, Shield, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Zap, Flame } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Nutrient-Rich Carrot",
    "description": "A natural source of beta-carotene and fiber, supporting vision, skin health, and digestive wellness.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition",
      "Dermatology"
    ],
    "activeIngredient": "Beta-carotene, Vitamin A, and dietary fiber",
    "mechanismOfAction": "Provides provitamin A (beta-carotene) for vision and immune function; fiber supports digestive regularity and gut health; antioxidants protect against cellular damage."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const NutrientRichCarrotHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div className="absolute inset-0 z-0 opacity-20">
      <Image
        src="/assets/webp/16x9_a_plump_organic_carrot_with_inte.webp"
        alt="Fresh organic carrot - beta-carotene rich root vegetable for vision support and digestive fiber"
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
            <p className="text-orange-500 font-semibold">Premium Ingredient</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Nutrient-Rich Carrot<span className="text-orange-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Packed with beta-carotene and fiber, supporting vibrant vision, radiant skin, and optimal digestive health.
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
              <Eye className="h-4 w-4 text-orange-500 mr-1" />
              <span>Vision Support</span>
            </div>
            <div className="flex items-center">
              <Sun className="h-4 w-4 text-orange-500 mr-1" />
              <span>Skin Health</span>
            </div>
            <div className="flex items-center">
              <Microscope className="h-4 w-4 text-orange-500 mr-1" />
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
          <Image 
            src="/assets/webp/16x9_a_plump_organic_carrot_with_inte.webp" 
            alt="Nutrient-Rich Carrot - Beta-carotene rich ingredient for eye health and immunity" 
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
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 mb-4">
      <Icon className="h-6 w-6 text-orange-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const NutrientRichCarrot = () => {
  const benefits = [
    {
      title: "Supports Healthy Vision",
      description: "Beta-carotene converts to Vitamin A, which is essential for maintaining good vision and preventing age-related eye issues.",
      icon: Eye
    },
    {
      title: "Promotes Radiant Skin",
      description: "Antioxidants in carrots protect the skin from sun damage and pollutants, promoting a healthy, youthful glow.",
      icon: Sun
    },
    {
      title: "Boosts Immune Function",
      description: "Vitamin A plays a crucial role in strengthening the immune system, helping the body fight off infections.",
      icon: Shield
    },
    {
      title: "Aids Digestive Health",
      description: "The dietary fiber in carrots promotes regular bowel movements and supports a healthy gut microbiome.",
      icon: Droplets
    },
    {
      title: "Supports Brain Health",
      description: "The antioxidant properties of beta-carotene may help improve cognitive function and memory.",
      icon: Brain
    },
    {
      title: "Provides Antioxidant Power",
      description: "Carrots are rich in antioxidants that fight free radicals, reducing oxidative stress and cellular damage.",
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
        <NutrientRichCarrotHero />
        
        <SplitSection
          image="/lovable-uploads/carrot-closeup.jpg"
          imageAlt="Carrot Close-up"
          title="What is Nutrient-Rich Carrot?"
          description="A vibrant root vegetable packed with essential vitamins, minerals, and powerful antioxidants."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Nutrient-Rich Carrot is derived from the finest organically grown carrots (Daucus carota), renowned for their high concentration of beta-carotene and other vital nutrients. Our specialized extraction process ensures that the maximum nutritional value is retained, providing a potent and bioavailable source of this incredible superfood.
            </p>
            <p>
              Beyond their vibrant color, carrots are a powerhouse of health benefits. They are an excellent source of dietary fiber, Vitamin K, potassium, and a host of powerful antioxidants. This makes them an invaluable addition to any diet focused on long-term health and wellness.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-orange-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Nutrient-Rich Carrot" 
              description="Discover the remarkable ways carrots support your vision, skin, and overall health" 
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
          title="Carrot & Gut Health"
          description="How the fiber in carrots promotes a healthy digestive system"
          reverse
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              The dietary fiber in carrots plays a crucial role in maintaining a healthy digestive system. It adds bulk to stool, which helps prevent constipation and promotes regular bowel movements. Additionally, the fiber acts as a prebiotic, feeding the beneficial bacteria in your gut and supporting a balanced microbiome.
            </p>
            <p>
              A healthy gut is essential for overall wellness, as it impacts everything from nutrient absorption to immune function. By incorporating nutrient-rich carrots into your diet, you are taking a significant step towards supporting your digestive health and overall vitality.
            </p>
          </div>
        </SplitSection>

      </main>
      <Footer />
    </div>
  );
};

export default NutrientRichCarrot;