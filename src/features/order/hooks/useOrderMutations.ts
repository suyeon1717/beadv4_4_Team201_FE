import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { createOrder } from '@/lib/api/orders';
import type { OrderCreateRequest } from '@/types/order';

/**
 * Hook to create a new order from selected cart items
 *
 * Invalidates: orders, cart
 *
 * Note: Payment should be handled separately via useCreatePayment
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: OrderCreateRequest) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}
