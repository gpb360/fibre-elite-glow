'use client'

import { useEffect, useRef } from 'react'
import { classInspector } from '@/utils/dev-class-inspector'

/**
 * Hook to debug Tailwind classes in development
 * Automatically adds data attributes and console logging for easier debugging
 */
export function useClassDebug<T extends HTMLElement = HTMLElement>(classes: string, debugName?: string) {
  const elementRef = useRef<T>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    
    const element = elementRef.current
    if (!element || !classes) return

    // Add debug attributes
    element.setAttribute('data-tw-classes', classes)
    if (debugName) {
      element.setAttribute('data-debug-name', debugName)
    }

    // Log to console
    classInspector.debugClasses(classes)

    // Add visual indicator in development
    if (debugName) {
      element.style.setProperty('--debug-name', `"${debugName}"`)
    }

  }, [classes, debugName])

  return elementRef
}

/**
 * Utility function to combine classes and add debugging
 */
export function debugClasses(classes: string, debugName?: string): string {
  if (process.env.NODE_ENV === 'development' && debugName) {
    console.log(`🎨 ${debugName}:`, classes)
  }
  return classes
}

/**
 * Enhanced className utility with debugging
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  const result = inputs.filter(Boolean).join(' ')
  
  if (process.env.NODE_ENV === 'development') {
    // Log complex class combinations
    if (inputs.length > 3) {
      console.log('🔧 Complex className combination:', {
        inputs,
        result
      })
    }
  }
  
  return result
}
