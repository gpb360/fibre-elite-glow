import { Metadata } from 'next'
import About from '@/components/pages/About'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'About Us | Our Mission & Natural Fiber Philosophy',
  description: 'Learn about La Belle Vie Enterprises and our mission to provide natural, premium fiber supplements. We are the nature and the nature is us.',
  keywords: 'about us, company mission, natural supplements, fiber health, colon health, La Belle Vie philosophy',
  url: '/about'
})

export default function AboutPage() {
  return <About />
}