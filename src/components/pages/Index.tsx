
'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductFeatures from '@/components/ProductFeatures';
import ProductShowcase from '@/components/ProductShowcase';
import HealthSection from '@/components/HealthSection';
import Testimonials from '@/components/Testimonials';
import CtaSection from '@/components/CtaSection';
import FaqSection from '@/components/FaqSection';

const faqItems = [
  {
    question: "What is Total Essential?",
    answer: "Total Essential is a premium fiber supplement derived from natural fruits and vegetables. Each sachet contains a blend of carefully selected ingredients designed to support digestive health, boost immunity, and improve overall wellness."
  },
  {
    question: "How do I use Total Essential?",
    answer: "Simply mix one sachet with 200ml of water, stir well, and drink immediately. For best results, consume one sachet daily, preferably before bedtime, as our product will need 6 to 10 hours to work."
  },
  {
    question: "What's the difference between Total Essential and Total Essentiel Plus?",
    answer: "Total Essentiel Plus contains our advanced formula with additional superfruits, prebiotics, and enhanced nutritional profile. It's designed for those looking for maximum health benefits and targeted digestive support."
  },
  {
    question: "Is Total Essential suitable for children?",
    answer: "Yes, Total Essential is safe for children ages 4 and up. We recommend starting with half a sachet for children under 12 and adjusting as needed. Please consult with your pediatrician before starting any supplement regimen."
  },
  {
    question: "Are there any side effects?",
    answer: "Total Essential is made from 100% natural ingredients and is generally well-tolerated."
  },
  {
    question: "How quickly will I see results?",
    answer: "Most customers report feeling positive changes within 3-7 days of consistent use. For optimal results, we recommend using Total Essential daily for at least 2-4 weeks."
  }
];

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" data-testid="homepage-main">
        <div data-testid="hero-section">
          <Hero />
        </div>
        <div data-testid="product-features">
          <ProductFeatures />
        </div>
        <div data-testid="product-showcase">
          <ProductShowcase />
        </div>
        <div data-testid="health-section">
          <HealthSection />
        </div>
        <div data-testid="testimonials-section">
          <Testimonials />
        </div>
        <div data-testid="faq-section">
          <FaqSection faqs={faqItems} />
        </div>
        <div data-testid="cta-section">
          <CtaSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
