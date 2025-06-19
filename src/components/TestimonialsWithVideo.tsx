import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { Heading } from '@/components/ui/heading';
import { VideoPlayer } from '@/components/ui/video-player';
import { Button } from '@/components/ui/button';
import { useMarketingVideos } from '@/hooks/useMarketingVideos';
import { Play, MessageSquare, Video } from 'lucide-react';

export function TestimonialsWithVideo() {
  const { testimonialsVideo } = useMarketingVideos();
  const [activeView, setActiveView] = useState<'written' | 'video'>('written');

  const testimonials = [
    {
      quote: "I cannot believe how great Total Essential is working for me. (After some bad accidents and many broken bones, I was left severely constipated much of the time while healing) I endured 6 years of Dr's prescriptions that did not work. Imagine the relief I am finally experiencing. Thank you!!!",
      author: "G Normandeau",
      role: "Nova Scotia",
      rating: 5,
    },
    {
      quote: "I have been using Total Essential for about 6 months now and I love it! It has helped me with my digestive issues and I feel so much better. The taste is great and it mixes well with water. I would definitely recommend this product to anyone looking for a natural way to improve their digestive health.",
      author: "Sarah M.",
      role: "Toronto, ON",
      rating: 5,
    },
    {
      quote: "Total Essential has been a game-changer for my family. We all take it daily and have noticed significant improvements in our energy levels and overall health. The convenience of the sachets makes it easy to take anywhere.",
      author: "Michael R.",
      role: "Vancouver, BC",
      rating: 5,
    },
    {
      quote: "As someone who travels frequently for work, Total Essential has been a lifesaver. It keeps my digestive system regular and I feel more energized throughout the day. The packaging is perfect for travel too!",
      author: "M. Ho",
      role: "Richmond BC",
      rating: 5,
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container px-4 md:px-6">
        <Heading
          title="What Our Customers Say"
          description="Join thousands of satisfied customers who have transformed their health with Total Essential."
          centered
          className="mb-8"
        />

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <Button
              variant={activeView === 'written' ? 'default' : 'ghost'}
              onClick={() => setActiveView('written')}
              className="rounded-md"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Written Reviews
            </Button>
            {testimonialsVideo && (
              <Button
                variant={activeView === 'video' ? 'default' : 'ghost'}
                onClick={() => setActiveView('video')}
                className="rounded-md"
              >
                <Video className="h-4 w-4 mr-2" />
                Video Testimonials
              </Button>
            )}
          </div>
        </div>

        {/* Written Testimonials */}
        {activeView === 'written' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
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
          </motion.div>
        )}

        {/* Video Testimonials */}
        {activeView === 'video' && testimonialsVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <VideoPlayer
                src={testimonialsVideo.src}
                poster={testimonialsVideo.poster}
                autoPlay={false}
                muted={false}
                showCustomControls={true}
                aspectRatio="video"
                className="w-full rounded-xl shadow-lg"
              />
              
              {/* Video Info */}
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {testimonialsVideo.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {testimonialsVideo.description || 'Hear directly from our satisfied customers about their experience with Total Essential'}
                </p>
                {testimonialsVideo.duration && (
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    Duration: {testimonialsVideo.duration}
                  </span>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => setActiveView('written')}
                className="mr-4"
              >
                Read More Reviews
              </Button>
              <Button variant="premium">
                Share Your Story
              </Button>
            </div>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          className="mt-16 grid gap-8 sm:grid-cols-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-gray-600">Would Recommend</div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-gray-500 mb-4">
            All testimonials are from verified customers
          </p>
          <div className="flex justify-center items-center space-x-6 text-gray-400">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Verified Reviews</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Privacy Protected</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Authentic Stories</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsWithVideo;
