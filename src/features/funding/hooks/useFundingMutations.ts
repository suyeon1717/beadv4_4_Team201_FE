import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import {
  createFunding,
  participateFunding,
  acceptFunding,
  refuseFunding,
  type RefuseFundingRequest,
} from '@/lib/api/fundings';
import type { FundingCreateRequest } from '@/types/funding';

/**
 * Hook to create a new funding
 *
 * Invalidates: myWishlist, myOrganizedFundings, home
 */
export function useCreateFunding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FundingCreateRequest) => createFunding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myWishlist });
      queryClient.invalidateQueries({ queryKey: queryKeys.myOrganizedFundings });
      queryClient.invalidateQueries({ queryKey: queryKeys.home });
    },
  });
}

/**
 * Hook to participate in a funding
 *
 * Invalidates: funding(id), cart
 */
export function useParticipateFunding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fundingId, amount }: { fundingId: string; amount: number }) =>
      participateFunding(fundingId, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.funding(variables.fundingId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

/**
 * Hook to accept a completed funding (recipient action)
 *
 * Invalidates: funding(id), myReceivedFundings
 */
export function useAcceptFunding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fundingId: string) => acceptFunding(fundingId),
    onSuccess: (_, fundingId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.funding(fundingId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.myReceivedFundings });
    },
  });
}

/**
 * Hook to refuse a completed funding (recipient action)
 *
 * Invalidates: funding(id), myReceivedFundings
 */
export function useRefuseFunding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fundingId, data }: { fundingId: string; data?: RefuseFundingRequest }) =>
      refuseFunding(fundingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.funding(variables.fundingId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.myReceivedFundings });
    },
  });
}
