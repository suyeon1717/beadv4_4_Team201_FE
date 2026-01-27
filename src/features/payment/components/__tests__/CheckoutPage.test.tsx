import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CheckoutPage from '@/app/checkout/page';
import { useRouter } from 'next/navigation';

// Mock UI components
vi.mock('@/components/layout/AppShell', () => ({
    AppShell: ({ children, headerTitle }: any) => (
        <div data-testid="app-shell">
            <h1>{headerTitle}</h1>
            {children}
        </div>
    ),
}));

// Mock router
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Setup mock for toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock payment API
vi.mock('@/features/payment/api/payment', () => ({
    requestMockPayment: vi.fn().mockResolvedValue({ paymentKey: 'mock_pk', method: 'CARD' }),
    verifyMockPayment: vi.fn().mockResolvedValue({ status: 'DONE' }),
}));

describe('CheckoutPage Feature', () => {
    it('GIVEN order info, THEN it should display summary and payment amount', () => {
        (useRouter as any).mockReturnValue({ push: vi.fn() });
        render(<CheckoutPage />);

        expect(screen.getByText('Sony WH-1000XM5 외 1건')).toBeInTheDocument();

        // Check total payment amount (Order Summary)
        expect(screen.getAllByText('459,000원')).toHaveLength(2); // Total Box Price, Final Amount

        // Check Button Text
        expect(screen.getByRole('button', { name: /459,000원 결제하기/i })).toBeInTheDocument();
    });

    it('GIVEN user initiates payment, THEN it should process and show success', async () => {
        const user = userEvent.setup();
        const routerPush = vi.fn();
        (useRouter as any).mockReturnValue({ push: routerPush });

        render(<CheckoutPage />);

        const payBtn = screen.getByRole('button', { name: /결제하기/i });

        // Click pay
        await user.click(payBtn);

        // Should show success toast
        const { toast } = await import('sonner');
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('결제가 성공적으로 완료되었습니다.');
        });
    });
});
