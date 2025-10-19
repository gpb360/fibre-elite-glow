import { Metadata } from 'next'
import Contact from '@/components/pages/Contact'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Contact Us | Customer Support | La Belle Vie',
  description: 'Get in touch with our customer support team. We\'re here to help with questions about our premium fiber supplements and health products.',
  keywords: 'contact, customer support, fiber supplements, health questions, La Belle Vie contact',
  url: '/contact'
})

export default function ContactPage() {
  return <Contact />
}