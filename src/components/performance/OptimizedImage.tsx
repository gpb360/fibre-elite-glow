import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { ImageIcon, AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  fill?: boolean
  sizes?: string
  quality?: number
  fallbackSrc?: string
  showRetry?: boolean
  onError?: (error: Event) => void
  onLoad?: () => void
  lazy?: boolean
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait'
  placeholder?: 'blur' | 'empty'
  retryCount?: number
  loadingClassName?: string
  errorClassName?: string
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  fallbackSrc = '/assets/placeholders/image-placeholder.svg',
  showRetry = true,
  onError,
  onLoad,
  lazy = true,
  aspectRatio,
  placeholder = 'blur',
  retryCount = 2,
  loadingClassName = '',
  errorClassName = ''
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [attempts, setAttempts] = useState(0)
  const [isInView, setIsInView] = useState(!lazy || priority)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, priority, isInView])

  // Auto-retry logic
  useEffect(() => {
    if (hasError && attempts < retryCount) {
      const timer = setTimeout(() => {
        setHasError(false)
        setIsLoading(true)
        setAttempts(prev => prev + 1)
      }, 1000 * Math.pow(2, attempts)) // Exponential backoff

      return () => clearTimeout(timer)
    }
  }, [hasError, attempts, retryCount])

  const handleLoadComplete = () => {
    setIsLoading(false)
    setAttempts(0)
    onLoad?.()
  }

  const handleError = (error: any) => {
    setIsLoading(false)
    
    // Try fallback image first
    if (currentSrc !== fallbackSrc && attempts === 0) {
      setCurrentSrc(fallbackSrc)
      setAttempts(1)
      return
    }
    
    setHasError(true)
    onError?.(error)
  }

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    setCurrentSrc(src)
    setAttempts(0)
  }

  const getAspectRatioClasses = () => {
    if (fill) return ''
    
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'video':
        return 'aspect-video'
      case 'wide':
        return 'aspect-[3/1]'
      case 'portrait':
        return 'aspect-[3/4]'
      default:
        return ''
    }
  }

  // Error state with retry option
  if (hasError && attempts >= retryCount) {
    return (
      <div 
        ref={imgRef}
        className={cn(
          'flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-gray-500',
          getAspectRatioClasses(),
          errorClassName,
          className
        )}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height 
        }}
      >
        <AlertTriangle className="h-8 w-8 mb-2 text-gray-400" />
        <span className="text-sm text-center px-2">
          {alt || 'Image not available'}
        </span>
        {showRetry && (
          <button
            onClick={handleRetry}
            className="mt-2 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors flex items-center gap-1"
            aria-label="Retry loading image"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        )}
      </div>
    )
  }

  // Loading placeholder
  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={cn(
          'flex items-center justify-center bg-gray-100 animate-pulse',
          getAspectRatioClasses(),
          loadingClassName,
          className
        )}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height 
        }}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  return (
    <div 
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        getAspectRatioClasses(),
        isLoading && 'animate-pulse bg-gray-200',
        className
      )}
    >
      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          fill ? 'object-cover' : ''
        )}
        onLoad={handleLoadComplete}
        onError={handleError}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        data-testid="optimized-image"
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      
      {/* Retry indicator for auto-retries */}
      {hasError && attempts < retryCount && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-6 w-6 text-blue-500 animate-spin mb-2" />
            <span className="text-xs text-gray-600">Retrying...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Generate a blur data URL for placeholders
function generateBlurDataURL(width = 8, height = 8): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) {
    // Server-side fallback
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
  }
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  canvas.width = width
  canvas.height = height
  
  // Create a simple gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(1, '#e5e7eb')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL('image/jpeg', 0.1)
}