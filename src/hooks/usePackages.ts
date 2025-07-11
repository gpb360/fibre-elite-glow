
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
      try {
        console.log('🔍 Fetching packages from Supabase...');

        // Try to fetch from Supabase first
        let query = supabase
          .from('packages')
          .select(`
            *,
            products (
              name,
              description,
              short_description
            )
          `)
          .eq('is_active', true)
          .order('quantity', { ascending: true });

        if (productType) {
          query = query.eq('product_type', productType);
        }

        const { data, error } = await query;

        if (error) {
          console.warn('⚠️ Supabase query failed, falling back to mock data:', error);
          throw error;
        }

        if (data && data.length > 0) {
          console.log('✅ Successfully fetched packages from Supabase:', data.length);
          return data as Package[];
        } else {
          console.warn('⚠️ No data returned from Supabase, using mock data');
          throw new Error('No data returned');
        }
      } catch (error) {
        console.warn('⚠️ Using mock data due to Supabase error:', error);

        // Fallback to mock data
        await new Promise(resolve => setTimeout(resolve, 500));

        let filteredPackages = mockPackages;
        if (productType) {
          filteredPackages = mockPackages.filter(pkg => pkg.product_type === productType);
        }

        return filteredPackages;
      }
    },
  });
}
