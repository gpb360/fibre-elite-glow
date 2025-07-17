import ProductEssentialPlus from '@/components/pages/ProductEssentialPlus'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Total Essential Plus | Advanced Fiber Blend with Super-Fruits | Fibre Elite Glow',
  description: 'Total Essential Plus: Advanced daily fiber blend enhanced with super-fruits for added antioxidants and vibrant glow. Premium digestive wellness with berry power. 15 sachets per box.',
  keywords: 'Total Essential Plus, advanced fiber supplement, super-fruits, antioxidants, berry fiber, digestive health, gut health, premium supplement, acai, goji, cranberry',
  openGraph: {
    title: 'Total Essential Plus | Advanced Fiber Blend with Super-Fruits',
    description: 'Advanced daily fiber blend enhanced with super-fruits for added antioxidants and a vibrant glow.',
    type: 'website',
    images: [
      {
        url: '/lovable-uploads/webp/5f8f72e3-397f-47a4-8bce-f15924c32a34.webp',
        width: 1200,
        height: 630,
        alt: 'Total Essential Plus Advanced Fiber Supplement'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Total Essential Plus | Advanced Fiber Blend with Super-Fruits',
    description: 'Advanced daily fiber blend enhanced with super-fruits for added antioxidants.',
    images: ['/lovable-uploads/webp/5f8f72e3-397f-47a4-8bce-f15924c32a34.webp']
  }
}

// Product Schema JSON-LD structured data
const ProductSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Total Essential Plus",
    "description": "Advanced daily fiber blend enhanced with super-fruits for added antioxidants and a vibrant glow. 15 sachets per box.",
    "brand": {
      "@type": "Brand",
      "name": "Fibre Elite Glow"
    },
    "category": "Health & Wellness > Vitamins & Supplements > Fiber Supplements",
    "sku": "total-essential-plus-base",
    "gtin": "FEG-TEP-001",
    "offers": {
      "@type": "Offer",
      "price": "84.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://lbve.ca/products/total-essential-plus",
      "seller": {
        "@type": "Organization",
        "name": "Fibre Elite Glow"
      },
      "priceValidUntil": "2025-12-31"
    },
    "image": [
      "https://lbve.ca/lovable-uploads/webp/5f8f72e3-397f-47a4-8bce-f15924c32a34.webp"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "89",
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
          "name": "Jennifer K."
        },
        "reviewBody": "Love the berry flavors! Not only improved my digestion but I feel more energized. The antioxidants are a great bonus."
      }
    ],
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Special Features",
        "value": "Enhanced with super-fruits (Acai, Goji Berry, Cranberry)"
      },
      {
        "@type": "PropertyValue",
        "name": "Antioxidant Content",
        "value": "High antioxidant content from berry extracts"
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

export default function TotalEssentialPlusPage() {
  return (
    <>
      <ProductSchema />
      <ProductEssentialPlus />
    </>
  )
}
