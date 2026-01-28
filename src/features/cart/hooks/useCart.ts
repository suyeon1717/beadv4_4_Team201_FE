import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getCart } from '@/lib/api/cart';

/**
 * Hook to fetch the current user's cart
 */
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
  });
}
