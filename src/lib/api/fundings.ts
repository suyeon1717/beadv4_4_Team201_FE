import { apiClient } from "./client";
import type { PageParams } from "@/types/api";
import type {
  Funding,
  FundingDetail,
  FundingStatus,
  FundingCreateRequest,
  FundingListResponse,
  ParticipantListResponse,
  FundingQueryParams,
} from "@/types/funding";

// Alias for backward compatibility
export type FundingsParams = FundingQueryParams;

export interface RefuseFundingRequest {
  reason?: string;
}

// --- Legacy Backend Types ---
interface LegacyFunding {
  fundingId: number;
  fundingStatus: string; // "IN_PROGRESS"
  targetPrice: number;
  totalAmount: number; // 0
  productId: number;
  productName: string;
  productPrice: number;
  productImageUrl: string; // "url"
  description: string; // "description"
  endDate: string; // "2026-02-19T06:05:43"
  createdAt: string; // "2026-02-05T06:05:43"
}

// 펀딩 상태 매핑 함수
function mapFundingStatus(status: string): FundingStatus {
  switch (status) {
    case 'IN_PROGRESS': return 'IN_PROGRESS';
    case 'ACHIEVED': return 'ACHIEVED';
    case 'EXPIRED': return 'EXPIRED';
    case 'CLOSED': return 'CLOSED';
    case 'ACCEPTED': return 'ACCEPTED';
    case 'REFUSED': return 'REFUSED';
    default: return 'PENDING';
  }
}

function mapLegacyFunding(legacy: LegacyFunding): Funding {
  return {
    id: legacy.fundingId.toString(),
    wishItemId: "", // Legacy API does not return this
    product: {
      id: legacy.productId.toString(),
      name: legacy.productName,
      price: legacy.productPrice,
      imageUrl: legacy.productImageUrl || "/images/placeholder-product.jpg",
      status: "ON_SALE", // Default
      brandName: "", // Legacy API does not return this
    },
    organizerId: "", // Legacy API does not return this
    organizer: {
      id: "",
      nickname: "Organizer",
      avatarUrl: null,
    },
    recipientId: "", // Legacy API does not return this
    recipient: {
      id: "",
      nickname: "Recipient",
      avatarUrl: null,
    },
    targetAmount: legacy.targetPrice,
    currentAmount: legacy.totalAmount,
    status: mapFundingStatus(legacy.fundingStatus),
    participantCount: 0, // Legacy API does not return this
    expiresAt: legacy.endDate,
    createdAt: legacy.createdAt,
  };
}

// --- API Functions ---

export async function getFunding(fundingId: string): Promise<FundingDetail> {
  // TODO: Check if legacy API returns details matching FundingDetail
  const legacy = await apiClient.get<LegacyFunding>(
    `/api/fundings/${fundingId}`,
  );
  const funding = mapLegacyFunding(legacy);
  return {
    ...funding,
    participants: [], // Legacy detail might need separate call or different type
    myParticipation: null,
  };
}

export async function createFunding(
  _data: FundingCreateRequest, // Changed 'data' to '_data'
): Promise<Funding> {
  // Note: Legacy might not support creation via this exact path/body
  throw new Error("Create funding not supported in legacy adaptation yet");
  // return apiClient.post<Funding>('/api/v2/fundings', data);
}

export async function participateFunding(
  fundingId: string,
  amount: number,
): Promise<void> {
  // Legacy participation often doesn't return the full object
  return apiClient.post<void>(`/api/fundings/${fundingId}/participate`, {
    amount,
  });
}

export async function acceptFunding(fundingId: string): Promise<void> {
  return apiClient.post<void>(`/api/fundings/${fundingId}/accept`, {});
}

export async function refuseFunding(
  fundingId: string,
  data?: RefuseFundingRequest,
): Promise<void> {
  return apiClient.post<void>(`/api/fundings/${fundingId}/refuse`, data || {});
}

export async function getMyOrganizedFundings(
  _params?: FundingsParams, // Changed 'params' to '_params'
): Promise<FundingListResponse> {
  // Legacy does not seem to have specific "organized" endpoint, possibly just 'list' filtered?
  // Falling back to empty mainly because we saw 'participated' but not explicit 'organized' in the scan
  return {
    content: [],
    items: [],
    page: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    },
  };
}

export async function getMyParticipatedFundings(
  _params?: FundingsParams, // Changed 'params' to '_params'
): Promise<FundingListResponse> {
  // Legacy Endpoint: /api/fundings/participated/list
  // Note: Legacy list endpoints often return Array directly, not Page object.
  const response = await apiClient.get<LegacyFunding[]>(
    "/api/fundings/participated/list",
  );

  const mapped = response.map(mapLegacyFunding);

  return {
    content: mapped,
    items: mapped,
    page: {
      page: 0,
      size: mapped.length,
      totalElements: mapped.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };
}

export async function getMyReceivedFundings(
  _params?: FundingsParams, // Changed 'params' to '_params'
): Promise<FundingListResponse> {
  return {
    content: [],
    items: [],
    page: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    },
  };
}

export async function getFundings(
  _params?: FundingsParams, // Changed 'params' to '_params'
): Promise<FundingListResponse> {
  // Legacy Endpoint: /api/fundings/list (Assuming public list)
  const response = await apiClient.get<LegacyFunding[]>("/api/fundings/list");
  const mapped = response.map(mapLegacyFunding);

  return {
    content: mapped,
    items: mapped,
    page: {
      page: 0,
      size: mapped.length,
      totalElements: mapped.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };
}

export async function getFundingParticipants(
  _fundingId: string, // Changed 'fundingId' to '_fundingId'
  _params?: PageParams, // Changed 'params' to '_params'
): Promise<ParticipantListResponse> {
  // Placeholder
  return {
    content: [],
    items: [],
    page: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    },
  };
}
