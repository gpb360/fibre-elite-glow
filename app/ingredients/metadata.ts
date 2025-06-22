import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Natural Ingredients | Fiber Supplements | Fibre Elite Glow',
  description: 'Discover the science-backed natural ingredients in our premium fiber supplements. Learn about Oil Palm Fibre, Prebiotic Oligosaccharides, and other high-quality components that support digestive health and overall wellness.',
  keywords: 'natural ingredients, premium fiber supplements, oil palm fibre, prebiotic oligosaccharides, beta-glucan oat bran, digestive health ingredients, gut health supplements, natural fiber sources, sustainable ingredients, science-backed supplements',
  openGraph: {
    title: 'Premium Natural Ingredients | Fiber Supplements',
    description: 'Explore our carefully selected natural ingredients that power our effective fiber supplements for digestive health and wellness.',
    images: [
      {
        url: '/lovable-uploads/ingredients-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Natural Ingredients',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Natural Ingredients | Fiber Supplements',
    description: 'Explore our carefully selected natural ingredients that power our effective fiber supplements.',
    images: ['/lovable-uploads/ingredients-hero.jpg'],
  }
}
