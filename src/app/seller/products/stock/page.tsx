'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { getSellerProducts, getStockHistory } from '@/lib/api/products';
import { queryKeys } from '@/lib/query/keys';
import { Loader2, ChevronLeft, Package, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StockHistorySearchParams } from '@/types/product';

const CHANGE_TYPE_LABEL: Record<string, string> = {
    MANUAL_ADJUST: '수동 조정',
    ORDER_DEDUCT: '주문 차감',
    ORDER_RESTORE: '주문 복원',
};

import { ProfileLayout } from '@/components/layout/ProfileLayout';

export default function StockHistoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productIdParam = searchParams.get('productId');
    const productId = productIdParam ? Number(productIdParam) : undefined;

    // 상품 선택 없으면 목록 표시용
    const { data: productPage } = useQuery({
        queryKey: queryKeys.sellerProducts(),
        queryFn: () => getSellerProducts({ size: 50 }),
        enabled: !productId,
    });

    // 재고 이력 조회
    const queryParams: StockHistorySearchParams = productId ? { productId, size: 50 } : { size: 50 };
    const { data: historyPage, isLoading: isHistoryLoading } = useQuery({
        queryKey: queryKeys.stockHistory(productId?.toString() ?? 'all'),
        queryFn: () => getStockHistory(queryParams),
    });

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const DeltaIcon = ({ delta }: { delta: number }) => {
        if (delta > 0) return <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />;
        if (delta < 0) return <TrendingDown className="h-4 w-4 text-destructive flex-shrink-0" />;
        return <Minus className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    };

    return (
        <ProfileLayout>
            <div className="max-w-3xl mx-auto py-10">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.push('/seller/products')} className="text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-2xl font-bold">재고 관리 이력</h1>
                </div>

                {/* 상품 필터 */}
                {productPage && !productId && (
                    <div className="mb-6 bg-muted/30 p-4 rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground mb-3">상품을 선택하면 해당 상품의 재고 이력만 볼 수 있습니다.</p>
                        <div className="flex flex-wrap gap-2">
                            {productPage.content.map(p => (
                                <Button
                                    key={p.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/seller/products/stock?productId=${p.id}`)}
                                    className="text-xs h-8"
                                >
                                    {p.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 상품 필터 선택됨 */}
                {productId && (
                    <div className="mb-6">
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => router.push('/seller/products/stock')}
                            className="text-xs text-muted-foreground h-auto p-0 hover:text-foreground"
                        >
                            ← 모든 상품 이력 보기
                        </Button>
                    </div>
                )}

                {/* 재고 이력 목록 */}
                {isHistoryLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : !historyPage || historyPage.content.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-lg bg-muted/20 text-center">
                        <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">재고 변동 이력이 없습니다.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">총 <span className="font-medium text-foreground">{historyPage.totalElements}</span>건의 기록</p>
                        </div>
                        <div className="border rounded-lg overflow-hidden bg-white">
                            <div className="divide-y divide-border">
                                {historyPage.content.map(item => (
                                    <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center",
                                                item.delta > 0 ? "bg-green-50" : item.delta < 0 ? "bg-red-50" : "bg-gray-50"
                                            )}>
                                                <DeltaIcon delta={item.delta} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {CHANGE_TYPE_LABEL[item.changeType] ?? item.changeType}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    재고 변화: {item.beforeStock} → {item.afterStock}개 · {formatDate(item.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={cn(
                                                "text-sm font-bold tabular-nums",
                                                item.delta > 0 ? "text-green-600" : item.delta < 0 ? "text-destructive" : "text-muted-foreground"
                                            )}>
                                                {item.delta > 0 ? `+${item.delta}` : item.delta}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
}
