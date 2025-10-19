
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heading } from "@/components/ui/heading";
import { generateFAQSchema } from '@/lib/seo';
import StructuredData from '@/components/seo/StructuredData';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  description?: string;
  faqs: FaqItem[];
}

export function FaqSection({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about our products and services.",
  faqs
}: FaqSectionProps) {
  // Generate FAQ schema for SEO
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <StructuredData data={faqSchema} />
      <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <Heading
          title={title}
          description={description}
          centered
          className="mb-12"
        />

        <div className="mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-green-600 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
    </>
  );
}

export default FaqSection;
