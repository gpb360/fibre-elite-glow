
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

export function usePackages(productType?: 'total_essential' | 'total_essential_plus') {
  return useQuery({
    queryKey: ['packages', productType],
    queryFn: async () => {
      let query = supabase
        .from('packages')
        .select('*')
        .order('quantity', { ascending: true });
      
      if (productType) {
        query = query.eq('product_type', productType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data as Package[];
    },
  });
}
