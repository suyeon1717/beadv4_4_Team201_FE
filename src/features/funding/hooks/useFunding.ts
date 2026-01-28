import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import {
  getFunding,
  getMyOrganizedFundings,
  getMyParticipatedFundings,
  getMyReceivedFundings,
} from '@/lib/api/fundings';
import type { FundingQueryParams } from '@/types/funding';

/**
 * Hook to fetch a specific funding detail
 * @param fundingId - The ID of the funding to fetch
 */
export function useFunding(fundingId: string) {
  return useQuery({
    queryKey: queryKeys.funding(fundingId),
    queryFn: () => getFunding(fundingId),
    enabled: !!fundingId,
  });
}

/**
 * Hook to fetch fundings organized by the current user
 * @param params - Query parameters (status, page, size)
 */
export function useMyOrganizedFundings(params?: FundingQueryParams) {
  return useQuery({
    queryKey: queryKeys.myOrganizedFundings,
    queryFn: () => getMyOrganizedFundings(params),
  });
}

/**
 * Hook to fetch fundings the current user has participated in
 * @param params - Query parameters (status, page, size)
 */
export function useMyParticipatedFundings(params?: FundingQueryParams) {
  return useQuery({
    queryKey: queryKeys.myParticipatedFundings,
    queryFn: () => getMyParticipatedFundings(params),
  });
}

/**
 * Hook to fetch fundings the current user has received
 * @param params - Query parameters (status, page, size)
 */
export function useMyReceivedFundings(params?: FundingQueryParams) {
  return useQuery({
    queryKey: queryKeys.myReceivedFundings,
    queryFn: () => getMyReceivedFundings(params),
  });
}
