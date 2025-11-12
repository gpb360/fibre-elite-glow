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
  siteName: 'La Belle Vie',
  defaultImage: '/lovable-uploads/webp/fruit-veg-bottle.webp',
  twitterHandle: '@labellevie'
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
    : `${title} - ${defaultConfig.siteName}`

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
  gtin?: string
  image?: string
  rating?: number
  reviewCount?: number
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  url?: string
  reviews?: Array<{
    author: string
    rating: number
    body: string
  }>
  additionalProperties?: Array<{
    name: string
    value: string
  }>
}) {
  const {
    name,
    description,
    price,
    currency = 'USD',
    sku,
    brand = 'La Belle Vie',
    gtin,
    image,
    rating = 4.8,
    reviewCount = 150,
    availability = 'InStock',
    url,
    reviews = [],
    additionalProperties = []
  } = product

  const schema: any = {
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

  // Add GTIN if provided
  if (gtin) {
    schema.gtin = gtin
  }

  // Add reviews if provided
  if (reviews.length > 0) {
    schema.review = reviews.map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString()
      },
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewBody": review.body
    }))
  }

  // Add additional properties if provided
  if (additionalProperties.length > 0) {
    schema.additionalProperty = additionalProperties.map(prop => ({
      "@type": "PropertyValue",
      "name": prop.name,
      "value": prop.value
    }))
  }

  return schema
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

// Ingredient schema generator
export function generateIngredientSchema(ingredient: {
  name: string
  description: string
  benefits?: string[]
  category?: string
  image?: string
  url?: string
  activeCompounds?: string[]
  mechanisms?: string[]
}) {
  const {
    name,
    description,
    benefits = [],
    category = 'Dietary Supplement',
    image,
    url,
    activeCompounds = [],
    mechanisms = []
  } = ingredient

  const schema: any = {
    "@context": "https://schema.org",
    "@type": ["DietarySupplement", "Substance"],
    "name": name,
    "description": description,
    "category": category,
    "url": url ? `${defaultConfig.domain}${url}` : defaultConfig.domain,
    ...(image && {
      "image": [
        image.startsWith('http') ? image : `${defaultConfig.domain}${image}`
      ]
    })
  }

  // Add benefits if provided
  if (benefits.length > 0) {
    schema.potentialBenefit = benefits.map(benefit => ({
      "@type": "MedicalBenefit",
      "name": benefit
    }))
  }

  // Add active compounds if provided
  if (activeCompounds.length > 0) {
    schema.activeIngredient = activeCompounds.map(compound => ({
      "@type": "ChemicalSubstance",
      "name": compound
    }))
  }

  // Add mechanisms if provided
  if (mechanisms.length > 0) {
    schema.mechanismOfAction = mechanisms.join(', ')
  }

  return schema
}

// Ingredients collection schema generator
export function generateIngredientsCollectionSchema(ingredients: Array<{
  name: string
  description: string
  url: string
  image?: string
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Premium Ingredients | La Belle Vie",
    "description": "Discover our premium, scientifically-backed ingredients that power our fiber supplements for optimal digestive health and overall wellness.",
    "url": `${defaultConfig.domain}/ingredients`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "La Belle Vie",
      "url": defaultConfig.domain
    },
    "about": ingredients.map(ingredient => ({
      "@type": "Thing",
      "name": ingredient.name,
      "description": ingredient.description,
      "url": ingredient.url.startsWith('http') ? ingredient.url : `${defaultConfig.domain}${ingredient.url}`,
      ...(ingredient.image && {
        "image": ingredient.image.startsWith('http') ? ingredient.image : `${defaultConfig.domain}${ingredient.image}`
      })
    }))
  }
}

// Organization schema generator
export function generateOrganizationSchema(brandName: string = 'La Belle Vie') {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": brandName,
    "url": defaultConfig.domain,
    "logo": `${defaultConfig.domain}/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp`,
    "sameAs": [
      "https://facebook.com/labellevie",
      "https://instagram.com/labellevie",
      "https://twitter.com/labellevie"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-855-555-1234",
      "contactType": "customer service",
      "email": "admin@lbve.ca"
    }
  }
}