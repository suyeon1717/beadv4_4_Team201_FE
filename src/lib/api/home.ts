import { apiClient } from './client';
import type { HomeData } from '@/types/home';

export async function getHomeData(config?: { token?: string }): Promise<HomeData> {
  return apiClient.get<HomeData>('/api/v2/home', config);
}
