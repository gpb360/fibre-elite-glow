import SustainablePalmFiber from '@/components/pages/ingredients/SustainablePalmFiber'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Sustainable Palm Fiber - Eco-Friendly Fiber Source',
  description: 'Explore our sustainably sourced palm trunk fiber. Derived from naturally fallen palm trees, this eco-friendly fiber provides excellent digestive support and promotes environmental responsibility.',
  keywords: 'palm fiber, sustainable fiber, eco-friendly, digestive support, insoluble fiber, environmental sustainability, natural supplement',
  url: '/ingredients/sustainable-palm-fiber',
})

export default function SustainablePalmFiberPage() {
  return <SustainablePalmFiber />
}
