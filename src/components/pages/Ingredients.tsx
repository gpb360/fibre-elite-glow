'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// Schema.org JSON-LD structured data for SEO
const IngredientsSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Premium Ingredients | Fibre Elite Glow",
    "description": "Discover our premium, scientifically-backed ingredients that power our fiber supplements for optimal digestive health and overall wellness.",
    "url": "https://www.fibre-elite-glow.com/ingredients",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Fibre Elite Glow",
      "url": "https://www.fibre-elite-glow.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

const IngredientCard = ({
  title,
  description,
  image,
  slug
}: {
  title: string;
  description: string;
  image: string;
  slug: string;
}) => (
  <motion.div 
    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <Link href={`/ingredients/${slug}`}>
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={image} 
          alt={`${title} - Natural ingredient for health and wellness`} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-green-700">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        <div className="flex items-center text-green-600 font-medium">
          Learn more
          <svg
            className="h-4 w-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  </motion.div>
);

const IngredientsHero = () => (
  <section className="relative bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
    <div className="container px-4 md:px-6 mx-auto">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Premium Quality <span className="text-green-500">Ingredients</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Discover the science-backed, premium ingredients that power our fiber supplements for optimal digestive health and overall wellness.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

interface Ingredient {
  name: string;
  path: string;
  image: string;
}

const Ingredients = ({ ingredients }: { ingredients: Ingredient[] }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <IngredientsSchema />
      </Head>
      <Header />
      <main className="flex-1">
        <IngredientsHero />
        
        {/* Ingredients Grid */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <Heading
              title="Our Quality Ingredients"
              description="Each ingredient is carefully selected for its specific health benefits and synergistic effects"
              centered
              className="mb-12"
            />
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {ingredients.map((ingredient) => (
                <IngredientCard
                  key={ingredient.path}
                  title={ingredient.name}
                  description={`Learn more about the benefits of ${ingredient.name}.`}
                  image={ingredient.image}
                  slug={ingredient.path.replace('/ingredients/', '')}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Quality Standards Section */}
        <section className="py-16 bg-green-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <Heading
                title="Our Quality Standards"
                description="We're committed to sourcing only the highest quality ingredients for our products"
                centered
                className="mb-8"
              />
              
              <div className="space-y-6 text-left">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Scientifically Validated</h3>
                    <p className="text-gray-600">
                      We select ingredients with proven benefits backed by scientific research and clinical studies, ensuring that our products deliver real results.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Premium Sourcing</h3>
                    <p className="text-gray-600">
                      Our ingredients are sourced from trusted suppliers who meet our rigorous quality standards. Many of our ingredients are organic, non-GMO, and sustainably harvested.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Rigorous Testing</h3>
                    <p className="text-gray-600">
                      Each ingredient undergoes thorough testing for purity, potency, and safety. We verify that our ingredients are free from contaminants and meet our specifications.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-100 mr-4">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Synergistic Formulations</h3>
                    <p className="text-gray-600">
                      Our ingredients are carefully combined to work synergistically, enhancing each other's benefits and and providing comprehensive support for your digestive health and overall wellness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Benefits of Our Premium Ingredients</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our carefully formulated products combine these powerful ingredients to provide comprehensive support for your digestive health and overall wellness.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products/total-essential">
                <Button variant="premium" size="lg">
                  Shop Total Essential
                </Button>
              </Link>
              <Link href="/products/total-essential-plus">
                <Button variant="outline" size="lg">
                  Explore Total Essential Plus
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Ingredients;
