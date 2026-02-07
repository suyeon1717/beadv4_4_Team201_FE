import { useQueries } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getPopularProducts, getProducts } from '@/lib/api/products';
import { getMyParticipatedFundings, getFundings } from '@/lib/api/fundings';
import type { HomeData } from '@/types/home';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useHomeData() {
  const { user, isAuthenticated } = useAuth();

  const results = useQueries({
    queries: [
      // 1. 인기 상품 조회
      {
        queryKey: queryKeys.products.popular(),
        queryFn: () => getPopularProducts(4),
      },
      // 2. 내 참여 펀딩 조회 (로그인 시)
      {
        queryKey: queryKeys.myParticipatedFundings,
        queryFn: () => getMyParticipatedFundings({ size: 5 }),
        enabled: isAuthenticated,
      },
      // 3. 공개 펀딩 목록 (친구 위시리스트/트렌딩 펀딩 대용)
      {
        queryKey: queryKeys.fundings,
        queryFn: () => getFundings({ size: 4, status: 'IN_PROGRESS' }),
        retry: 1, // Fail fast if auth issues
      },
      // 4. 추천 상품 (Non-login only)
      {
        queryKey: ['products', 'recommended'],
        queryFn: () => getProducts({ size: 4 }), // General recommendation
        enabled: !isAuthenticated,
      },
      // 5. 핫한 상품 (Non-login only)
      {
        queryKey: ['products', 'hot'],
        queryFn: () => getProducts({ size: 4, sort: 'price_desc' }),
        enabled: !isAuthenticated,
      },
    ],
  });

  const [
      popularProductsQuery,
      myFundingsQuery,
      publicFundingsQuery,
      recommendedProductsQuery,
      hotProductsQuery
  ] = results;

  // Global loading state: Only wait for critical data
  const isLoading = popularProductsQuery.isLoading || (
      !isAuthenticated && (recommendedProductsQuery.isLoading || hotProductsQuery.isLoading)
  );
  
  // Global error state: Only error if critical data fails
  const isError = popularProductsQuery.isError;
  const error = popularProductsQuery.error;
  
  const refetch = () => results.forEach(q => q.refetch());

  // 데이터 매핑 - 에러가 나거나 로딩 중이면 빈 배열 처리
  const popularProducts = popularProductsQuery.data?.items ?? [];
  const myFundings = myFundingsQuery.data?.items ?? [];
  const publicFundings = publicFundingsQuery.data?.items ?? [];
  const recommendedProducts = recommendedProductsQuery.data?.items ?? [];
  const hotProducts = hotProductsQuery.data?.items ?? [];

  const data: HomeData | undefined = !isLoading ? {
    member: null,
    myFundings: myFundings,
    trendingFundings: publicFundings,
    popularProducts: popularProducts,
    recommendedProducts: recommendedProducts,
    hotProducts: hotProducts,
    walletBalance: 0, 
  } : undefined;

  return {
    data,
    isLoading,
    isError,
    error,
    refetch
  };
}
