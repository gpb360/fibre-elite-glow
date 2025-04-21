
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-12 md:pt-32 md:pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0fdf4_1px,transparent_1px),linear-gradient(to_bottom,#f0fdf4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-green-500 font-semibold">La Belle Vie</p>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Total Essential<span className="text-green-500">.</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Premium fiber drink with 15 days of fruit and vegetable essentials. 
                  Transform your health with each sip.
                </p>
              </motion.div>
            </div>
            <motion.div 
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="xl" variant="premium">
                Shop Now
              </Button>
              <Button size="xl" variant="outline">
                Learn More
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 text-green-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Non-GMO Ingredients</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 text-green-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Gluten Free</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 text-green-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>100% Natural</span>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="mx-auto flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              {/* Main product image */}
              <img
                alt="Total Essential Product Box"
                className="aspect-square rounded-xl object-cover object-center"
                src="public/lovable-uploads/c159fdf8-1fcc-418f-a95b-70543b77a5ae.png"
                width={600}
                height={600}
              />
              
              {/* Floating badge */}
              <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                <div className="text-center text-sm font-bold">
                  NEW
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
