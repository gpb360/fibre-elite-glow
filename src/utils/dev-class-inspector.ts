'use client'

/**
 * Development utility to help inspect Tailwind classes
 * Only works in development mode
 */

interface ClassInspectorOptions {
  showInConsole?: boolean
  addDataAttributes?: boolean
}

export class TailwindClassInspector {
  private static instance: TailwindClassInspector
  private isEnabled: boolean = process.env.NODE_ENV === 'development'

  static getInstance(): TailwindClassInspector {
    if (!TailwindClassInspector.instance) {
      TailwindClassInspector.instance = new TailwindClassInspector()
    }
    return TailwindClassInspector.instance
  }

  /**
   * Add original class names as data attributes for easier debugging
   */
  inspectElement(element: HTMLElement, originalClasses: string): void {
    if (!this.isEnabled) return

    // Add original classes as data attribute
    element.setAttribute('data-tw-classes', originalClasses)
    
    // Add to console for debugging
    console.log('Element classes:', {
      element,
      originalClasses,
      computedStyles: window.getComputedStyle(element)
    })
  }

  /**
   * Hook to automatically add class inspection to elements
   */
  enableAutoInspection(): void {
    if (!this.isEnabled || typeof window === 'undefined') return

    // Observer to watch for new elements with class attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const element = mutation.target as HTMLElement
          const classes = element.className
          if (classes && classes.includes('bg-') || classes.includes('text-') || classes.includes('p-')) {
            this.inspectElement(element, classes)
          }
        }
      })
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true
    })
  }

  /**
   * Utility to find elements by Tailwind class patterns
   */
  findElementsByTailwindPattern(pattern: string): HTMLElement[] {
    if (!this.isEnabled || typeof window === 'undefined') return []

    const elements = Array.from(document.querySelectorAll('*')) as HTMLElement[]
    return elements.filter(el => 
      el.className && el.className.includes(pattern)
    )
  }

  /**
   * Debug specific Tailwind classes
   */
  debugClasses(classes: string): void {
    if (!this.isEnabled) return

    console.group(`🎨 Tailwind Classes Debug: ${classes}`)
    
    const classArray = classes.split(' ').filter(Boolean)
    classArray.forEach(cls => {
      console.log(`📝 ${cls}:`, this.getClassInfo(cls))
    })
    
    console.groupEnd()
  }

  private getClassInfo(className: string): object {
    // Basic Tailwind class pattern recognition
    const patterns = {
      spacing: /^(p|m|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr)-/,
      colors: /^(bg|text|border)-/,
      layout: /^(flex|grid|block|inline|hidden)/,
      sizing: /^(w|h|min-w|min-h|max-w|max-h)-/,
      responsive: /^(sm|md|lg|xl|2xl):/
    }

    const info: any = { className }

    Object.entries(patterns).forEach(([category, pattern]) => {
      if (pattern.test(className)) {
        info.category = category
      }
    })

    return info
  }
}

// Export singleton instance
export const classInspector = TailwindClassInspector.getInstance()

// Auto-enable in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  classInspector.enableAutoInspection()
}
