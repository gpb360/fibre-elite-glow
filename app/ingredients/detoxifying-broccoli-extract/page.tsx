import DetoxifyingBroccoliExtract from '@/components/pages/ingredients/DetoxifyingBroccoliExtract'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Detoxifying Broccoli Extract - Cruciferous Superfood',
  description: 'Discover how broccoli extract supports natural detoxification and cellular protection. Packed with sulforaphane, vitamins C and K, and powerful antioxidants for whole-body wellness.',
  keywords: 'broccoli extract, sulforaphane, detoxification, cruciferous vegetables, antioxidant, cellular protection, natural supplement',
  url: '/ingredients/detoxifying-broccoli-extract',
})

export default function DetoxifyingBroccoliExtractPage() {
  return <DetoxifyingBroccoliExtract />
}
