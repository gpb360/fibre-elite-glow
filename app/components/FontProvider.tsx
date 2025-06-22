'use client'

import { useEffect } from 'react'

interface FontProviderProps {
  fontClassName: string
  children: React.ReactNode
}

/**
 * Alternative approach: Uses CSS custom properties to apply fonts
 * This approach is more performant as it doesn't require re-rendering
 * and avoids any potential layout shifts.
 */
export function FontProvider({ fontClassName, children }: FontProviderProps) {
  useEffect(() => {
    // Apply font class to document root after hydration
    if (typeof document !== 'undefined') {
      // Add the font class to the body
      document.body.classList.add(fontClassName)
      
      // Cleanup function to remove the class if component unmounts
      return () => {
        document.body.classList.remove(fontClassName)
      }
    }
  }, [fontClassName])

  return <>{children}</>
}

/**
 * CSS-in-JS approach using style injection
 * This is the most robust approach as it completely avoids DOM class manipulation
 */
export function FontStyleProvider({ fontFamily, children }: { fontFamily: string, children: React.ReactNode }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Inject font styles directly
      const style = document.createElement('style')
      style.textContent = `
        body {
          font-family: ${fontFamily};
        }
      `
      document.head.appendChild(style)
      
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [fontFamily])

  return <>{children}</>
}
