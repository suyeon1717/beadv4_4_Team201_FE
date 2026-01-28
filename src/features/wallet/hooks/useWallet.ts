import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getWallet, getWalletHistory } from '@/lib/api/wallet';
import type { WalletHistoryQueryParams } from '@/types/wallet';

/**
 * Hook to fetch the current user's wallet balance
 */
export function useWallet() {
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: getWallet,
  });
}

/**
 * Hook to fetch wallet transaction history
 * @param params - Query parameters (type, page, size)
 */
export function useWalletHistory(params?: WalletHistoryQueryParams) {
  return useQuery({
    queryKey: queryKeys.walletHistory(params),
    queryFn: () => getWalletHistory(params),
  });
}
