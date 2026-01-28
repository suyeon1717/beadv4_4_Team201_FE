import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getProduct } from '@/lib/api/products';

/**
 * Hook to fetch detailed information about a specific product
 * @param productId - The ID of the product to fetch
 */
export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });
}
