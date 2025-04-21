
import React from 'react';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  className?: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

export function TestimonialCard({
  className,
  quote,
  author,
  role,
  avatar,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Rating stars */}
      {rating > 0 && (
        <div className="mb-4 flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={cn(
                "h-5 w-5",
                i < rating ? "text-yellow-400" : "text-gray-200"
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Quote content */}
      <p className="mb-4 text-gray-700">{quote}</p>

      {/* Author info */}
      <div className="flex items-center">
        {avatar && (
          <img
            src={avatar}
            alt={author}
            className="mr-4 h-12 w-12 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          {role && <p className="text-sm text-gray-500">{role}</p>}
        </div>
      </div>
    </div>
  );
}
