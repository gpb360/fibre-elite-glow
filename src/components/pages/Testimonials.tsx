'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReviewSubmissionForm } from '@/components/ReviewSubmissionForm';
import { Star, Gift, Shield, Users, Award } from 'lucide-react';

interface Testimonial {
  id?: string;
  name: string;
  product: string;
  rating: number;
  review: string;
  verified: boolean;
  featured?: boolean;
  role?: string; // location — kept for fallback compatibility
}

// Fallback data when the database is unavailable
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    review: "I cannot believe how great Total Essential is working for me. After some bad accidents and many broken bones, I was left severely constipated much of the time while healing. I endured 6 years of Dr's prescriptions that did not work. Imagine the relief I am finally experiencing. Thank you!!!",
    name: "G Normandeau",
    role: "Nova Scotia",
    rating: 5,
    verified: true,
    product: "Total Essential"
  },
  {
    review: "I absolutely love the how total essential has changed my life. Every time I have completed the 15 days, my family usually makes a comment about how good I look and how clear my complexion is. This is just a bonus, because I started using Total Essential to rid my body of toxins in a natural, safe way. I must say, I notice a difference after the first day!",
    name: "J Lemay",
    role: "Kelowna BC",
    rating: 5,
    verified: true,
    product: "Total Essential"
  },
  {
    review: "The Total Essential Plus has been a game-changer for my digestive health. The additional probiotics and superfruits make such a difference. I've been using it for 8 months now and feel incredible every day!",
    name: "S Thompson",
    role: "Toronto ON",
    rating: 5,
    verified: true,
    product: "Total Essential Plus"
  },
  {
    review: "I have been using Total Essential for about 2 years now. It has been life changing for me. I have troubles with my digestive system from working shift work as a nurse. After taking Total Essential I was able to be regular, gain extra energy and feel really great about myself.",
    name: "J Neels",
    role: "Chilliwack BC",
    rating: 5,
    verified: true,
    product: "Total Essential"
  }
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch('/api/testimonials');
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        if (data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials.map((t: any) => ({
            id: t.id,
            name: t.name,
            product: t.product,
            rating: t.rating,
            review: t.review,
            verified: t.verified,
            featured: t.featured,
          })));
          setUsingFallback(false);
        } else {
          // No data from backend — use fallback
          setUsingFallback(true);
        }
      } catch (error) {
        console.warn('Could not load testimonials from backend, using fallback data');
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" id="main-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 to-white py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Heading
                title="Real Stories, Real Results"
                description="Discover how thousands of customers have transformed their health with Total Essential. Every review is verified and comes from actual customers."
                centered
                size="xl"
                className="mb-8"
              />

              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" aria-hidden="true" />
                  <span className="text-sm font-medium">10,000+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" aria-hidden="true" />
                  <span className="text-sm font-medium">4.8/5 Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  <span className="text-sm font-medium">100% Verified Reviews</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Discount Banner */}
        <section className="bg-gradient-to-r from-purple-600 to-green-600 text-white py-6">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="h-6 w-6" aria-hidden="true" />
                <span className="text-xl font-bold">Special Offer for Reviewers!</span>
              </div>
              <p className="text-lg">Leave a verified review and get 15% off your next order with code: <span className="font-bold bg-white text-purple-600 px-2 py-1 rounded">REVIEW15</span></p>
              <p className="text-sm mt-1 opacity-90">Valid only for verified customers • Honest reviews help us serve you better</p>
            </motion.div>
          </div>
        </section>

        {/* Written Testimonials */}
        <section className="py-16" aria-label="Customer reviews">
          <div className="container px-4 md:px-6">
            <Heading
              title="Customer Reviews"
              description="Read what our customers are saying about their experience"
              centered
              className="mb-12"
            />

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <Card className="h-64">
                      <CardContent className="p-6 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="mt-auto flex items-center gap-2">
                          <div className="h-8 w-8 bg-gray-200 rounded-full" />
                          <div className="h-4 bg-gray-200 rounded w-24" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <TestimonialCard
                        quote={testimonial.review}
                        author={testimonial.name}
                        role={testimonial.role || ''}
                        rating={testimonial.rating}
                        className="h-full"
                      />
                      {testimonial.verified && (
                        <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                          <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
                          Verified
                        </Badge>
                      )}
                      <Badge className="absolute bottom-2 right-2 bg-purple-600 text-white">
                        {testimonial.product}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Review Form */}
        <section className="py-16 bg-gradient-to-b from-green-50 to-white" aria-label="Submit a review">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heading
                title="Share Your Story"
                description="Help others discover the benefits of Total Essential by sharing your honest experience"
                centered
                className="mb-8"
              />

              <ReviewSubmissionForm />
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 bg-gray-50" aria-label="Why we verify reviews">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Why We Verify Every Review</h3>
              <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" aria-hidden="true" />
                  <h4 className="font-semibold mb-2">Authentic Feedback</h4>
                  <p className="text-sm text-gray-600">Only real customers can leave reviews, ensuring authentic experiences</p>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 text-purple-600 mx-auto mb-3" aria-hidden="true" />
                  <h4 className="font-semibold mb-2">Quality Improvement</h4>
                  <p className="text-sm text-gray-600">Honest feedback helps us continuously improve our products</p>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" aria-hidden="true" />
                  <h4 className="font-semibold mb-2">Trust & Transparency</h4>
                  <p className="text-sm text-gray-600">Building trust through verified, transparent customer experiences</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;
