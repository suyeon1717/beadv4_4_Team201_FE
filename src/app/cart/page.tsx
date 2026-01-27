'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/features/cart/components/CartItem';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

// Mock Data
const MOCK_CART_ITEMS = [
    {
        id: 'c1',
        product: {
            name: 'Sony WH-1000XM5',
            price: 450000,
            imageUrl: '/images/placeholder-product-3.jpg',
        },
        quantity: 1,
    },
    {
        id: 'c2',
        product: {
            name: '스타벅스 아메리카노 T',
            price: 4500,
            imageUrl: '/images/placeholder-product-5.jpg',
        },
        quantity: 2,
    }
];

export default function CartPage() {
    const router = useRouter();
    const [items, setItems] = useState(MOCK_CART_ITEMS);

    const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shippingFee = totalAmount > 50000 ? 0 : 3000;
    const paymentAmount = totalAmount + shippingFee;

    const handleUpdateQuantity = (id: string, quantity: number) => {
        setItems(items.map(item => item.id === id ? { ...item, quantity } : item));
    };

    const handleRemove = (id: string) => {
        setItems(items.filter(item => item.id !== id));
        toast.success('상품이 삭제되었습니다.');
    };

    const handleCheckout = () => {
        // Navigate to Checkout Page
        router.push('/checkout');
    };

    return (
        <AppShell
            headerTitle="장바구니"
            headerVariant="detail"
            hasBack={true}
            showBottomNav={true}
        >
            <div className="flex flex-col min-h-[calc(100vh-3.5rem)] pb-24">
                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium">장바구니가 비어있습니다</h3>
                            <p className="text-sm text-muted-foreground">원하는 선물을 담아보세요! 🎁</p>
                        </div>
                        <Button variant="outline" className="mt-4">
                            쇼핑하러 가기
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-4 p-4">
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>

                        <div className="mt-auto bg-background p-4 border-t">
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">총 상품금액</span>
                                    <span>{totalAmount.toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">배송비</span>
                                    <span>{shippingFee.toLocaleString()}원</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>결제 금액</span>
                                    <span className="text-primary">{paymentAmount.toLocaleString()}원</span>
                                </div>
                            </div>
                            <Button className="w-full h-12 text-lg" onClick={handleCheckout}>
                                {items.length}개 주문하기
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </AppShell>
    );
}
