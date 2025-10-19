import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sustainable Palm Fiber | Balanced Gut & Heart Health | La Belle Vie',
  description: 'Discover the benefits of Sustainable Palm Fiber, a balanced, lignin-rich fiber that supports digestive health, heart health, and detoxification.',
  keywords: 'sustainable palm fiber, balanced fiber, lignin-rich fiber, gut health, heart health, detoxification, cholesterol support, blood sugar regulation, sustainable ingredients, natural fiber',
  openGraph: {
    title: 'Sustainable Palm Fiber | The Balanced Fiber for Total Wellness',
    description: 'A revolutionary, balanced dietary fiber source with exceptional health benefits, extracted from sustainable oil palm trunks.',
    images: [
      {
        url: '/lovable-uploads/oil-palm-fibre-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Sustainable Palm Fiber',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sustainable Palm Fiber | The Balanced Fiber for Total Wellness',
    description: 'A revolutionary, balanced dietary fiber source with exceptional health benefits, extracted from sustainable oil palm trunks.',
    images: ['/lovable-uploads/oil-palm-fibre-hero.jpg'],
  }
}