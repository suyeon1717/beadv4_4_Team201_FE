import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getProducts, searchProducts } from '@/lib/api/products';
import type { ProductQueryParams, ProductSearchParams } from '@/types/product';

/**
 * Hook to fetch products with optional filters
 * @param params - Query parameters (category, minPrice, maxPrice, sort, page, size)
 */
export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
  });
}

/**
 * Hook to search products by keyword
 * @param params - Search parameters (q, category, page, size)
 */
export function useSearchProducts(params: ProductSearchParams) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => searchProducts(params),
    enabled: !!params.q,
  });
}
