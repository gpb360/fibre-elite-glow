
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { Loader2, Check } from 'lucide-react';

interface ProductCardProps {
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
}

export function ProductCard({
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
}: ProductCardProps) {
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
    <div className={cn(
      "group relative overflow-hidden rounded-xl border shadow-premium hover-lift",
      variant === 'green' ? "border-green-200 hover:shadow-glow-green" : "border-purple-200 hover:shadow-glow-purple",
      "bg-white transition-all duration-300 hover:shadow-premium-lg",
      className
    )}>
      {badge && (
        <div className={cn(
          "absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-medium text-white",
          variant === 'green' ? "bg-green-500" : "bg-purple-500"
        )}>
          {badge}
        </div>
      )}
      <div className="aspect-square overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold">{price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
            )}
          </div>
          <Button
            variant={variant === 'green' ? 'premium' : 'premium2'}
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding || isLoading}
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
      </div>
    </div>
  );
}
