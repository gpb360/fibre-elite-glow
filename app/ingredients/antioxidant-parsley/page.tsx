import AntioxidantParsley from '@/components/pages/ingredients/AntioxidantParsley'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Antioxidant Parsley Extract',
  description: 'Discover the powerful antioxidant properties of parsley extract in our fiber supplements. Rich in vitamins K, C, and A, parsley supports detoxification, immune health, and digestive wellness.',
  keywords: 'parsley extract, antioxidant, vitamin K, detoxification, digestive health, natural supplement ingredient',
  url: '/ingredients/antioxidant-parsley',
})

export default function AntioxidantParsleyPage() {
  return <AntioxidantParsley />
}
