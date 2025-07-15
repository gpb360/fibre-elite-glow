import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateBreadcrumbSchema } from '@/lib/seo'
import StructuredData from '@/components/seo/StructuredData'

export interface BreadcrumbItem {
  name: string
  url: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  const allItems = showHome 
    ? [{ name: 'Home', url: '/' }, ...items]
    : items

  const breadcrumbSchema = generateBreadcrumbSchema(allItems)

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className={cn('flex', className)}>
        <ol className="flex items-center space-x-2 text-sm">
          {allItems.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              )}
              
              {item.current ? (
                <span 
                  className="text-gray-500 cursor-default"
                  aria-current="page"
                >
                  {index === 0 && showHome ? (
                    <Home className="h-4 w-4" />
                  ) : (
                    item.name
                  )}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {index === 0 && showHome ? (
                    <Home className="h-4 w-4" />
                  ) : (
                    item.name
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

export default Breadcrumb