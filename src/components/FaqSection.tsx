
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heading } from "@/components/ui/heading";

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
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container px-4 md:px-6">
        <Heading
          title={title}
          description={description}
          centered
          className="mb-10"
        />
        
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
