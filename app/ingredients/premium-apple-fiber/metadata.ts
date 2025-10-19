import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dual-Action Apple Fiber - Gut & Heart Health - La Belle Vie',
  description: 'Optimize both digestive and cardiovascular health with dual-action apple fiber. This synergistic blend combines soluble pectin that binds cholesterol and supports heart health with insoluble fiber that promotes regular bowel movements, creating comprehensive wellness support that enhances nutrient absorption and maintains healthy lipid profiles.',
  keywords: 'dual-action apple fiber, soluble and insoluble fiber, gut health, heart health support, pectin fiber, cholesterol support, digestive regularity, weight management fiber, natural apple fiber',
  openGraph: {
    title: 'Dual-Action Apple Fiber | For a Healthy Gut & Heart',
    description: 'Support your digestive and cardiovascular health with our premium apple fiber, a perfect blend of soluble and insoluble fibers.',
    images: [
      {
        url: '/lovable-uploads/apple-fiber-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Apple Fiber',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dual-Action Apple Fiber | For a Healthy Gut & Heart',
    description: 'Support your digestive and cardiovascular health with our premium apple fiber, a perfect blend of soluble and insoluble fibers.',
    images: ['/lovable-uploads/apple-fiber-hero.jpg'],
  }
}
