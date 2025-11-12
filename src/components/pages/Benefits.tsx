'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Brain, Weight, BookCheck, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

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
}) => <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-green-100 p-3">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>;

const BenefitsHero = () => (
  <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
    <div className="absolute inset-0 z-0 opacity-20">
      <Image
        src="/assets/dual-total-essential-and-plus-together.png"
        alt="Total Essential and Total Essential Plus Canadian fiber supplement bottles - Premium gut health products available Canada-wide"
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
            <p className="text-green-500 font-semibold">Total Essential</p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Fiber Benefits<span className="text-green-500">.</span>
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Discover the power of natural fiber supplements derived from whole foods, 
              supporting your digestive health, energy, and overall wellness.
            </p>
          </motion.div>
          <motion.div className="flex flex-col gap-2 min-[400px]:flex-row" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            <Link
              href="/products/total-essential"
              className={cn(buttonVariants({ size: "xl", variant: "premium" }))}
            >
              Total Essential
            </Link>
            <Link
              href="/products/total-essential-plus"
              className={cn(buttonVariants({ size: "xl", variant: "premium2" }))}
            >
              Total Essential Plus
            </Link>
          </motion.div>
          
          <motion.div className="flex items-center space-x-4 text-sm" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: 0.4
        }}>
            <div className="flex items-center">
              <Award className="h-4 w-4 text-green-500 mr-1" />
              <span>Evidence-Based</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-green-500 mr-1" />
              <span>Natural Ingredients</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-green-500 mr-1" />
              <span>Holistic Health</span>
            </div>
          </motion.div>
        </div>
        <motion.div className="mx-auto flex items-center justify-center" initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.7
      }}>
          <div className="relative">
            
            
            <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
              <div className="text-center text-sm font-bold">
                NEW
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Benefits = () => {
  const benefits = [{
    title: "Digestive Health",
    description: "Normalizes bowel movements and helps maintain bowel health by increasing stool bulk and softness. May help prevent hemorrhoids and diverticular disease.",
    icon: Heart
  }, {
    title: "Heart Health",
    description: "Helps lower cholesterol levels, especially LDL (bad) cholesterol, while potentially reducing blood pressure and inflammation.",
    icon: Award
  }, {
    title: "Blood Sugar Control",
    description: "Slows the absorption of sugar and helps improve blood sugar levels, potentially reducing the risk of developing type 2 diabetes.",
    icon: Brain
  }, {
    title: "Weight Management",
    description: "High-fiber foods are more filling, helping you eat less and stay satisfied longer. They're typically lower in calories for the same volume.",
    icon: Weight
  }, {
    title: "Skin Health",
    description: "Helps remove toxins from your body that might otherwise be expelled through your skin, potentially reducing acne and other skin issues.",
    icon: Star
  }, {
    title: "Overall Wellness",
    description: "May help prevent gallstones, kidney stones, and provide relief from irritable bowel syndrome (IBS).",
    icon: BookCheck
  }];
  return <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <BenefitsHero />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto mb-12">
            <Heading title="Health Benefits of Fiber Supplements" description="Discover how our natural fiber supplements can transform your health and well-being through these key benefits." centered className="mb-8" />
            
            <div className="text-gray-600 space-y-4 mb-12">
              <p>
                In today's fast-paced world, maintaining a balanced diet rich in fiber can be challenging. 
                Our premium fiber supplements bridge this nutritional gap, offering a convenient way to 
                enjoy the many health benefits of dietary fiber.
              </p>
              <p>
                Made from 100% natural fruit and vegetable extracts, our products deliver both soluble 
                and insoluble fiber to support your overall health and wellness journey.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(benefit => <BenefitCard key={benefit.title} title={benefit.title} description={benefit.description} icon={benefit.icon} />)}
          </div>

          <div className="mt-12 bg-green-50 rounded-lg p-8">
            <Heading title="Scientific Evidence" description="Our products are backed by extensive research and scientific studies demonstrating the importance of fiber in maintaining good health." size="md" className="mb-6" />
            <div className="text-gray-600 space-y-4">
              <p>
                Research from prestigious institutions like the Mayo Clinic has shown that a high-fiber diet 
                can reduce the risk of heart disease by up to 40%, while helping to maintain healthy blood 
                sugar levels and supporting weight management goals.
              </p>
              <p>
                Studies have demonstrated that for every additional 7 grams of fiber consumed daily, the risk 
                of stroke decreases by 7%, highlighting the crucial role of adequate fiber intake in 
                cardiovascular health.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};

export default Benefits;
