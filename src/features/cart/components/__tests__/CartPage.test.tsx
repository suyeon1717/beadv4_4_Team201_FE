import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CartPage from '@/app/cart/page';
import type { Cart } from '@/types/cart';

const mockCart: Cart = {
    id: 'cart-1',
    memberId: 'user-1',
    items: [
        {
            id: 'c1',
            cartId: 'cart-1',
            fundingId: 'f1',
            funding: {
                id: 'f1',
                wishItemId: 'wi-1',
                recipient: { id: 'user-2', nickname: 'John', avatarUrl: '' },
                organizer: { id: 'user-3', nickname: 'Jane', avatarUrl: '' },
                product: { id: 'p1', name: 'Sony WH-1000XM5', price: 450000, imageUrl: '' },
                targetAmount: 450000,
                currentAmount: 0,
                status: 'IN_PROGRESS',
                participantCount: 0,
                expiresAt: '2026-02-28T00:00:00Z',
                createdAt: '2026-01-01T00:00:00Z',
            },
            amount: 450000,
            selected: true,
            isNewFunding: false,
            createdAt: '2026-01-01T00:00:00Z',
        },
        {
            id: 'c2',
            cartId: 'cart-1',
            fundingId: 'f2',
            funding: {
                id: 'f2',
                wishItemId: 'wi-2',
                recipient: { id: 'user-4', nickname: 'Bob', avatarUrl: '' },
                organizer: { id: 'user-5', nickname: 'Alice', avatarUrl: '' },
                product: { id: 'p2', name: 'Coffee Beans', price: 4500, imageUrl: '' },
                targetAmount: 9000,
                currentAmount: 0,
                status: 'IN_PROGRESS',
                participantCount: 0,
                expiresAt: '2026-02-28T00:00:00Z',
                createdAt: '2026-01-01T00:00:00Z',
            },
            amount: 9000,
            selected: true,
            isNewFunding: false,
            createdAt: '2026-01-01T00:00:00Z',
        },
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
};

// Mock useCart hook
vi.mock('@/features/cart/hooks/useCart', () => ({
    useCart: () => ({
        data: mockCart,
        isLoading: false,
        error: null,
    }),
}));

// Mock useCartMutations hook
vi.mock('@/features/cart/hooks/useCartMutations', () => ({
    useUpdateCartItem: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
    useRemoveCartItem: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
    useToggleCartSelection: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
}));

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
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
}));

// Setup mock for toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        info: vi.fn(),
    },
}));

describe('CartPage Feature', () => {

    it('GIVEN cart has items, THEN it should display items and summary', () => {
        render(<CartPage />);

        // Should display funding product names
        expect(screen.getByText('Sony WH-1000XM5')).toBeInTheDocument();
        expect(screen.getByText('Coffee Beans')).toBeInTheDocument();
    });

    it('GIVEN cart items, THEN it should show recipient info', () => {
        render(<CartPage />);

        // Should display recipient names
        expect(screen.getByText(/John/)).toBeInTheDocument();
        expect(screen.getByText(/Bob/)).toBeInTheDocument();
    });

    it('GIVEN cart items, THEN it should display participation amounts', () => {
        render(<CartPage />);

        // Should display amounts (use getAllByText since amounts may appear multiple times)
        const largeAmounts = screen.getAllByText(/450,000/);
        const smallAmounts = screen.getAllByText(/9,000/);
        expect(largeAmounts.length).toBeGreaterThan(0);
        expect(smallAmounts.length).toBeGreaterThan(0);
    });
});
