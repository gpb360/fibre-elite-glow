import { lazy, Suspense } from 'react';
import { LoadingFallback } from '@/components/performance/LazyComponent';

// Map of ingredient names to their component paths
const ingredientMap: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  'acai-berry': () => import('@/components/pages/ingredients/AcaiBerry'),
  'apple-fiber': () => import('@/components/pages/ingredients/AppleFiber'),
  'beta-glucan-oat-bran': () => import('@/components/pages/ingredients/BetaGlucanOatBran'),
  'cranberry': () => import('@/components/pages/ingredients/Cranberry'),
  'detoxifying-broccoli-extract': () => import('@/components/pages/ingredients/DetoxifyingBroccoliExtract'),
  'digestive-aid-guar-gum': () => import('@/components/pages/ingredients/DigestiveAidGuarGum'),
  'enzyme-rich-papaya': () => import('@/components/pages/ingredients/EnzymeRichPapaya'),
  'fresh-cabbage-extract': () => import('@/components/pages/ingredients/FreshCabbageExtract'),
  'fresh-spinach-powder': () => import('@/components/pages/ingredients/FreshSpinachPowder'),
  'hydrating-celery': () => import('@/components/pages/ingredients/HydratingCelery'),
  'nutrient-rich-carrot': () => import('@/components/pages/ingredients/NutrientRichCarrot'),
  'premium-apple-fiber': () => import('@/components/pages/ingredients/PremiumAppleFiber'),
  'raspberry': () => import('@/components/pages/ingredients/Raspberry'),
  'soluble-corn-fiber': () => import('@/components/pages/ingredients/SolubleCornFiber'),
  'soothing-aloe-vera-powder': () => import('@/components/pages/ingredients/SoothingAloeVeraPowder'),
  'strawberry': () => import('@/components/pages/ingredients/Strawberry'),
  'sustainable-palm-fiber': () => import('@/components/pages/ingredients/SustainablePalmFiber'),
};

export function useLazyIngredient(ingredientName: string) {
  const loader = ingredientMap[ingredientName];

  if (!loader) {
    console.warn(`Ingredient "${ingredientName}" not found in ingredient map`);
    return null;
  }

  const LazyIngredientComponent = lazy(loader);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyIngredientComponent />
    </Suspense>
  );
}