import { Metadata } from 'next'

interface IngredientConfig {
  name: string
  shortDescription: string
  image?: string
  category?: string
  benefits?: string[]
}

// Ingredient image mapping - maps directory names to actual image files
export const ingredientImages: Record<string, string> = {
  'acai-berry': '/lovable-uploads/acai-closeup.jpg',
  'antioxidant-parsley': '/lovable-uploads/webp/antioxidant-parsley-fresh-herb.webp',
  'apple-fiber': '/lovable-uploads/apple-fiber-realistic-v1.jpg',
  'beta-glucan-oat-bran': '/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp',
  'cranberry': '/lovable-uploads/cranberry-closeup.jpg',
  'detoxifying-broccoli-extract': '/lovable-uploads/broccoli-closeup-realistic.jpg',
  'digestive-aid-guar-gum': '/lovable-uploads/guar-beans.jpg',
  'enzyme-rich-papaya': '/lovable-uploads/papaya-closeup.jpg',
  'fresh-cabbage-extract': '/lovable-uploads/cabbage-closeup.jpg',
  'fresh-spinach-powder': '/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp',
  'hydrating-celery': '/lovable-uploads/celery-closeup.jpg',
  'nutrient-rich-carrot': '/lovable-uploads/carrot-closeup.jpg',
  'premium-apple-fiber': '/lovable-uploads/apple-fiber-realistic-v2.jpg',
  'raspberry': '/lovable-uploads/raspberry-closeup.jpg',
  'soluble-corn-fiber': '/lovable-uploads/corn-field.jpg',
  'strawberry': '/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp',
  'prebiotic-powerhouse': '/lovable-uploads/webp/prebiotic-fiber-gut-health.webp',
  'soothing-aloe-vera-powder': '/lovable-uploads/aloe-vera-closeup.jpg',
  'sustainable-palm-fiber': '/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp'
}

// Ingredient data for better descriptions
export const ingredientData: Record<string, IngredientConfig> = {
  'acai-berry': {
    name: 'Acai Berry',
    shortDescription: 'Antioxidant-rich superfood that supports cellular health and boosts energy levels.',
    category: 'superfruit',
    benefits: ['Antioxidant protection', 'Energy boost', 'Skin health', 'Cellular regeneration']
  },
  'antioxidant-parsley': {
    name: 'Antioxidant Parsley',
    shortDescription: 'Fresh herb rich in antioxidants that supports detoxification and immune health.',
    category: 'herb',
    benefits: ['Detoxification', 'Immune support', 'Antioxidant protection', 'Nutrient density']
  },
  'apple-fiber': {
    name: 'Apple Fiber',
    shortDescription: 'Natural soluble fiber that supports digestive health and regularity.',
    category: 'fiber',
    benefits: ['Digestive health', 'Regular bowel movements', 'Satiety', 'Blood sugar support']
  },
  'beta-glucan-oat-bran': {
    name: 'Beta-Glucan Oat Bran',
    shortDescription: 'Heart-healthy soluble fiber that helps lower cholesterol and regulate blood sugar.',
    category: 'fiber',
    benefits: ['Cholesterol reduction', 'Heart health', 'Blood sugar regulation', 'Sustained energy']
  },
  'cranberry': {
    name: 'Cranberry',
    shortDescription: 'Urinary tract health support with potent antioxidants and immune-boosting properties.',
    category: 'superfruit',
    benefits: ['Urinary tract health', 'Antioxidant protection', 'Immune support', 'Cellular health']
  },
  'detoxifying-broccoli-extract': {
    name: 'Detoxifying Broccoli Extract',
    shortDescription: 'Concentrated broccoli extract that supports natural detoxification pathways.',
    category: 'vegetable',
    benefits: ['Detoxification', 'Cellular protection', 'Antioxidant support', 'Nutrient density']
  },
  'digestive-aid-guar-gum': {
    name: 'Digestive Aid Guar Gum',
    shortDescription: 'Prebiotic fiber that nourishes gut bacteria and supports digestive regularity.',
    category: 'fiber',
    benefits: ['Gut health', 'Regular digestion', 'Prebiotic support', 'Satiety']
  },
  'enzyme-rich-papaya': {
    name: 'Enzyme-Rich Papaya',
    shortDescription: 'Tropical fruit rich in digestive enzymes that supports protein breakdown and gut health.',
    category: 'fruit',
    benefits: ['Digestive enzymes', 'Protein digestion', 'Gut comfort', 'Nutrient absorption']
  },
  'fresh-cabbage-extract': {
    name: 'Fresh Cabbage Extract',
    shortDescription: 'Nutrient-dense cruciferous extract that supports gut health and inflammation balance.',
    category: 'vegetable',
    benefits: ['Gut lining support', 'Digestive comfort', 'Nutrient density', 'Inflammation balance']
  },
  'fresh-spinach-powder': {
    name: 'Fresh Spinach Powder',
    shortDescription: 'Iron-rich green superfood that supports energy production and cellular health.',
    category: 'vegetable',
    benefits: ['Iron support', 'Energy production', 'Cellular health', 'Nutrient density']
  },
  'hydrating-celery': {
    name: 'Hydrating Celery',
    shortDescription: 'Water-rich vegetable that supports hydration and digestive comfort.',
    category: 'vegetable',
    benefits: ['Hydration support', 'Digestive comfort', 'Electrolyte balance', 'Low-calorie nutrition']
  },
  'nutrient-rich-carrot': {
    name: 'Nutrient-Rich Carrot',
    shortDescription: 'Beta-carotene rich root vegetable that supports vision and immune health.',
    category: 'vegetable',
    benefits: ['Vision support', 'Beta-carotene', 'Immune health', 'Antioxidant protection']
  },
  'premium-apple-fiber': {
    name: 'Premium Apple Fiber',
    shortDescription: 'High-quality soluble fiber from apples that supports digestive wellness and satiety.',
    category: 'fiber',
    benefits: ['Premium fiber source', 'Digestive wellness', 'Satiety support', 'Blood sugar balance']
  },
  'raspberry': {
    name: 'Raspberry',
    shortDescription: 'Antioxidant-rich berry that supports cellular health and provides natural fiber.',
    category: 'superfruit',
    benefits: ['Antioxidant protection', 'Natural fiber', 'Cellular health', 'Delicious nutrition']
  },
  'soluble-corn-fiber': {
    name: 'Soluble Corn Fiber',
    shortDescription: 'Prebiotic fiber that nourishes beneficial gut bacteria for optimal digestive health.',
    category: 'fiber',
    benefits: ['Prebiotic support', 'Gut bacteria nourishment', 'Digestive health', 'Fiber source']
  },
  'strawberry': {
    name: 'Strawberry',
    shortDescription: 'Vitamin C-rich berry that supports immune health and provides antioxidant protection.',
    category: 'superfruit',
    benefits: ['Vitamin C', 'Immune support', 'Antioxidant protection', 'Skin health']
  },
  'prebiotic-powerhouse': {
    name: 'Prebiotic Powerhouse',
    shortDescription: 'Comprehensive prebiotic blend that nourishes gut microbiome for optimal digestive wellness.',
    category: 'fiber',
    benefits: ['Microbiome support', 'Prebiotic diversity', 'Gut health', 'Digestive wellness']
  },
  'soothing-aloe-vera-powder': {
    name: 'Soothing Aloe Vera Powder',
    shortDescription: 'Gentle plant powder that supports digestive comfort and gut lining health.',
    category: 'plant',
    benefits: ['Gut comfort', 'Digestive soothing', 'Gut lining support', 'Gentle nutrition']
  },
  'sustainable-palm-fiber': {
    name: 'Sustainable Palm Fiber',
    shortDescription: 'Eco-friendly fiber source that supports digestive regularity and sustainability.',
    category: 'fiber',
    benefits: ['Sustainable sourcing', 'Digestive regularity', 'Eco-friendly', 'Fiber source']
  }
}

// Standardize title format: "Ingredient Name - Primary Benefit - La Belle Vie"
export function standardizeTitle(ingredientName: string, primaryBenefit: string): string {
  return `${ingredientName} - ${primaryBenefit} - La Belle Vie`
}

// Generate ingredient metadata with consistent format
export function generateIngredientMetadata(
  slug: string,
  primaryBenefit: string,
  detailedDescription?: string,
  additionalKeywords?: string[]
): Metadata {
  const ingredient = ingredientData[slug]
  if (!ingredient) {
    throw new Error(`Ingredient data not found for slug: ${slug}`)
  }

  const title = standardizeTitle(ingredient.name, primaryBenefit)
  const description = detailedDescription || ingredient.shortDescription
  const keywords = [
    ingredient.name.toLowerCase(),
    primaryBenefit.toLowerCase(),
    ingredient.category || 'ingredient',
    'fiber supplement',
    'digestive health',
    'La Belle Vie',
    ...(additionalKeywords || [])
  ].join(', ')

  const image = ingredientImages[slug] || '/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp'

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${ingredient.name} | Premium ${primaryBenefit} for Health & Wellness`,
      description: description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${ingredient.name} - Natural ingredient for health and wellness`
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ingredient.name} | Premium ${primaryBenefit} Support`,
      description: description,
      images: [image]
    }
  }
}

// Get ingredient description for overview page
export function getIngredientDescription(slug: string): string {
  const ingredient = ingredientData[slug]
  if (!ingredient) {
    return `Learn more about the benefits of this natural ingredient.`
  }

  // Return the enhanced shortDescription instead of generic fallback
  return ingredient.shortDescription
}

// Get ingredient image for overview page
export function getIngredientImage(slug: string): string {
  return ingredientImages[slug] || '/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp'
}