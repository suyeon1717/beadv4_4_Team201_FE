'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FundingCard, FundingCardProps } from '@/components/common/FundingCard';

// TODO: Replace with real data fetching
const MOCK_FUNDINGS: FundingCardProps['funding'][] = [
    {
        id: '1',
        product: {
            name: 'Apple 에어팟 프로 2세대',
            imageUrl: '/images/placeholder-product-1.jpg', // Placeholder
            price: 329000,
        },
        targetAmount: 329000,
        currentAmount: 256620,
        status: 'IN_PROGRESS',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // D-7
        participantCount: 5,
        recipient: {
            nickname: '김철수',
            avatarUrl: undefined,
        },
    },
    {
        id: '2',
        product: {
            name: 'Nintendo 스위치 OLED',
            imageUrl: '/images/placeholder-product-2.jpg',
            price: 415000,
        },
        targetAmount: 415000,
        currentAmount: 120000,
        status: 'IN_PROGRESS',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // D-3
        participantCount: 2,
        recipient: {
            nickname: '이영희',
            avatarUrl: undefined,
        },
    },
];

export function MyFundingsSection() {
    const fundings = MOCK_FUNDINGS; // Simulate data

    if (fundings.length === 0) {
        return (
            <section className="space-y-4 py-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-bold">🎁 참여 중인 펀딩</h2>
                </div>
                <div className="px-4">
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center bg-secondary/20">
                        <span className="text-2xl">🎈</span>
                        <p className="mt-2 text-sm font-medium">아직 참여 중인 펀딩이 없어요</p>
                        <p className="text-xs text-muted-foreground">친구의 위시리스트를 구경해보세요!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4 py-6">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-bold">🎁 참여 중인 펀딩</h2>
                <Link href="/fundings" className="flex items-center text-xs text-muted-foreground hover:text-primary">
                    더보기 <ChevronRight className="h-3 w-3" />
                </Link>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
                {fundings.map((funding) => (
                    <FundingCard
                        key={funding.id}
                        funding={funding}
                        variant="carousel"
                    />
                ))}
            </div>
        </section>
    );
}
