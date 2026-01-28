import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { createPayment } from '@/lib/api/payments';
import type { PaymentCreateRequest } from '@/types/payment';
import type { Cart } from '@/types/cart';

/**
 * Hook to create a payment for an order
 *
 * Invalidates: wallet, walletHistory, cart, affected funding(id)s
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentCreateRequest) => createPayment(data),
    onSuccess: () => {
      // Invalidate wallet (balance will be deducted)
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet });
      queryClient.invalidateQueries({ queryKey: queryKeys.walletHistory() });

      // Get cart data to find all affected funding IDs
      const cartData = queryClient.getQueryData<Cart>(queryKeys.cart);

      // Invalidate cart (items will be removed after successful payment)
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });

      // Invalidate all affected fundings (their currentAmount will be updated)
      if (cartData?.items) {
        cartData.items.forEach((item) => {
          if (item.selected && item.fundingId) {
            queryClient.invalidateQueries({ queryKey: queryKeys.funding(item.fundingId) });
          }
        });
      }
    },
  });
}
