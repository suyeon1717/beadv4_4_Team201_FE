import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getHomeData } from '@/lib/api/home';
import type { HomeData } from '@/types/home';

export function useHomeData() {
  return useQuery<HomeData>({
    queryKey: queryKeys.home,
    queryFn: () => getHomeData(),
  });
}
