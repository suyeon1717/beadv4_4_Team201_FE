'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FundingProgress } from '@/components/common/FundingProgress';

interface FundingActionBoxProps {
    funding: {
        currentAmount: number;
        targetAmount: number;
        participantCount: number;
        status: string; // PENDING, IN_PROGRESS, etc.
    };
    onParticipate: () => void;
}

export function FundingActionBox({ funding, onParticipate }: FundingActionBoxProps) {
    /**
     * 현재 펀딩 달성률을 계산합니다.
     * 시각적 표시를 위해 소수점은 버림 처리(Math.floor)합니다.
     */
    const percentage = Math.floor((funding.currentAmount / funding.targetAmount) * 100);

    return (
        <Card className="p-4 shadow-sm border-t md:border">
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-2xl font-bold">{percentage}%</span>
                        <span className="text-sm text-muted-foreground ml-1">달성</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-bold">{funding.currentAmount.toLocaleString()}원</span>
                        <span className="text-muted-foreground"> / {funding.targetAmount.toLocaleString()}원</span>
                    </div>
                </div>

                <FundingProgress
                    current={funding.currentAmount}
                    target={funding.targetAmount}
                    size="lg"
                />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{funding.participantCount}명 참여 중</span>
                    <span>D-12</span>
                </div>

                <Button className="w-full h-12 text-lg font-bold" onClick={onParticipate}>
                    선물하기 참여하기
                </Button>
            </div>
        </Card>
    );
}
