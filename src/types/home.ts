import { Member } from './member';
import { Funding } from './funding';
import { FriendWishlistItem } from './wishlist';
import { Product } from './product';

/**
 * Home page aggregated data
 * Contains all necessary information for the home screen
 */
export interface HomeData {
    member: Member | null;
    myFundings: Funding[];
    trendingFundings: Funding[];
    popularProducts: Product[];
    recommendedProducts?: Product[];
    hotProducts?: Product[];
    walletBalance: number;
}
