import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWishlistItem } from '@/lib/api/wishlists';
import { queryKeys } from '@/lib/query/keys';
import type { WishItemCreateRequest } from '@/types/wishlist';

/**
 * Hook to add a product to the user's wishlist
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
