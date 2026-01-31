import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getCart } from '@/lib/api/cart';
import { useUser } from '@auth0/nextjs-auth0/client';

/**
 * Hook to fetch the current user's cart
 */
export function useCart() {
  const { user } = useUser();

  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
    enabled: !!user,
  });
}
