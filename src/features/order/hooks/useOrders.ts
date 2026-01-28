import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getOrder, getOrders } from '@/lib/api/orders';
import type { PageParams } from '@/types/api';

/**
 * Hook to fetch a specific order detail
 * @param orderId - The ID of the order to fetch
 */
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
}

/**
 * Hook to fetch all orders for the current user
 * @param params - Pagination parameters (page, size)
 */
export function useOrders(params?: PageParams) {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: () => getOrders(params),
  });
}
