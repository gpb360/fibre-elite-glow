import Testimonials from '@/components/pages/Testimonials'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Reviews & Success Stories | Fiber Supplements',
  description: 'Read real customer testimonials and success stories about our premium fiber supplements. Discover how Total Essential has transformed digestive health and wellness.',
  keywords: 'fiber supplement reviews, customer testimonials, success stories, digestive health results, Total Essential reviews, wellness transformation',
  openGraph: {
    title: 'Customer Reviews & Success Stories | Fiber Supplement Testimonials',
    description: 'Read real customer testimonials and success stories about our premium fiber supplements.',
    type: 'website',
    images: [
      {
        url: '/assets/testimonials-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Customer Success Stories and Testimonials'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Reviews & Success Stories | Fiber Supplement Testimonials',
    description: 'Read real customer testimonials and success stories about our premium fiber supplements.',
    images: ['/assets/testimonials-hero.jpg']
  }
}

export default function TestimonialsPage() {
  return <Testimonials />
}
