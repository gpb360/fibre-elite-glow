import ProductEssentialPlus from '@/components/pages/ProductEssentialPlus'
import { generateMetadata, generateProductSchema, generateOrganizationSchema } from '@/lib/seo'
import StructuredData from '@/components/seo/StructuredData'

export const metadata = generateMetadata({
  title: 'Total Essential Plus | Advanced Fiber with Super-Fruits',
  description: 'Total Essential Plus: Advanced daily fiber blend enhanced with super-fruits for added antioxidants and vibrant glow. Premium digestive wellness with berry power. 15 sachets per box.',
  keywords: 'Total Essential Plus, advanced fiber supplement, super-fruits, antioxidants, berry fiber, digestive health, gut health, premium supplement, acai, goji, cranberry',
  image: '/lovable-uploads/webp/total-essential-plus-fiber-supplement-bottle.webp',
  url: '/products/total-essential-plus'
})

const productSchema = generateProductSchema({
  name: 'Total Essential Plus',
  description: 'Advanced daily fiber blend enhanced with super-fruits for added antioxidants and a vibrant glow. Premium digestive wellness with berry power. 15 sachets per box.',
  price: '84.99',
  currency: 'USD',
  sku: 'total-essential-plus-base',
  gtin: 'FEG-TEP-001',
  brand: 'La Belle Vie',
  image: '/lovable-uploads/webp/total-essential-plus-fiber-supplement-bottle.webp',
  rating: 4.9,
  reviewCount: 89,
  availability: 'InStock',
  url: '/products/total-essential-plus',
  reviews: [
    {
      author: 'Jennifer K.',
      rating: 5,
      body: 'Love the berry flavors! Not only improved my digestion but I feel more energized. The antioxidants are a great bonus.'
    }
  ],
  additionalProperties: [
    {
      name: 'Special Features',
      value: 'Enhanced with super-fruits (Acai, Goji Berry, Cranberry)'
    },
    {
      name: 'Antioxidant Content',
      value: 'High antioxidant content from berry extracts'
    },
    {
      name: 'Serving Size',
      value: '15 sachets per box'
    },
    {
      name: 'Product Type',
      value: 'Advanced wellness supplement'
    }
  ]
})

const organizationSchema = generateOrganizationSchema('La Belle Vie')

export default function TotalEssentialPlusPage() {
  return (
    <>
      <StructuredData data={[productSchema, organizationSchema]} />
      <ProductEssentialPlus />
    </>
  )
}
