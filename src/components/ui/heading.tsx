
import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  descriptionClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Heading({
  title,
  description,
  centered = false,
  className,
  descriptionClassName,
  as = 'h2',
  size = 'lg',
}: HeadingProps) {
  const sizeClasses = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl lg:text-6xl',
  };

  const Component = as;

  return (
    <div className={cn(
      "space-y-2",
      centered && "text-center",
      className
    )}>
      <Component className={cn(
        "font-bold tracking-tight text-gray-900",
        sizeClasses[size]
      )}>
        {title}
      </Component>
      {description && (
        <p className={cn(
          "text-gray-600 max-w-3xl",
          centered && "mx-auto",
          size === 'lg' && "text-lg",
          size === 'xl' && "text-xl",
          descriptionClassName
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
