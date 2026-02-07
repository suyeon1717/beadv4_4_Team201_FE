import type { PaginatedResponse, PageInfo } from '@/types/api';

/**
 * Spring Data Page<T> 원시 응답 구조
 * 백엔드가 Page 객체를 직렬화한 형태 그대로
 */
export interface SpringPage<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

/**
 * Spring Data Page → PaginatedResponse 변환
 */
export function mapSpringPage<T>(page: SpringPage<T>): PaginatedResponse<T> {
    return {
        content: page.content,
        items: page.content,
        page: {
            page: page.number,
            size: page.size,
            totalElements: page.totalElements,
            totalPages: page.totalPages,
            hasNext: !page.last,
            hasPrevious: !page.first,
        },
    };
}

/**
 * 커스텀 PageResponse → PaginatedResponse 변환
 * @param items 실제 아이템 배열 (필드명이 API마다 다를 수 있으므로 직접 전달)
 * @param pageInfo 페이지네이션 메타데이터
 */
export function mapCustomPage<T>(items: T[], pageInfo: PageInfo): PaginatedResponse<T> {
    return {
        content: items,
        items: items,
        page: pageInfo,
    };
}
