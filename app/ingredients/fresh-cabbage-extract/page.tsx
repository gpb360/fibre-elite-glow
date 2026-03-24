import FreshCabbageExtract from '@/components/pages/ingredients/FreshCabbageExtract'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Fresh Cabbage Extract - Gut-Healing Superfood',
  description: 'Explore the gut-healing properties of fresh cabbage extract. Rich in vitamin U (S-methylmethionine), cabbage supports stomach lining repair, digestive comfort, and anti-inflammatory wellness.',
  keywords: 'cabbage extract, vitamin U, gut healing, stomach lining, anti-inflammatory, digestive health, cruciferous vegetable',
  url: '/ingredients/fresh-cabbage-extract',
})

export default function FreshCabbageExtractPage() {
  return <FreshCabbageExtract />
}
