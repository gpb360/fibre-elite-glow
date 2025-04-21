
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  className?: string;
  image: string;
  title: string;
  price: string;
  description: string;
  variant: 'green' | 'purple';
  badge?: string;
}

export function ProductCard({
  className,
  image,
  title,
  price,
  description,
  variant = 'green',
  badge,
}: ProductCardProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border",
      variant === 'green' ? "border-green-200" : "border-purple-200",
      "bg-white transition-all hover:shadow-lg",
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
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">{price}</span>
          <Button 
            variant={variant === 'green' ? 'premium' : 'premium2'} 
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
