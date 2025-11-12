'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { Loader2, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedProductCardProps {
  className?: string;
  image: string;
  title: string;
  price: string;
  description: string;
  variant: 'green' | 'purple';
  badge?: string;
  productId: string;
  productType: 'total_essential' | 'total_essential_plus';
  originalPrice?: string;
  savings?: number;
  priority?: boolean;
  features?: string[];
  rating?: number;
  reviewCount?: number;
}

export function EnhancedProductCard({
  className,
  image,
  title,
  price,
  description,
  variant = 'green',
  badge,
  productId,
  productType,
  originalPrice,
  savings,
  priority = false,
  features = [],
  rating = 4.9,
  reviewCount = 247,
}: EnhancedProductCardProps) {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      await addToCart({
        id: productId,
        productName: title,
        productType,
        price: parseFloat(price.replace('$', '')),
        originalPrice: originalPrice ? parseFloat(originalPrice.replace('$', '')) : undefined,
        savings,
        image,
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl border shadow-premium hover-lift",
        variant === 'green' ? "border-green-200 hover:shadow-glow-green" : "border-purple-200 hover:shadow-glow-purple",
        "bg-white transition-all duration-300 hover:shadow-premium-lg",
        className
      )}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {badge && (
        <div className={cn(
          "absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-medium text-white shadow-md",
          variant === 'green' ? "bg-green-500" : "bg-purple-500"
        )}>
          {badge}
        </div>
      )}

      <div className="aspect-square overflow-hidden relative">
        <Image
          src={image}
          alt={`${title} - ${description} - La Belle Vie Canadian Premium Fiber Supplement - Available Canada-wide`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{rating}</span>
              <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        {features.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <div className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center mr-2",
                    variant === 'green' ? "bg-green-100" : "bg-purple-100"
                  )}>
                    <Check className={cn(
                      "w-3 h-3",
                      variant === 'green' ? "text-green-600" : "text-purple-600"
                    )} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{price}</span>
              {savings && (
                <span className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-full",
                  variant === 'green' ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                )}>
                  Save ${savings}
                </span>
              )}
            </div>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
            )}
          </div>
          <Button
            variant={variant === 'green' ? 'premium' : 'premium2'}
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding || isLoading}
            className="min-w-[120px]"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Adding...
              </>
            ) : justAdded ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Added!
              </>
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            asChild
          >
            <a href={`/products/${productType}`}>
              View Details
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}