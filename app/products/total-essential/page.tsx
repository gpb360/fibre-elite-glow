import ProductEssential from '@/components/pages/ProductEssential'
import { generateMetadata, generateProductSchema } from '@/lib/seo'
import StructuredData from '@/components/seo/StructuredData'

export const metadata = generateMetadata({
  title: 'Total Essential | Premium Daily Fiber Blend',
  description: 'Total Essential: Premium daily fiber blend crafted from 100% fruit & vegetable fibers for gentle, natural digestive health. 15 sachets per box. Best seller with proven results.',
  keywords: 'Total Essential, fiber supplement, daily fiber blend, fruit fiber, vegetable fiber, digestive health, gut health, natural fiber, premium supplement',
  image: '/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png',
  url: '/products/total-essential'
})

const productSchema = generateProductSchema({
  name: 'Total Essential',
  description: 'Premium daily fiber blend crafted from 100% fruit & vegetable fibers for gentle, natural regularity. 15 sachets per box.',
  price: '79.99',
  sku: 'total-essential-base',
  image: '/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png',
  rating: 4.8,
  reviewCount: 156,
  url: '/products/total-essential'
})

export default function TotalEssentialPage() {
  return (
    <>
      <StructuredData data={productSchema} />
      <ProductEssential />
    </>
  )
}
