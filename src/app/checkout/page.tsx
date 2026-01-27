'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { requestMockPayment, verifyMockPayment } from '@/features/payment/api/payment';

// Mock Data from Cart (Simulating state passed usually via URL params or global store)
const MOCK_ORDER = {
    totalBoxPrices: 459000,
    shippingFee: 0,
    paymentAmount: 459000,
    orderName: 'Sony WH-1000XM5 외 1건',
    items: [
        { name: 'Sony WH-1000XM5', quantity: 1, price: 450000 },
        { name: '스타벅스 아메리카노 T', quantity: 2, price: 4500 }
    ]
};

export default function CheckoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. 요청 (Mock Backend)
            const { paymentKey } = await requestMockPayment({
                orderId: `ord_${Date.now()}`,
                orderName: MOCK_ORDER.orderName,
                amount: MOCK_ORDER.paymentAmount
            });

            // 2. 검증 (Mock Backend)
            await verifyMockPayment(paymentKey, `ord_${Date.now()}`, MOCK_ORDER.paymentAmount);

            toast.success('결제가 성공적으로 완료되었습니다.');
            // Navigate to success page or orders page
            // router.push('/orders/complete');
        } catch (error) {
            toast.error('결제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell
            headerTitle="주문/결제"
            headerVariant="detail"
            hasBack={true}
            showBottomNav={false}
        >
            <div className="p-4 space-y-6 pb-24 max-w-lg mx-auto">
                <section className="space-y-4">
                    <h2 className="text-lg font-bold">주문 상품 정보</h2>
                    <Card className="border-border bg-card">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">{MOCK_ORDER.orderName}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-1">
                            {MOCK_ORDER.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString()}원</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-bold">결제 정보</h2>
                    <Card className="border-border bg-card">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">총 상품금액</span>
                                <span>{MOCK_ORDER.totalBoxPrices.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">배송비</span>
                                <span>{MOCK_ORDER.shippingFee.toLocaleString()}원</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg text-primary">
                                <span>최종 결제 금액</span>
                                <span>{MOCK_ORDER.paymentAmount.toLocaleString()}원</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-bold">결제 수단</h2>
                    {/* Mock Payment Widget Container */}
                    <div className="rounded-xl border border-border bg-secondary/50 p-6 flex flex-col items-center justify-center gap-3 min-h-[160px]">
                        <CreditCard className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground font-medium">Toss Payments 위젯 영역 (Mock)</p>
                    </div>
                </section>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-20 md:static md:border-t-0">
                <Button
                    className="w-full h-12 text-lg font-bold"
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {MOCK_ORDER.paymentAmount.toLocaleString()}원 결제하기
                </Button>
            </div>
        </AppShell>
    );
}
