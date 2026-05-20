import Testimonials from '@/components/pages/Testimonials'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Customer Reviews & Success Stories',
  description: 'Read real customer testimonials and success stories about our premium fiber supplements. Discover how Total Essential has transformed digestive health and wellness for thousands of Canadians.',
  keywords: 'fiber supplement reviews, customer testimonials, success stories, digestive health results, Total Essential reviews, wellness transformation, verified reviews',
  url: '/testimonials',
})

export default function TestimonialsPage() {
  return <Testimonials />
}
