
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Zap, Star, Award } from 'lucide-react';
import { HoverEffect, CardTitle, CardDescription } from '@/components/ui/card-hover-effect';
import { Heading } from '@/components/ui/heading';

const features = [
  {
    title: "Natural Ingredients",
    description: "Whole-fruit and vegetable fibers in every sachet",
    icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Gentle Regularity",
    description: "Promotes comfortable, predictable digestion.",
    icon: <Heart className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Sustained Vitality",
    description: "Feel lighter and energized throughout your day.",
    icon: <Zap className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Everyday Defense",
    description: "Antioxidant-rich fibers to support overall wellness.",
    icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Satisfying Fullness",
    description: "Fiber helps curb cravings between meals",
    icon: <Award className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Effortless Routine",
    description: "Single-serve sachets fit seamlessly into busy mornings",
    icon: <Star className="h-6 w-6 text-green-500" />,
  },
];

export function ProductFeatures() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container px-4 md:px-6">
        <Heading
          title="Natural Balance for Daily Wellness"
          description="Our plant-based fiber blend supports your body's natural rhythm"
          centered
          className="mb-10"
        />
        
        <HoverEffect items={features} />

        <div className="mt-16 flex justify-center">
          <motion.div
            className="bg-green-50 border border-green-100 rounded-lg p-6 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-center text-green-800 font-medium italic">
              "Crafted to harmonize with your body, our blend delivers nourishment you can feel—naturally."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProductFeatures;
