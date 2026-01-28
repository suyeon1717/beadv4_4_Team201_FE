import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import {
  addWishlistItem,
  removeWishlistItem,
  updateWishlistVisibility,
  type WishlistVisibilityUpdateRequest,
} from '@/lib/api/wishlists';
import type { WishItemCreateRequest } from '@/types/wishlist';

/**
 * Hook to add an item to the user's wishlist
 *
 * Invalidates: myWishlist
 */
export function useAddWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WishItemCreateRequest) => addWishlistItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myWishlist });
    },
  });
}

/**
 * Hook to remove an item from the user's wishlist
 *
 * Invalidates: myWishlist
 */
export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeWishlistItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myWishlist });
    },
  });
}

/**
 * Hook to update wishlist visibility (PUBLIC/FRIENDS/PRIVATE)
 *
 * Invalidates: myWishlist
 */
export function useUpdateVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WishlistVisibilityUpdateRequest) => updateWishlistVisibility(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myWishlist });
    },
  });
}
