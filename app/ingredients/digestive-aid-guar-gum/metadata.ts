import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digestive-Aid Guar Gum - Prebiotic Fiber for Regularity - La Belle Vie',
  description: 'Promote digestive regularity and gut health with natural guar gum fiber. This highly soluble prebiotic fiber creates bulk in the digestive tract, nourishes beneficial gut bacteria, slows glucose absorption for blood sugar balance, and provides lasting satiety to support healthy weight management.',
  keywords: 'digestive-aid guar gum, guar gum, soluble fiber, prebiotic, digestive regularity, constipation relief, satiety, blood sugar support, natural supplements, guar bean',
  openGraph: {
    title: 'Digestive-Aid Guar Gum | Natural Fiber for Gut Health',
    description: 'A natural, high-fiber prebiotic that promotes regularity, supports a healthy gut, and helps you feel full longer.',
    images: [
      {
        url: '/lovable-uploads/guar-gum-extract.jpg',
        width: 1200,
        height: 630,
        alt: 'Digestive-Aid Guar Gum',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digestive-Aid Guar Gum | Natural Fiber for Gut Health',
    description: 'A natural, high-fiber prebiotic that promotes regularity, supports a healthy gut, and helps you feel full longer.',
    images: ['/lovable-uploads/guar-gum-extract.jpg'],
  }
}