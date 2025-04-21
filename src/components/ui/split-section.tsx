
import React from 'react';
import { cn } from '@/lib/utils';

interface SplitSectionProps {
  className?: string;
  reverse?: boolean;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function SplitSection({
  className,
  reverse = false,
  image,
  imageAlt,
  title,
  description,
  children,
}: SplitSectionProps) {
  return (
    <div className={cn("py-12 md:py-24", className)}>
      <div className="container px-4 md:px-6">
        <div className={cn(
          "grid items-center gap-6 lg:grid-cols-2 lg:gap-12",
          reverse ? "lg:grid-flow-dense" : ""
        )}>
          <div className={cn(
            "flex flex-col justify-center space-y-4",
            reverse ? "lg:order-last" : ""
          )}>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
              <p className="max-w-[600px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {description}
              </p>
            </div>
            {children}
          </div>
          <div className={cn(
            "mx-auto flex items-center justify-center",
            reverse ? "lg:order-first" : ""
          )}>
            <img
              alt={imageAlt}
              className="aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
              src={image}
              width={550}
              height={550}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
