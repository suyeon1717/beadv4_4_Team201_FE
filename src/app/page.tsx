import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { queryKeys } from '@/lib/query/keys';
import { getHomeData } from '@/lib/api/home';
import { HomePageClient } from '@/features/home/components/HomePageClient';
import { auth0 } from '@/lib/auth/auth0';

export default async function HomePage() {
  const queryClient = getQueryClient();
  const session = await auth0.getSession();

  // On the server, we need to pass the access token manually or use the absolute URL client
  // Since getHomeData uses the singleton apiClient, we can pass context or just use it if we can.
  // A better way is to pass headers to the prefetch function.

  if (session?.accessToken) {
    try {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.home,
        queryFn: () => getHomeData({
          token: session.accessToken as string
        }),
      });
    } catch (error) {
      console.error('[HomePage] Prefetch failed:', error);
      // Don't crash the page, let it retry on the client
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClient />
    </HydrationBoundary>
  );
}
