import { Metadata } from 'next'
import AuthorizedAgents from '@/components/pages/AuthorizedAgents'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Authorized Agents - Fibre Elite Glow',
  description: 'Find La Belle Vie authorized agents and retailers near you. Shop our premium fiber supplements at authorized locations across Canada, USA, and internationally.',
  keywords: 'authorized agents, retailers, distributors, La Belle Vie locations, where to buy, health stores, vitamin shops',
  url: '/agents'
})

export default function AuthorizedAgentsPage() {
  return <AuthorizedAgents />
}