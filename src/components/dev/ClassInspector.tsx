'use client'

import { useEffect, useState } from 'react'

interface ClassInspectorProps {
  children: React.ReactNode
  className?: string
  debugName?: string
  showInspector?: boolean
}

/**
 * Development component that wraps elements to show original Tailwind classes
 * Only renders inspection UI in development mode
 */
export function ClassInspector({ 
  children, 
  className = '', 
  debugName,
  showInspector = false 
}: ClassInspectorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const isDev = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (!isDev) return

    // Add global styles for class inspection
    const style = document.createElement('style')
    style.textContent = `
      .class-inspector-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        font-size: 12px;
        padding: 4px 8px;
        font-family: monospace;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      .class-inspector-container:hover .class-inspector-overlay {
        opacity: 1;
      }
      
      .class-inspector-container {
        position: relative;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [isDev])

  if (!isDev) {
    return <>{children}</>
  }

  const classArray = className.split(' ').filter(Boolean)

  return (
    <div 
      className={`class-inspector-container ${className}`}
      data-tw-classes={className}
      data-debug-name={debugName}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {(showInspector || isVisible) && className && (
        <div className="class-inspector-overlay">
          {debugName && <div style={{ fontWeight: 'bold' }}>{debugName}</div>}
          <div>Classes: {classArray.length}</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            {classArray.join(' • ')}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Simple wrapper for quick debugging
 */
export function DebugDiv({ 
  className, 
  children, 
  debugName,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { debugName?: string }) {
  if (process.env.NODE_ENV !== 'development') {
    return <div className={className} {...props}>{children}</div>
  }

  return (
    <ClassInspector className={className} debugName={debugName}>
      <div {...props}>{children}</div>
    </ClassInspector>
  )
}
