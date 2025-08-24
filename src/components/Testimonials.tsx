
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { Heading } from '@/components/ui/heading';

export function Testimonials() {
  const testimonials = [
    {
      quote: "I cannot believe how great Total Essential is working for me. (After some bad accidents and many broken bones, I was left severely constipated much of the time while healing) I endured 6 years of Dr’s prescriptions that did not work. Imagine the relief I am finally experiencing. Thank you!!!",
      author: "G Normandeau",
      role: "Nova Scotia",
      rating: 5,
    },
    {
      quote: "I absolutely love the 15 Day Detox Program. Every time I have completed the 15 days, my family usually makes a comment about how good I look and how clear my complexion is. This is just a bonus, because I started using Total Essential  to rid my body of toxins in a natural, safe way I must say, I notice a difference after the first day, so you can imagine how good I feel after 15 days! Thank you for all your help.",
      author: "J Lemay",
      role: "Kelowna BC",
      rating: 5,
    },
    {
      quote: "The Total Essential  15 Day Detox Program is simply wonderful. It tastes great, is easy to take and works as promised. I have been taking this cleanse at least twice per year and am pleased every time. I have more energy and feel healthier, thank you La Belle Vie!",
      author: "R Nunnikhoven",
      role: "Maple Ridge BC",
      rating: 5,
    },
    {
      quote: "I have been using the Total Essential  Detox program for about 2 years now. It has been life changing for me, I have troubles with my digestive system from working shift work as a nurse. After taking the Total Essential  detox I was able to be regular, gain extra energy and feel really great about myself. It also takes care of water retention and helped lose a few pounds, and totally cleared my skin. I now take the Total Essential  Detox every 6 months and feel absolutely great!! I have recommended it to my friends, co-workers and family!",
      author: "J Neels",
      role: "Chilliwack BC",
      rating: 5,
    },
    {
      quote: "I had always wanted to try a cleanse because I had heard of people getting such great results. My problem was I struggled with the strict diet many cleanses require you to stick to. At the women’s show in Calgary there was a booth for La Belle Vie cleanse products. After having a lengthy discussion with the lady running it, I decided to give it a try. I liked the fact that you didn’t have to alter your diet and that it was an all natural product. After the 15-days, I had never felt better! I didn’t crave fatty, greasy foods anymore, my stomach didn’t feel so bloated, and I just felt better overall. I recommend this product to everyone because I truly believe in it! I continue to do the cleanse on a regular basis with the same results!",
      author: "L Dunn",
      role: "Calgary AB",
      rating: 5,
    },
    {
      quote: "I looked into your product at a Spring Women’s show in Calgary. I have had serious constipation problems since 1998 with mild problems prior to that. As cleansing and fibre products are always what is recommended for all, and in particular for my particular concern…I have tried cleansing kits, clay products, every different type of fibre supplement, teas, colonics, enzymes, probiotic type products, senna products, lots of water and prescription products etc. some things helped only a little… but a lot of the fibre products would just pack the fibre in deeper into my intestines as I do not have good peristalsis in my gut. I have had serious bleeding, bloating, bulging belly, leaky gut…on and on. From the very first night I took your product, my intestines easily and effortlessly eliminated stool that I know has been buried deep. The size of the stool has gone from a very painful short straw width to a very effortless normal size stool. I and my intestines are very grateful. Thank you.",
      author: "C Yuzwak",
      role: "Calgary AB",
      rating: 5,
    },
    {
      quote: "I first started using the La Belle Vie Total Essential  and Total Vitality products in my mid-20’s, and within the 10 month, I lost 10 pounds (without other dieting efforts except consuming less carbohydrates at dinner time)! Since then I kept using the Total Essential  product, and occasionally the Total Vitality product, and I kept my weight off. I have been a chubby girl all my life and these were the only products that helped me lose the weight. As a migraine sufferer, I get headaches whenever I have bowel irregularity. The Total Essential  product has helped me to eliminate this problem and as a result, I have way less bowel-movement related headache attacks. I have since then recommended this product to a few of my friends that were around my age, and my dad, who is in his mid-70’s now, and all of them have seen significant improvement in their bowel problems. A few of my friends have also used Total Essential  and Total Vitality in combination, and they have also achieve satisfying weight loss results. I recommend the Total Essential  to anyone who would like to improve their regularity, and for those of you who need to loose a few extra pounds, try the Total Vitality product and you might be amazed at the results!",
      author: "M. Ho",
      role: "Richmond BC",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <Heading
          title="What Our Customers Say"
          description="Join thousands of satisfied customers who have transformed their health with Total Essential."
          centered
          className="mb-16"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
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
        <div className="mt-20">
          <h3 className="text-center text-2xl font-bold mb-10 text-gray-900">Trusted By Health Experts Worldwide</h3>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 hover:opacity-100 transition-opacity">
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
