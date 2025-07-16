import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Fiber Supplements | Total Essential Collection | Fibre Elite Glow',
  description: 'Discover our premium fiber blend collection: Total Essential and Total Essential Plus. Natural fruit & vegetable fiber supplements for optimal digestive health and daily wellness.',
  keywords: 'fiber supplements, digestive health, natural fiber, Total Essential, fruit fiber, vegetable fiber, gut health, daily wellness, fiber blend',
  openGraph: {
    title: 'Premium Fiber Supplements | Total Essential Collection',
    description: 'Choose the perfect natural fiber blend for your daily wellness routine. Premium supplements crafted from 100% fruit & vegetable fibers.',
    type: 'website',
    images: [
      {
        url: '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp',
        width: 1200,
        height: 630,
        alt: 'Total Essential Premium Fiber Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Fiber Supplements | Total Essential Collection',
    description: 'Choose the perfect natural fiber blend for your daily wellness routine.',
    images: ['/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp']
  }
};
import { ProductCard } from '@/components/ui/product-card';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductsPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <Heading
              title="Our Fiber Blend Collection"
              description="Choose the perfect natural fiber blend for your daily wellness routine"
              centered
              className="mb-16"
            />

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
              <ProductCard
                variant="green"
                image="/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp"
                title="Total Essential"
                price="$79.99"
                description="PREMIUM DAILY FIBER BLEND – Crafted from 100% fruit & vegetable fibers for gentle, natural regularity. 15 sachets per box."
                badge="Best Seller"
                productId="total-essential-base"
                productType="total_essential"
                originalPrice="$89.99"
                savings={10}
              />

              <ProductCard
                variant="purple"
                image="/lovable-uploads/webp/5f8f72e3-397f-47a4-8bce-f15924c32a34.webp"
                title="Total Essential Plus"
                price="$84.99"
                description="ADVANCED DAILY FIBER BLEND – Enhanced with super-fruits for added antioxidants and a vibrant glow. 15 sachets per box."
                badge="New"
                productId="total-essential-plus-base"
                productType="total_essential_plus"
                originalPrice="$94.99"
                savings={10}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
              <Link href="/products/total-essential">
                <Button variant="premium" size="lg" className="w-full sm:w-auto px-8">
                  View Total Essential
                </Button>
              </Link>
              <Link href="/products/total-essential-plus">
                <Button variant="premium2" size="lg" className="w-full sm:w-auto px-8">
                  View Total Essential Plus
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

export default ProductsPage;