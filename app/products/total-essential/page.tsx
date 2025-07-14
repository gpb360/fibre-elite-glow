import ProductEssential from '@/components/pages/ProductEssential'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Total Essential | Premium Daily Fiber Blend | Fibre Elite Glow',
  description: 'Total Essential: Premium daily fiber blend crafted from 100% fruit & vegetable fibers for gentle, natural digestive health. 15 sachets per box. Best seller with proven results.',
  keywords: 'Total Essential, fiber supplement, daily fiber blend, fruit fiber, vegetable fiber, digestive health, gut health, natural fiber, premium supplement',
  openGraph: {
    title: 'Total Essential | Premium Daily Fiber Blend',
    description: 'Premium daily fiber blend crafted from 100% fruit & vegetable fibers for gentle, natural regularity.',
    type: 'website',
    images: [
      {
        url: '/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png',
        width: 1200,
        height: 630,
        alt: 'Total Essential Premium Fiber Supplement'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Total Essential | Premium Daily Fiber Blend',
    description: 'Premium daily fiber blend crafted from 100% fruit & vegetable fibers.',
    images: ['/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png']
  }
}

// Product Schema JSON-LD structured data
const ProductSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Total Essential",
    "description": "Premium daily fiber blend crafted from 100% fruit & vegetable fibers for gentle, natural regularity. 15 sachets per box.",
    "brand": {
      "@type": "Brand",
      "name": "Fibre Elite Glow"
    },
    "category": "Health & Wellness > Vitamins & Supplements > Fiber Supplements",
    "sku": "total-essential-base",
    "gtin": "FEG-TE-001",
    "offers": {
      "@type": "Offer",
      "price": "79.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://lbve.ca/products/total-essential",
      "seller": {
        "@type": "Organization",
        "name": "Fibre Elite Glow"
      },
      "priceValidUntil": "2025-12-31"
    },
    "image": [
      "https://lbve.ca/lovable-uploads/27ca3fa0-24aa-479b-b075-3f11006467c5.png"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "156",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "reviewBody": "Amazing results! My digestion has improved dramatically since starting Total Essential. Gentle and effective."
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default function TotalEssentialPage() {
  return (
    <>
      <ProductSchema />
      <ProductEssential />
    </>
  )
}
