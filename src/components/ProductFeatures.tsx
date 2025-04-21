
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Zap, Star, Award } from 'lucide-react';
import { HoverEffect, CardTitle, CardDescription } from '@/components/ui/card-hover-effect';
import { Heading } from '@/components/ui/heading';

const features = [
  {
    title: "Natural Ingredients",
    description: "Made with 100% natural fruits and vegetables for optimal nutrition and health benefits.",
    icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Digestive Health",
    description: "Supports healthy digestion and helps maintain a balanced gut microbiome.",
    icon: <Heart className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Energy & Vitality",
    description: "Provides natural energy without crashes, supporting sustained vitality throughout the day.",
    icon: <Zap className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Immunity Support",
    description: "Rich in antioxidants and essential nutrients that help strengthen your immune system.",
    icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Weight Management",
    description: "High fiber content helps you feel fuller longer, supporting healthy weight management.",
    icon: <Award className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Daily Convenience",
    description: "Easy-to-use sachets perfect for busy lifestyles. Just mix with water and enjoy.",
    icon: <Star className="h-6 w-6 text-green-500" />,
  },
];

export function ProductFeatures() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container px-4 md:px-6">
        <Heading
          title="The Benefits of Total Essential"
          description="Our premium fiber drink delivers multiple health benefits with every serving."
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
              "Total Essential is formulated by nutritional experts to deliver maximum health benefits
              while maintaining delicious taste. Each ingredient is carefully selected for its nutritional
              profile and natural properties."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProductFeatures;
