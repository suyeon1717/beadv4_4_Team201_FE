'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function FriendsWishlistSection() {
    const MOCK_WISHLISTS = [
        {
            id: '1',
            member: { nickname: '김철수', avatar: '' },
            itemCount: 4,
            topItem: '에어팟 프로 외 3개',
        },
        {
            id: '2',
            member: { nickname: '이영희', avatar: '' },
            itemCount: 3,
            topItem: '키보드 외 2개',
        },
    ];

    return (
        <section className="space-y-4 bg-secondary/30 py-6">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-bold">📋 친구들의 위시리스트</h2>
                <Link href="/friends" className="flex items-center text-xs text-muted-foreground hover:text-primary">
                    더보기 <ChevronRight className="h-3 w-3" />
                </Link>
            </div>

            <div className="space-y-3 px-4">
                {MOCK_WISHLISTS.map((list) => (
                    <Card key={list.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={list.member.avatar} />
                                <AvatarFallback>{list.member.nickname[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold">{list.member.nickname}의 위시리스트</p>
                                <p className="text-xs text-muted-foreground">{list.topItem}</p>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" asChild>
                            <Link href={`/wishlist/${list.id}`}>구경하기</Link>
                        </Button>
                    </Card>
                ))}
            </div>
        </section>
    );
}
