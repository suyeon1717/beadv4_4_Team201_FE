import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { chargeWallet } from '@/lib/api/wallet';
import type { WalletChargeRequest } from '@/types/wallet';

/**
 * Hook to charge the wallet (add balance)
 *
 * Invalidates: wallet, walletHistory
 */
export function useChargeWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WalletChargeRequest) => chargeWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet });
      queryClient.invalidateQueries({ queryKey: queryKeys.walletHistory() });
    },
  });
}
