'use client';

import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Loading fallback component
const LoadingFallback = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-32 w-full mb-4"></div>
    <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
    <div className="bg-gray-200 rounded h-4 w-1/2"></div>
  </div>
);

// Enhanced lazy loading component with intersection observer
export function LazyComponent<T extends React.ComponentType<any>>({
  loader,
  fallback = <LoadingFallback />,
  rootMargin = '50px',
  threshold = 0.1,
}: {
  loader: () => Promise<{ default: T }>;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}) {
  const LazyComponent = lazy(loader);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
}

// Intersection Observer based lazy loader
export function IntersectionLazy({
  children,
  rootMargin = '100px',
  threshold = 0.1,
}: {
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      ) : (
        <LoadingFallback />
      )}
    </div>
  );
}

// Pre-defined lazy-loaded components for heavy pages
export const LazyBenefits = LazyComponent({
  loader: () => import('@/components/pages/Benefits'),
  rootMargin: '50px',
});

export const LazyTestimonials = LazyComponent({
  loader: () => import('@/components/ui/product-testimonials'),
  rootMargin: '100px',
});

// Ingredient pages lazy loader
export function LazyIngredientPage({ ingredientName }: { ingredientName: string }) {
  return LazyComponent({
    loader: () => import(`@/components/pages/ingredients/${ingredientName}`),
    rootMargin: '100px',
  });
}