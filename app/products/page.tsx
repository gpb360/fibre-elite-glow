import ProductsPage from '@/components/pages/Products'
import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Premium Fiber Supplements Collection',
  description: 'Compare and shop our premium fiber supplement collection. Total Essential for daily maintenance and Total Essential Plus with enhanced superfruits and antioxidants. 100% natural, non-GMO, gluten-free.',
  keywords: 'fiber supplements, Total Essential, Total Essential Plus, natural supplements, digestive health, premium fiber, Canadian supplements',
  url: '/products',
})

export default function ProductsPageWrapper() {
  return <ProductsPage />
}
