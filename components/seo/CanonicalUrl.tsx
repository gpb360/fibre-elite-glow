'use client'

import Head from 'next/head'
import { usePathname } from 'next/navigation'

interface CanonicalUrlProps {
  baseUrl?: string
}

export function CanonicalUrl({ baseUrl }: CanonicalUrlProps) {
  const pathname = usePathname()
  // Use environment variable or fallback to production URL
  const canonicalUrl = `${baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://lbve.ca'}${pathname}`

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}