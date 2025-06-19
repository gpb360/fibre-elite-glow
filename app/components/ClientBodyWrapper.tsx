'use client'

import { useEffect, useState } from 'react'

interface ClientBodyWrapperProps {
  fontClassName: string
  children: React.ReactNode
}

/**
 * Client-side wrapper that applies font classes after hydration
 * to prevent hydration mismatches caused by browser extensions
 * modifying the DOM before React hydrates.
 */
export function ClientBodyWrapper({ fontClassName, children }: ClientBodyWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Apply font class to body after hydration
    if (typeof document !== 'undefined') {
      document.body.className = fontClassName
    }
  }, [fontClassName])

  // During SSR and initial hydration, render without font class
  // to match server-rendered HTML
  if (!mounted) {
    return <>{children}</>
  }

  // After hydration, render normally
  return <>{children}</>
}
