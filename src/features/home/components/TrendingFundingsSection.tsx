'use client';

import Link from 'next/link';
import { ArrowRight, Gift } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Funding } from '@/types/funding';
import { Progress } from '@/components/ui/progress';

interface TrendingFundingsSectionProps {
    fundings: Funding[];
}

export function TrendingFundingsSection({ fundings }: TrendingFundingsSectionProps) {
    if (fundings.length === 0) {
        return (
            <section className="py-8">
                <div className="max-w-screen-2xl mx-auto w-full">
                    <div className="px-8 mb-6">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Trending</p>
                        <h2 className="text-xl font-semibold tracking-tight mt-1">지금 뜨는 펀딩</h2>
                    </div>

                    <div className="mx-8 border border-dashed border-border py-16 flex flex-col items-center">
                        <Gift className="h-8 w-8 text-muted-foreground mb-4" strokeWidth={1} />
                        <p className="text-sm font-medium">진행 중인 펀딩이 없어요</p>
                        <p className="text-xs text-muted-foreground mt-1 mb-6">
                            첫 번째 펀딩의 주인공이 되어보세요!
                        </p>
                        <Button variant="outline" asChild>
                            <Link href="/products">선물 고르러 가기</Link>
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8">
            <div className="max-w-screen-2xl mx-auto w-full">
                {/* Section Header */}
                <div className="flex items-end justify-between px-8 mb-6">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Trending</p>
                        <h2 className="text-xl font-semibold tracking-tight mt-1">지금 뜨는 펀딩</h2>
                    </div>
                    <Link
                        href="/fundings"
                        className="flex items-center gap-1 text-sm hover:opacity-60 transition-opacity"
                    >
                        더보기
                        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                </div>

                {/* Funding Items */}
                <div className="px-8 space-y-0 divide-y divide-border">
                    {fundings.map((funding) => {
                        const progress = Math.min(100, Math.floor((funding.currentAmount / funding.targetAmount) * 100));

                        return (
                            <Link
                                key={funding.id}
                                href={`/fundings/${funding.id}`}
                                className="flex items-center justify-between py-4 hover:opacity-70 transition-opacity group"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <Avatar className="h-12 w-12 border border-border/50">
                                         {/* Note: Legacy API might not give full product details or organizer avatar correctly, fallbacks included */}
                                        <AvatarImage src={funding.product.imageUrl} alt={funding.product.name} className="object-cover" />
                                        <AvatarFallback className="bg-muted text-[10px] p-1 text-center flex items-center justify-center">
                                            {funding.product.name.slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                             <span className="text-xs font-semibold text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded">
                                                 D-{Math.ceil((new Date(funding.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                                             </span>
                                             <p className="text-sm font-medium truncate">
                                                To. {funding.recipient?.nickname || 'Friend'}
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate mb-2">
                                            {funding.product.name}
                                        </p>
                                        <div className="flex items-center gap-2 max-w-[200px]">
                                            <Progress value={progress} className="h-1.5" />
                                            <span className="text-[10px] font-medium min-w-[30px]">{progress}%</span>
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight
                                    className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform ml-4"
                                    strokeWidth={1.5}
                                />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
