import { Metadata } from 'next'
import TermsAndConditions from '@/components/pages/TermsAndConditions'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Terms & Conditions | Policies & Legal Info | La Belle Vie',
  description: 'Read our terms and conditions for ordering, shipping, returns, and payment policies. Important legal information for La Belle Vie customers.',
  keywords: 'terms and conditions, shipping policy, return policy, payment terms, legal information, La Belle Vie terms',
  url: '/terms',
  noIndex: true
})

export default function TermsPage() {
  return <TermsAndConditions />
}