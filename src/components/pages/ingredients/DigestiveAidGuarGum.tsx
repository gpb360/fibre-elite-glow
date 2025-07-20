'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { SplitSection } from '@/components/ui/split-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Waves, Shield, Smile, ArrowRight, Microscope, Leaf, BarChart3, Droplets, Brain, Check, Zap, Flame } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalSubstance",
    "name": "Digestive-Aid Guar Gum",
    "description": "A natural soluble fiber that acts as a prebiotic, supports digestive regularity, and promotes feelings of fullness.",
    "medicineSystem": "Natural supplement",
    "relevantSpecialty": [
      "Gastroenterology",
      "Nutrition"
    ],
    "activeIngredient": "Galactomannan (a polysaccharide)",
    "mechanismOfAction": "Forms a gel-like substance in the digestive tract, slowing digestion to increase satiety and support blood sugar control. Acts as a prebiotic to feed beneficial gut bacteria."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const DigestiveAidGuarGumHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div className="absolute inset-0 z-0 opacity-20">
      <Image
        src="/assets/webp/16x9_A_close_up_shot_of_guar_gum.webp"
        alt="Natural guar gum powder - soluble fiber source for digestive regularity and gut health support"
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
            <p className="text-blue-500 font-semibold">Premium Ingredient</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Digestive-Aid Guar Gum<span className="text-blue-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              A natural, high-fiber prebiotic that promotes regularity, supports a healthy gut, and helps you feel full longer.
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
              <Waves className="h-4 w-4 text-blue-500 mr-1" />
              <span>Promotes Regularity</span>
            </div>
            <div className="flex items-center">
              <Smile className="h-4 w-4 text-blue-500 mr-1" />
              <span>Increases Satiety</span>
            </div>
            <div className="flex items-center">
              <Microscope className="h-4 w-4 text-blue-500 mr-1" />
              <span>Prebiotic Fiber</span>
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
            src="/assets/webp/16x9_A_close_up_shot_of_guar_gum.webp" 
            alt="Digestive-Aid Guar Gum - Natural thickener and prebiotic fiber for gut health" 
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
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">
      {description}
    </p>
  </motion.div>
);

const DigestiveAidGuarGum = () => {
  const benefits = [
    {
      title: "Supports Digestive Regularity",
      description: "As a soluble fiber, it absorbs water to form a gel, which softens stool and helps prevent constipation.",
      icon: Waves
    },
    {
      title: "Promotes Feelings of Fullness",
      description: "Slows the emptying of the stomach, leading to increased satiety and potentially helping with weight management.",
      icon: Smile
    },
    {
      title: "Acts as a Prebiotic",
      description: "Feeds the beneficial bacteria in your gut, promoting a healthy microbiome and overall digestive wellness.",
      icon: Shield
    },
    {
      title: "Helps Stabilize Blood Sugar",
      description: "Can slow the absorption of sugar, helping to prevent sharp spikes in blood glucose levels after meals.",
      icon: BarChart3
    },
    {
      title: "Supports Heart Health",
      description: "Studies have shown that guar gum can help lower LDL (bad) cholesterol levels.",
      icon: Leaf
    },
    {
      title: "Natural Thickening Agent",
      description: "Its ability to thicken liquids makes it a versatile and natural food additive, improving texture and consistency.",
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
        <DigestiveAidGuarGumHero />
        
        <SplitSection
          image="/lovable-uploads/guar-beans.jpg"
          imageAlt="Guar Beans"
          title="What is Digestive-Aid Guar Gum?"
          description="A natural fiber derived from the humble guar bean with powerful digestive benefits."
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Digestive-Aid Guar Gum is a soluble fiber extracted from the endosperm of the guar bean (Cyamopsis tetragonoloba). This plant is primarily grown in India and Pakistan. The resulting powder is a polysaccharide called galactomannan, which has a unique ability to form a thick gel when mixed with water.
            </p>
            <p>
              This gelling property is what gives guar gum its primary health benefits. It is widely used in the food industry as a natural thickener and stabilizer, but its role as a dietary supplement for digestive health is where it truly shines.
            </p>
          </div>
        </SplitSection>
        
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <Heading 
              title="Health Benefits of Digestive-Aid Guar Gum" 
              description="Explore how this versatile fiber can support your digestive system and beyond" 
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
          title="A Gentle Giant for Your Gut"
          description="How guar gum works to promote comfort and regularity"
          reverse
          className="bg-white"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              When you consume guar gum, it travels through your digestive system largely undigested. In the intestines, it absorbs water and forms a viscous, gel-like substance. This gel has several beneficial effects.
            </p>
            <p>
              First, it adds bulk to your stool, making it softer and easier to pass, which is highly effective for relieving constipation. Second, it slows down the transit of food, which helps you feel fuller for longer and supports better blood sugar control. Finally, it is fermented by the good bacteria in your colon, acting as a valuable prebiotic to nourish your internal ecosystem.
            </p>
          </div>
        </SplitSection>

      </main>
      <Footer />
    </div>
  );
};

export default DigestiveAidGuarGum;
