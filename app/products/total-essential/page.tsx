import ProductEssential from '@/components/pages/ProductEssential'
import { generateMetadata, generateProductSchema, generateOrganizationSchema } from '@/lib/seo'
import StructuredData from '@/components/seo/StructuredData'

export const metadata = generateMetadata({
  title: 'Total Essential | Premium Daily Fiber Blend',
  description: 'Total Essential: Premium daily fiber blend for digestive wellness and natural energy. Clean, gentle formula with prebiotic fiber for gut health. 15 sachets per box.',
  keywords: 'Total Essential, fiber supplement, daily fiber blend, prebiotic fiber, digestive health, gut health, natural energy, wellness supplement, premium supplement',
  image: '/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp',
  url: '/products/total-essential'
})

const productSchema = generateProductSchema({
  name: 'Total Essential',
  description: 'Premium daily fiber blend for digestive wellness and natural energy. Clean, gentle formula with prebiotic fiber for gut health. 15 sachets per box.',
  price: '74.99',
  currency: 'USD',
  sku: 'total-essential-base',
  gtin: 'FEG-TE-001',
  brand: 'Fibre Elite Glow',
  image: '/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp',
  rating: 4.8,
  reviewCount: 127,
  availability: 'InStock',
  url: '/products/total-essential',
  reviews: [
    {
      author: 'Sarah M.',
      rating: 5,
      body: 'Perfect daily fiber supplement. Gentle on my stomach and gives me natural energy throughout the day.'
    },
    {
      author: 'Michael R.',
      rating: 4,
      body: 'Great product, helped with my digestion. Mixes easily and has no taste.'
    }
  ],
  additionalProperties: [
    {
      name: 'Special Features',
      value: 'Clean, gentle formula with prebiotic fiber'
    },
    {
      name: 'Key Benefits',
      value: 'Digestive wellness and natural energy support'
    },
    {
      name: 'Serving Size',
      value: '15 sachets per box'
    },
    {
      name: 'Product Type',
      value: 'Daily wellness supplement'
    }
  ]
})

const organizationSchema = generateOrganizationSchema('Fibre Elite Glow')

export default function TotalEssentialPage() {
  return (
    <>
      <StructuredData data={[productSchema, organizationSchema]} />
      <ProductEssential />
    </>
  )
}
