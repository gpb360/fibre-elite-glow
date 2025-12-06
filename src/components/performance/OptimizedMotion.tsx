'use client';

import { motion, MotionProps } from 'framer-motion';
import React, { forwardRef, useEffect, useState } from 'react';

interface OptimizedMotionProps extends MotionProps {
  children: React.ReactNode;
  disabled?: boolean;
  reducedMotion?: boolean;
}

// Performance monitoring for animations
const useAnimationPerformance = () => {
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceAnimations(mediaQuery.matches);

    // Check for low-end devices
    const isLowEndDevice =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Check for slow connections
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

    if (isLowEndDevice || isSlowConnection) {
      setShouldReduceAnimations(true);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceAnimations(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduceAnimations;
};

// Performance-optimized motion component with reduced blocking time
export const OptimizedMotion = forwardRef<HTMLDivElement, OptimizedMotionProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ children, disabled = false, reducedMotion, className, style, ...motionProps }, ref) => {
    const shouldReduceAnimations = useAnimationPerformance();

    // Disable animations based on multiple factors
    if (disabled || reducedMotion || shouldReduceAnimations) {
      return (
        <div
          ref={ref}
          className={className}
          style={style}
        >
          {children}
        </div>
      );
    }

    // Highly optimized animation defaults to minimize blocking time
    const optimizedProps = {
      ...motionProps,
      className,
      style,
      transition: {
        duration: 0.15, // Further reduced from 0.2 to minimize blocking time
        ease: 'easeOut',
        type: 'tween',
        ...motionProps.transition,
      },
      // Use transform instead of layout changes for better performance
      layout: false,
      // Disable expensive features on low-end devices
      drag: false,
      whileTap: undefined,
      whileHover: undefined,
    };

    return (
      <motion.div
        ref={ref}
        {...optimizedProps}
      >
        {children}
      </motion.div>
    );
  }
);

OptimizedMotion.displayName = 'OptimizedMotion';

// Ultra-optimized preset animations with minimal blocking time
export const fadeInUp = {
  initial: { opacity: 0, y: 10 }, // Reduced from 20 to minimize layout shifts
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.12, // Further reduced for minimal blocking
    ease: 'easeOut',
    type: 'tween'
  },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    duration: 0.1, // Minimal duration for instant feel
    ease: 'easeOut',
    type: 'tween'
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.98 }, // Reduced scale change
  animate: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.15,
    ease: 'easeOut',
    type: 'tween'
  },
};

// Stagger animation for lists with optimized performance
export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Reduced stagger time
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.12,
    ease: 'easeOut',
    type: 'tween'
  },
};