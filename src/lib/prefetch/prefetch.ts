import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getWallet } from '@/lib/api/wallet';
import { getCart } from '@/lib/api/cart';
import { getMyWishlist } from '@/lib/api/wishlists';

/**
 * Prefetch critical data for authenticated users
 * Call this after successful authentication
 */
export async function prefetchUserData(queryClient: QueryClient) {
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: queryKeys.wallet,
            queryFn: () => getWallet(),
            staleTime: 60 * 1000,
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.cart,
            queryFn: () => getCart(),
            staleTime: 60 * 1000,
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.myWishlist,
            queryFn: () => getMyWishlist(),
            staleTime: 60 * 1000,
        }),
    ]);
}

/**
 * Common routes for prefetching
 */
export const PREFETCH_ROUTES = [
    '/',
    '/cart',
    '/wallet',
    '/wishlist',
    '/products',
    '/profile',
] as const;
