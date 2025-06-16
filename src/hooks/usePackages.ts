
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
    id: 'total-essential-15',
    product_name: 'Total Essential - 15 Day Supply',
    product_type: 'total_essential',
    quantity: 15,
    price: 79.99,
    original_price: 89.99,
    savings: 10.00,
    is_popular: false,
  },
  {
    id: 'total-essential-30',
    product_name: 'Total Essential - 30 Day Supply',
    product_type: 'total_essential',
    quantity: 30,
    price: 149.99,
    original_price: 179.98,
    savings: 29.99,
    is_popular: true,
  },
  {
    id: 'total-essential-60',
    product_name: 'Total Essential - 60 Day Supply',
    product_type: 'total_essential',
    quantity: 60,
    price: 279.99,
    original_price: 359.96,
    savings: 79.97,
    is_popular: false,
  },
  // Total Essential Plus packages
  {
    id: 'total-essential-plus-15',
    product_name: 'Total Essential Plus - 15 Day Supply',
    product_type: 'total_essential_plus',
    quantity: 15,
    price: 84.99,
    original_price: 94.99,
    savings: 10.00,
    is_popular: false,
  },
  {
    id: 'total-essential-plus-30',
    product_name: 'Total Essential Plus - 30 Day Supply',
    product_type: 'total_essential_plus',
    quantity: 30,
    price: 159.99,
    original_price: 189.98,
    savings: 29.99,
    is_popular: true,
  },
  {
    id: 'total-essential-plus-60',
    product_name: 'Total Essential Plus - 60 Day Supply',
    product_type: 'total_essential_plus',
    quantity: 60,
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
