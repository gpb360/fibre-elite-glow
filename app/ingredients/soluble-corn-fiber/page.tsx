import SolubleCornFiber from '@/components/pages/ingredients/SolubleCornFiber'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Soluble Corn Fiber - Gentle Prebiotic Fiber',
  description: 'Learn how soluble corn fiber provides gentle prebiotic support for digestive health. Clinically shown to improve calcium absorption, bone health, and support beneficial gut bacteria growth.',
  keywords: 'soluble corn fiber, prebiotic, calcium absorption, bone health, digestive health, gentle fiber, gut bacteria',
  url: '/ingredients/soluble-corn-fiber',
})

export default function SolubleCornFiberPage() {
  return <SolubleCornFiber />
}
