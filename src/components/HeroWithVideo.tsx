"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { VideoPlayer } from '@/components/ui/video-player';
import { useMarketingVideos } from '@/hooks/useMarketingVideos';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export function HeroWithVideo() {
  const { heroVideo, loading } = useMarketingVideos();
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoToggle = () => {
    setShowVideo(!showVideo);
    if (!showVideo) {
      setIsPlaying(true);
    }
  };

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
              <Link
                href="/products/total-essential"
                className={cn(buttonVariants({ size: "xl", variant: "premium" }))}
              >
                Total Essential
              </Link>
              <Link
                href="/products/total-essential-plus"
                className={cn(buttonVariants({ size: "xl", variant: "premium2" }))}
              >
                Total Essential Plus
              </Link>
            </motion.div>

            {/* Video Control Button */}
            {heroVideo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  onClick={handleVideoToggle}
                  className="text-green-600 hover:text-green-700 p-0 h-auto"
                >
                  {showVideo ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Hide Video
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Watch Product Video
                    </>
                  )}
                </Button>
              </motion.div>
            )}
            
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
              {showVideo && heroVideo ? (
                <div className="relative">
                  <VideoPlayer
                    src={heroVideo.src}
                    poster={heroVideo.poster}
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    showCustomControls={true}
                    aspectRatio="square"
                    className="w-[600px] h-[600px] rounded-xl"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  
                  {/* Video Badge */}
                  <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                    <div className="text-center text-xs font-bold">
                      LIVE
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Main product image */}
                  <Image
                    alt="Total Essential Product Box - Click to play product video"
                    className="aspect-square rounded-xl object-cover object-center cursor-pointer hover:scale-105 transition-transform duration-300"
                    src="/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp"
                    width={600}
                    height={600}
                    onClick={handleVideoToggle}
                    priority
                  />
                  
                  {/* Play button overlay */}
                  {heroVideo && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      onClick={handleVideoToggle}
                    >
                      <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
                        <Play className="h-8 w-8 text-green-600 fill-green-600" />
                      </div>
                    </div>
                  )}
                  
                  {/* Floating badge */}
                  <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                    <div className="text-center text-sm font-bold">
                      NEW
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroWithVideo;
