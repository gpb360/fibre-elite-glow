
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heading } from '@/components/ui/heading';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Star, Gift, Shield, Users, Award } from 'lucide-react';

const Testimonials = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    product: '',
    rating: 5,
    review: ''
  });

  const testimonials = [
    {
      quote: "I cannot believe how great Total Essential is working for me. After some bad accidents and many broken bones, I was left severely constipated much of the time while healing. I endured 6 years of Dr's prescriptions that did not work. Imagine the relief I am finally experiencing. Thank you!!!",
      author: "G Normandeau",
      role: "Nova Scotia",
      rating: 5,
      verified: true,
      product: "Total Essential"
    },
    {
      quote: "I absolutely love the 15 Day Detox Program. Every time I have completed the 15 days, my family usually makes a comment about how good I look and how clear my complexion is. This is just a bonus, because I started using Total Essential to rid my body of toxins in a natural, safe way. I must say, I notice a difference after the first day!",
      author: "J Lemay",
      role: "Kelowna BC",
      rating: 5,
      verified: true,
      product: "Total Essential"
    },
    {
      quote: "The Total Essential Plus has been a game-changer for my digestive health. The additional probiotics and superfruits make such a difference. I've been using it for 8 months now and feel incredible every day!",
      author: "S Thompson",
      role: "Toronto ON",
      rating: 5,
      verified: true,
      product: "Total Essential Plus"
    },
    {
      quote: "I have been using Total Essential for about 2 years now. It has been life changing for me. I have troubles with my digestive system from working shift work as a nurse. After taking Total Essential I was able to be regular, gain extra energy and feel really great about myself.",
      author: "J Neels",
      role: "Chilliwack BC",
      rating: 5,
      verified: true,
      product: "Total Essential"
    }
  ];

  const videoTestimonials = [
    {
      id: 1,
      title: "Sarah's 30-Day Transformation",
      thumbnail: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400",
      duration: "2:45",
      product: "Total Essential Plus"
    },
    {
      id: 2,
      title: "Mark's Digestive Health Journey",
      thumbnail: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400",
      duration: "3:12",
      product: "Total Essential"
    },
    {
      id: 3,
      title: "Family Health Success Story",
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      duration: "4:30",
      product: "Total Essential Plus"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Review submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
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
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">10,000+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">4.8/5 Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
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
                <Gift className="h-6 w-6" />
                <span className="text-xl font-bold">Special Offer for Reviewers!</span>
              </div>
              <p className="text-lg">Leave a verified review and get 15% off your next order with code: <span className="font-bold bg-white text-purple-600 px-2 py-1 rounded">REVIEW15</span></p>
              <p className="text-sm mt-1 opacity-90">Valid only for verified customers • Honest reviews help us serve you better</p>
            </motion.div>
          </div>
        </section>

        {/* Video Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <Heading
              title="Customer Video Stories"
              description="Watch real customers share their transformation stories"
              centered
              className="mb-12"
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videoTestimonials.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                        <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                          <Video className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                        {video.duration}
                      </Badge>
                      <Badge className="absolute bottom-2 left-2 bg-green-600">
                        {video.product}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{video.title}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Written Testimonials */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <Heading
              title="Customer Reviews"
              description="Read what our customers are saying about their experience"
              centered
              className="mb-12"
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative">
                    <TestimonialCard
                      quote={testimonial.quote}
                      author={testimonial.author}
                      role={testimonial.role}
                      rating={testimonial.rating}
                      className="h-full"
                    />
                    {testimonial.verified && (
                      <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
                      {testimonial.product}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Review Form */}
        <section className="py-16 bg-gradient-to-b from-green-50 to-white">
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Leave a Verified Review
                  </CardTitle>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Shield className="h-4 w-4 inline mr-1" />
                      <strong>Verification Process:</strong> Reviews are only accepted from verified customers. 
                      We require honest, truthful feedback to help us improve and provide you with the premium quality you deserve.
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your email address"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Product Used</label>
                      <select
                        name="product"
                        value={formData.product}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Product</option>
                        <option value="Total Essential">Total Essential</option>
                        <option value="Total Essential Plus">Total Essential Plus</option>
                        <option value="Both Products">Both Products</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                            className={`p-1 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            <Star className="h-6 w-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Your Review</label>
                      <textarea
                        name="review"
                        value={formData.review}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        placeholder="Share your honest experience with our products..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      Submit Review & Get 15% Off
                    </Button>

                    <p className="text-xs text-gray-600 text-center">
                      By submitting this review, you confirm that you are a verified customer and that your review is honest and truthful.
                      Discount code will be sent to your email after verification.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Why We Verify Every Review</h3>
              <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Authentic Feedback</h4>
                  <p className="text-sm text-gray-600">Only real customers can leave reviews, ensuring authentic experiences</p>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Quality Improvement</h4>
                  <p className="text-sm text-gray-600">Honest feedback helps us continuously improve our products</p>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
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
