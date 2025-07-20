import Faq from '@/components/pages/Faq'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fiber Supplements FAQ | Questions & Expert Answers',
  description: 'Get answers to common questions about our premium fiber supplements, dosage, ingredients, and health benefits. Expert guidance for optimal digestive wellness.',
  keywords: 'fiber supplements FAQ, fiber questions, dosage, ingredients, side effects, digestive health questions, supplement guide',
  openGraph: {
    title: 'Frequently Asked Questions | Fiber Supplements FAQ',
    description: 'Get answers to common questions about our premium fiber supplements, dosage, ingredients, and health benefits.',
    type: 'website',
    images: [
      {
        url: '/assets/faq-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Fiber Supplements FAQ and Expert Guidance'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions | Fiber Supplements FAQ',
    description: 'Get answers to common questions about our premium fiber supplements.',
    images: ['/assets/faq-hero.jpg']
  }
}

export default function FaqPage() {
  return <Faq />
}
