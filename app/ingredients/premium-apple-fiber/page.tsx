import PremiumAppleFiber from '@/components/pages/ingredients/PremiumAppleFiber'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Premium Apple Fiber | Canadian Soluble & Insoluble Fiber for Digestive Health',
  description: 'Premium Canadian apple fiber with perfect balance of soluble and insoluble fiber for digestive wellness, cholesterol support, and blood sugar regulation.',
  keywords: 'premium apple fiber, Canadian apple fiber, soluble fiber, insoluble fiber, digestive health, pectin, cholesterol support, blood sugar regulation',
  image: '/assets/webp/16x9_apple_fibre.webp',
  url: '/ingredients/premium-apple-fiber'
})

export default function PremiumAppleFiberPage() {
  return <PremiumAppleFiber />
}
