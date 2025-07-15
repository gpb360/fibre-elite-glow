import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

const defaultConfig = {
  domain: 'https://lbve.ca',
  siteName: 'Fibre Elite Glow',
  defaultImage: '/assets/og-default.jpg',
  twitterHandle: '@fibreeliteglow'
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    image = defaultConfig.defaultImage,
    url,
    type = 'website',
    noIndex = false
  } = config

  const fullTitle = title.includes(defaultConfig.siteName) 
    ? title 
    : `${title} | ${defaultConfig.siteName}`

  const fullUrl = url ? `${defaultConfig.domain}${url}` : defaultConfig.domain
  const fullImageUrl = image.startsWith('http') ? image : `${defaultConfig.domain}${image}`

  return {
    title: fullTitle,
    description,
    keywords,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: fullUrl
    },
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: fullUrl,
      siteName: defaultConfig.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: defaultConfig.twitterHandle,
      creator: defaultConfig.twitterHandle,
      title: fullTitle,
      description,
      images: [fullImageUrl]
    }
  }
}

// Product schema generator
export function generateProductSchema(product: {
  name: string
  description: string
  price: string
  currency?: string
  sku: string
  brand?: string
  image?: string
  rating?: number
  reviewCount?: number
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  url?: string
}) {
  const {
    name,
    description,
    price,
    currency = 'USD',
    sku,
    brand = 'Fibre Elite Glow',
    image,
    rating = 4.8,
    reviewCount = 150,
    availability = 'InStock',
    url
  } = product

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": "Health & Wellness > Vitamins & Supplements > Fiber Supplements",
    "sku": sku,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": `https://schema.org/${availability}`,
      "url": url ? `${defaultConfig.domain}${url}` : defaultConfig.domain,
      "seller": {
        "@type": "Organization",
        "name": brand
      },
      "priceValidUntil": "2025-12-31"
    },
    ...(image && {
      "image": [
        image.startsWith('http') ? image : `${defaultConfig.domain}${image}`
      ]
    }),
    ...(rating && reviewCount && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.toString(),
        "reviewCount": reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  }
}

// Breadcrumb schema generator
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${defaultConfig.domain}${crumb.url}`
    }))
  }
}

// FAQ schema generator
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// Organization schema generator
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": defaultConfig.siteName,
    "url": defaultConfig.domain,
    "logo": `${defaultConfig.domain}/logo.png`,
    "sameAs": [
      "https://facebook.com/fibreeliteglow",
      "https://instagram.com/fibreeliteglow",
      "https://twitter.com/fibreeliteglow"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-555-1234",
      "contactType": "customer service",
      "email": "support@fibreeliteglow.com"
    }
  }
}