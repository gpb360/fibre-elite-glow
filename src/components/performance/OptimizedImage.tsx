'use client';

import Image from 'next/image';
import { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  unoptimized?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    fill = false,
    className = '',
    priority = false,
    quality = 75,
    placeholder = 'empty',
    blurDataURL,
    loading = 'lazy',
    sizes,
    unoptimized = false,
    onLoad,
    onError,
    style,
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      setError(true);
      setIsLoading(false);
      onError?.();
    };

    // Generate blur data URL if not provided and placeholder is blur
    const generateBlurDataURL = (width: number, height: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, width, height);
        return canvas.toDataURL();
      }
      return '';
    };

    const imageProps = {
      src,
      alt,
      width,
      height,
      fill,
      className: cn(
        'transition-opacity duration-300',
        isLoading ? 'opacity-0' : 'opacity-100',
        error ? 'hidden' : '',
        className
      ),
      priority,
      quality: priority ? 90 : quality,
      placeholder: placeholder === 'blur' && !blurDataURL && width && height
        ? 'blur'
        : placeholder,
      blurDataURL: blurDataURL || (placeholder === 'blur' && width && height
        ? generateBlurDataURL(width, height)
        : undefined),
      loading: priority ? 'eager' : loading,
      sizes,
      unoptimized,
      onLoad: handleLoad,
      onError: handleError,
      style,
      ...props,
    };

    if (error) {
      return (
        <div
          className={cn(
            'flex items-center justify-center bg-gray-100 text-gray-400',
            className
          )}
          style={style}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      );
    }

    // Loading placeholder
    const loadingPlaceholder = (
      <div
        className={cn(
          'absolute inset-0 bg-gray-100 animate-pulse',
          !isLoading && 'hidden',
          className
        )}
        style={style}
      />
    );

    return (
      <div className="relative" ref={ref}>
        {isLoading && loadingPlaceholder}
        <Image
          ref={ref}
          {...imageProps}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;