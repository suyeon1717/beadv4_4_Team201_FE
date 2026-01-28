import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getHomeData } from '@/lib/api/home';

export function useHomeData() {
  return useQuery({
    queryKey: queryKeys.home,
    queryFn: getHomeData,
  });
}
