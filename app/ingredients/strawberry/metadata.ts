import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strawberry | Vitamin C & Antioxidant Boost | La Belle Vie',
  description: 'Explore the delicious and nutritious benefits of Strawberry, a fruit rich in Vitamin C, antioxidants, and fiber that supports immune health, skin vitality, and more.',
  keywords: 'strawberry, vitamin c, antioxidant, immune support, skin health, strawberry benefits, natural vitamin c, premium strawberry, dietary supplement, fruit fiber',
  openGraph: {
    title: 'Strawberry | A Sweet Boost for Your Health & Wellness',
    description: 'Packed with Vitamin C and antioxidants, our premium Strawberry powder supports immune function, promotes radiant skin, and offers a delicious way to stay healthy.',
    images: [
      {
        url: '/lovable-uploads/strawberry.jpg',
        width: 1200,
        height: 630,
        alt: 'Strawberry',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strawberry | The Delicious Way to Boost Your Immune System',
    description: 'Rich in Vitamin C and antioxidants, our premium Strawberry powder is a tasty and effective way to support your immune system and promote vibrant skin.',
    images: ['/lovable-uploads/strawberry-hero.jpg'],
  }
}