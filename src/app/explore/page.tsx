'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Gift, Users, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { getFundings } from '@/lib/api/fundings';
import { FundingCard } from '@/components/common/FundingCard';
import { toast } from 'sonner';

export default function DiscoverPage() {
    const router = useRouter();
    const [searchId, setSearchId] = useState('');
    const [searchedId, setSearchedId] = useState<string | null>(null);
    
    const { data: searchedWishlist, isLoading: isSearchLoading, error: searchError } = useWishlist(searchedId || '');

    // 실시간 인기 펀딩 (DISCOVER의 새로운 핵심 요소)
    const { data: fundingsData, isLoading: isFundingsLoading } = useQuery({
        queryKey: ['trend-fundings'],
        queryFn: () => getFundings({ size: 4 }),
    });

    const trendFundings = fundingsData?.items || [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) {
            toast.error('회원 ID를 입력해주세요');
            return;
        }
        setSearchedId(searchId.trim());
    };

    const handleViewWishlist = (memberId: string) => {
        router.push(`/wishlist/${memberId}`);
    };

    return (
        <AppShell headerTitle="DISCOVER" headerVariant="main">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-12 md:py-20">
                {/* Hero / Search Section */}
                <div className="max-w-2xl mx-auto text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                        Find Someone, <br />
                        Discover Joy
                    </h1>
                    <p className="text-muted-foreground mb-10 text-sm md:text-base">
                        친구의 아이디를 검색하여 위시리스트를 확인하거나, <br />
                        지금 활발하게 진행 중인 펀딩을 탐색해보세요.
                    </p>
                    
                    <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
                        <Input
                            type="text"
                            placeholder="회원 ID를 입력하세요 (예: 1, 2, 3...)"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="h-14 pl-12 pr-24 border-black border-2 rounded-none focus-visible:ring-0 text-sm font-bold"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                        <Button 
                            type="submit" 
                            className="absolute right-1 top-1 bottom-1 px-6 rounded-none bg-black text-white hover:bg-gray-800"
                        >
                            SEARCH
                        </Button>
                    </form>
                </div>

                {/* Search Result (Dynamic) */}
                {searchedId && (
                    <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-6">
                            <Users className="w-5 h-5" />
                            <h2 className="text-lg font-black tracking-tight">회원 검색 결과</h2>
                        </div>
                        
                        {isSearchLoading ? (
                            <Card className="p-8 border-2 border-black rounded-none">
                                <div className="flex items-center gap-6">
                                    <Skeleton className="w-20 h-20 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-6 w-40" />
                                        <Skeleton className="h-4 w-60" />
                                    </div>
                                </div>
                            </Card>
                        ) : searchError ? (
                            <Card className="p-12 text-center border-2 border-dashed border-gray-200 rounded-none bg-gray-50">
                                <p className="font-bold text-gray-400">"{searchedId}" 회원을 찾을 수 없습니다.</p>
                                <p className="text-xs text-muted-foreground mt-1">아이디를 다시 확인해주세요.</p>
                            </Card>
                        ) : searchedWishlist && (
                            <Card 
                                className="p-8 border-2 border-black rounded-none hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => handleViewWishlist(searchedId)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-black flex items-center justify-center text-white text-3xl font-black">
                                            {searchedWishlist.member.nickname?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black">{searchedWishlist.member.nickname}님의 위시리스트</h3>
                                            <p className="text-muted-foreground text-sm mt-1">
                                                {searchedWishlist.itemCount}개의 위시 아이템이 기다리고 있어요.
                                            </p>
                                        </div>
                                    </div>
                                    <Button className="border-2 border-black bg-transparent text-black hover:bg-black hover:text-white rounded-none font-bold py-6 px-10 transition-all">
                                        보러가기
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {/* 회원 위시리스트 바로가기 (친구 기능 미구현 → 전체 회원 탐색용) */}
                <div className="mb-20">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">Members</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter">위시리스트 둘러보기</h2>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-6">
                        회원의 위시리스트를 확인하고 펀딩을 개설하거나 참여해보세요.
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((memberId) => (
                            <MemberCard
                                key={memberId}
                                memberId={memberId.toString()}
                                onClick={() => handleViewWishlist(memberId.toString())}
                            />
                        ))}
                    </div>
                </div>

                {/* Trending Fundings (The 'Discover' core) */}
                <div className="mb-20">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-orange-500" />
                                <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase">Trending Now</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter">실시간 인기 펀딩</h2>
                        </div>
                    </div>

                    {isFundingsLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-[4/5] w-full rounded-none" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : trendFundings.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {trendFundings.map((funding) => (
                                <FundingCard
                                    key={funding.id}
                                    funding={funding}
                                    onClick={() => router.push(`/fundings/${funding.id}`)}
                                    variant="carousel"
                                    className="w-full"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-gray-100 bg-gray-50/50">
                            <p className="text-sm font-bold text-gray-300">현재 활성화된 펀딩이 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-10 bg-black text-white group cursor-pointer overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-2">My Wishlist</h3>
                            <p className="text-gray-400 text-sm mb-6">내가 받고 싶은 선물을 등록해보세요.</p>
                            <Button 
                                variant="outline" 
                                className="border-white text-white hover:bg-white hover:text-black rounded-none font-bold"
                                onClick={() => router.push('/wishlist')}
                            >
                                GO TO WISH
                            </Button>
                        </div>
                        <Gift className="absolute -right-8 -bottom-8 w-40 h-40 text-gray-800 opacity-50 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    
                    <div className="p-10 bg-gray-100 group cursor-pointer overflow-hidden relative border-2 border-transparent hover:border-black transition-all">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-2">Participation</h3>
                            <p className="text-muted-foreground text-sm mb-6">내가 참여한 모든 펀딩을 확인하세요.</p>
                            <Button 
                                className="bg-black text-white hover:bg-gray-800 rounded-none font-bold"
                                onClick={() => router.push('/fundings/participated')}
                            >
                                VIEW MY FUNDINGS
                            </Button>
                        </div>
                        <Users className="absolute -right-8 -bottom-8 w-40 h-40 text-gray-200 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>

                {/* Bottom Tip */}
                <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-[11px] text-muted-foreground uppercase tracking-widest gap-4">
                    <span>© 2026 GIFTIFY. ALL RIGHTS RESERVED.</span>
                    <div className="flex gap-6">
                        <span className="cursor-help" title="다른 사람의 아이디로 검색 가능합니다.">MEMBER ID SEARCH TIPS</span>
                        <span className="cursor-help" title="실시간으로 집계되는 펀딩 데이터입니다.">LIVE DATA STATUS</span>
                    </div>
                </div>
            </div>
            <Footer />
        </AppShell>
    );
}

function MemberCard({ memberId, onClick }: { memberId: string; onClick: () => void }) {
    const { data: wishlist, isLoading } = useWishlist(memberId);
    const nickname = wishlist?.member?.nickname;
    const itemCount = wishlist?.itemCount ?? 0;
    const initial = nickname ? nickname.charAt(0) : memberId;

    return (
        <button
            onClick={onClick}
            className="group flex-shrink-0 w-[160px] flex flex-col items-center gap-3 p-6 border-2 border-gray-200 hover:border-black transition-all"
        >
            <div className="w-14 h-14 bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-xl font-black transition-colors rounded-full">
                {isLoading ? (
                    <span className="w-6 h-6 rounded bg-gray-300 animate-pulse" />
                ) : (
                    initial
                )}
            </div>
            <div className="text-center min-w-0 w-full">
                <span className="block text-sm font-bold text-foreground group-hover:text-black truncate">
                    {isLoading ? (
                        <span className="block h-4 w-16 mx-auto rounded bg-gray-200 animate-pulse" />
                    ) : (
                        nickname || `회원 #${memberId}`
                    )}
                </span>
                {!isLoading && itemCount > 0 && (
                    <span className="block text-[11px] text-muted-foreground mt-1">
                        위시 {itemCount}개
                    </span>
                )}
            </div>
        </button>
    );
}
