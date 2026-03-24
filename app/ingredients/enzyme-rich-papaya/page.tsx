import EnzymeRichPapaya from '@/components/pages/ingredients/EnzymeRichPapaya'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Enzyme-Rich Papaya - Digestive Enzyme Support',
  description: 'Learn how papaya enzymes (papain) support protein digestion and reduce bloating. Rich in vitamins A, C, and E, papaya extract promotes natural digestive comfort and nutrient absorption.',
  keywords: 'papaya enzyme, papain, digestive enzymes, bloating relief, protein digestion, vitamin C, natural supplement ingredient',
  url: '/ingredients/enzyme-rich-papaya',
})

export default function EnzymeRichPapayaPage() {
  return <EnzymeRichPapaya />
}
