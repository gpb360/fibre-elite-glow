import React from 'react'
import { generateIngredientSchema, generateBreadcrumbSchema } from '@/lib/seo'
import StructuredData from '@/components/seo/StructuredData'
import { ingredientData } from '@/lib/ingredient-utils'

interface IngredientStructuredDataProps {
  slug: string
  /** Override name from ingredientData */
  name?: string
  /** Override description from ingredientData */
  description?: string
  image?: string
  activeCompounds?: string[]
  mechanisms?: string[]
}

export default function IngredientStructuredData({
  slug,
  name,
  description,
  image,
  activeCompounds = [],
  mechanisms = [],
}: IngredientStructuredDataProps) {
  const data = ingredientData[slug]
  const ingredientName = name || data?.name || slug.replace(/-/g, ' ')
  const ingredientDesc = description || data?.shortDescription || ''
  const benefits = data?.benefits || []

  const ingredientSchema = generateIngredientSchema({
    name: ingredientName,
    description: ingredientDesc,
    benefits,
    category: data?.category || 'Dietary Supplement Ingredient',
    image,
    url: `/ingredients/${slug}`,
    activeCompounds,
    mechanisms,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Ingredients', url: '/ingredients' },
    { name: ingredientName, url: `/ingredients/${slug}` },
  ])

  return <StructuredData data={[ingredientSchema, breadcrumbSchema]} />
}
