import AppleFiber from '@/components/pages/ingredients/AppleFiber'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Apple Fiber - Natural Soluble Fiber Source',
  description: 'Learn how apple fiber provides natural soluble and insoluble fiber for improved digestion. Rich in pectin, apple fiber supports gut health, cholesterol management, and blood sugar balance.',
  keywords: 'apple fiber, pectin, soluble fiber, digestive health, cholesterol, blood sugar, natural fiber supplement',
  url: '/ingredients/apple-fiber',
})

export default function AppleFiberPage() {
  return <AppleFiber />
}
