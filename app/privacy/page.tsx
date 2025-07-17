import { Metadata } from 'next'
import PrivacyPolicy from '@/components/pages/PrivacyPolicy'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Privacy Policy - Fibre Elite Glow',
  description: 'Learn how we collect, use, and protect your personal information. Our commitment to your privacy and data security.',
  keywords: 'privacy policy, data protection, personal information, privacy rights, GDPR, CCPA',
  url: '/privacy',
  noIndex: true
})

export default function PrivacyPage() {
  return <PrivacyPolicy />
}