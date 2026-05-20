import Faq from '@/components/pages/Faq'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Fiber Supplements FAQ | Questions & Expert Answers',
  description: 'Get answers to common questions about our premium fiber supplements, dosage, ingredients, and health benefits. Expert guidance for optimal digestive wellness.',
  keywords: 'fiber supplements FAQ, fiber questions, dosage, ingredients, side effects, digestive health questions, supplement guide',
  url: '/faq',
})

export default function FaqPage() {
  return <Faq />
}
