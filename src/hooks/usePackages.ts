
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Package {
  id: string;
  product_name: string;
  product_type: 'total_essential' | 'total_essential_plus';
  quantity: number;
  price: number;
  original_price: number | null;
  savings: number | null;
  is_popular: boolean;
}

// Mock data for packages
const mockPackages: Package[] = [
  // Total Essential packages
  {
    id: 'total-essential-1-box',
    product_name: 'Total Essential - 1 Box',
    product_type: 'total_essential',
    quantity: 1, // Number of boxes
    price: 79.99,
    original_price: 89.99,
    savings: 10.00,
    is_popular: false,
  },
  {
    id: 'total-essential-2-boxes',
    product_name: 'Total Essential - 2 Boxes',
    product_type: 'total_essential',
    quantity: 2, // Number of boxes
    price: 149.99,
    original_price: 179.98,
    savings: 29.99,
    is_popular: true,
  },
  {
    id: 'total-essential-4-boxes',
    product_name: 'Total Essential - 4 Boxes',
    product_type: 'total_essential',
    quantity: 4, // Number of boxes
    price: 279.99,
    original_price: 359.96,
    savings: 79.97,
    is_popular: false,
  },
  // Total Essential Plus packages
  {
    id: 'total-essential-plus-1-box',
    product_name: 'Total Essential Plus - 1 Box',
    product_type: 'total_essential_plus',
    quantity: 1, // Number of boxes
    price: 84.99,
    original_price: 94.99,
    savings: 10.00,
    is_popular: false,
  },
  {
    id: 'total-essential-plus-2-boxes',
    product_name: 'Total Essential Plus - 2 Boxes',
    product_type: 'total_essential_plus',
    quantity: 2, // Number of boxes
    price: 159.99,
    original_price: 189.98,
    savings: 29.99,
    is_popular: true,
  },
  {
    id: 'total-essential-plus-4-boxes',
    product_name: 'Total Essential Plus - 4 Boxes',
    product_type: 'total_essential_plus',
    quantity: 4, // Number of boxes
    price: 299.99,
    original_price: 379.96,
    savings: 79.97,
    is_popular: false,
  },
];

export function usePackages(productType?: 'total_essential' | 'total_essential_plus') {
  return useQuery({
    queryKey: ['packages', productType],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter packages by product type if specified
      let filteredPackages = mockPackages;
      if (productType) {
        filteredPackages = mockPackages.filter(pkg => pkg.product_type === productType);
      }

      return filteredPackages;
    },
  });
}
