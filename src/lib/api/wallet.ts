import { apiClient } from './client';
import { mapSpringPage } from './pagination';
import type { SpringPage } from './pagination';
import type {
  Wallet,
  WalletTransaction,
  WalletWithdrawRequest,
  WalletWithdrawResponse,
  TransactionType,
  WalletHistoryResponse,
  WalletHistoryQueryParams
} from '@/types/wallet';

// Alias for backward compatibility
export type WalletTransactionType = TransactionType;
export type WalletHistoryParams = WalletHistoryQueryParams;

// --- API Functions ---

export async function getWallet(): Promise<Wallet> {
  return apiClient.get<Wallet>('/api/v2/wallet/balance');
}

/**
 * 거래 내역 조회
 * @endpoint GET /api/v2/wallet/history
 * @note 백엔드가 Spring Data Page<T>를 직접 반환하므로 매핑 필요
 */
export async function getWalletHistory(params?: WalletHistoryParams): Promise<WalletHistoryResponse> {
  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.append('type', params.type);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/v2/wallet/history?${queryString}` : '/api/v2/wallet/history';

  const response = await apiClient.get<SpringPage<WalletTransaction>>(endpoint);
  return mapSpringPage(response);
}

export async function withdrawWallet(data: WalletWithdrawRequest): Promise<WalletWithdrawResponse> {
  return apiClient.post<WalletWithdrawResponse>('/api/v2/wallet/withdraw', data);
}
