
import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { Heading } from '@/components/ui/heading';

export function Testimonials() {
  const testimonials = [
    {
      quote: "I've tried many fiber supplements over the years, but Total Essential is truly remarkable. It tastes amazing and has made a significant difference in my digestive health.",
      author: "Sarah Johnson",
      role: "Fitness Instructor",
      rating: 5
    },
    {
      quote: "Total Essential has become an essential part of my morning routine. I love how it gives me natural energy throughout the day without any crashes.",
      author: "Michael Chen",
      role: "Software Engineer",
      rating: 5
    },
    {
      quote: "As a nutritionist, I'm very particular about what I recommend to my clients. Total Essential is one of the few fiber supplements I genuinely endorse for its quality ingredients.",
      author: "Dr. Emily Rodriguez",
      role: "Clinical Nutritionist",
      rating: 5
    },
    {
      quote: "The Total Essentiel Plus has been a game-changer for my family. Even my kids love the taste, which makes getting their daily nutrients so much easier!",
      author: "Thomas Wright",
      role: "Parent of Three",
      rating: 4
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container px-4 md:px-6">
        <Heading
          title="What Our Customers Say"
          description="Join thousands of satisfied customers who have transformed their health with Total Essential."
          centered
          className="mb-12"
        />
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TestimonialCard
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                rating={testimonial.rating}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Trust badges section */}
        <div className="mt-16">
          <h3 className="text-center text-xl font-semibold mb-8">Trusted By Health Experts Worldwide</h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {/* These would normally be actual logos, using placeholders for now */}
            <div className="flex items-center justify-center h-12 w-32 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-2 font-medium">HealthDaily</span>
            </div>
            
            <div className="flex items-center justify-center h-12 w-32 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-2 font-medium">NutriNews</span>
            </div>
            
            <div className="flex items-center justify-center h-12 w-32 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-2 font-medium">MedPlus</span>
            </div>
            
            <div className="flex items-center justify-center h-12 w-32 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.75 13.5L14.25 2.25L12 10.5H20.25L9.75 21.75L12 13.5H3.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-2 font-medium">FitBoost</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
