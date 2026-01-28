# Giftify Frontend Implementation Plan

> Generated: 2026-01-27
> Project: Giftify - Group Funding Service Frontend
> Tech Stack: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Auth0

---

## 1. Requirements Summary

### 1.1 Core Features (from docs/02-wireframes.md)

| Screen | Primary Features |
|--------|------------------|
| **Home** | Welcome section, My fundings carousel, Friends wishlists, Popular products grid |
| **Wishlist (My)** | Visibility toggle, Wish items list (AVAILABLE/IN_FUNDING/FUNDED), Add item FAB |
| **Wishlist (Friend)** | Read-only view, Start/participate funding buttons |
| **Product Search** | Keyword search, Category/price filters, Product list |
| **Product Detail** | Image carousel, Product info, Add to wishlist CTA |
| **Funding Detail** | Progress bar, Recipient info, Participants, Participate CTA |
| **Cart** | Cart items with amount edit, Select/delete, Checkout navigation |
| **Checkout** | Order summary, Payment method (Wallet), Pay button |
| **Wallet** | Balance display, Charge modal, Transaction history |
| **My Page** | Profile card, Wallet balance, Funding activity menu, Settings |

### 1.2 API Endpoints (from docs/03-api-spec.yaml)

| Domain | Key Endpoints |
|--------|---------------|
| Auth | POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me |
| Members | GET /api/members/{id}, PATCH /api/members/{id}, GET /api/members/{id}/friends |
| Wishlists | GET /api/wishlists/me, GET /api/wishlists/{memberId}, POST /api/wishlists/items |
| Products | GET /api/products, GET /api/products/search, GET /api/products/{id} |
| Fundings | GET /api/fundings/{id}, POST /api/fundings, POST /api/fundings/{id}/accept |
| Cart | GET /api/cart, POST /api/cart/items, PATCH /api/cart/items/{id} |
| Orders | POST /api/orders, GET /api/orders/{id} |
| Payments | POST /api/payments |
| Wallet | GET /api/wallet, POST /api/wallet/charge, GET /api/wallet/history |
| Home | GET /api/home (aggregated) |

### 1.3 Current Implementation Status

**Already Implemented (with mock data):**
- `src/app/page.tsx` - Home page layout
- `src/app/cart/page.tsx` - Cart page (basic UI)
- `src/app/checkout/page.tsx` - Checkout page (mock payment)
- `src/app/wallet/page.tsx` - Wallet page
- `src/app/fundings/[id]/page.tsx` - Funding detail page
- `src/app/wishlist/page.tsx` - My wishlist page
- `src/components/layout/*` - AppShell, Header, BottomNav
- `src/components/common/*` - FundingCard, WishItemCard, AmountInput, FundingProgress
- `src/components/ui/*` - shadcn/ui components
- `src/lib/api/client.ts` - API client base

**Not Yet Implemented:**
- Auth0 integration
- Real API integration (all pages use mock data)
- Product search page
- Product detail page
- My page (profile)
- Order complete page
- Comprehensive type definitions
- API hooks (TanStack Query)
- Error handling patterns
- Loading/skeleton states

---

## 2. Acceptance Criteria

### 2.1 Authentication

| ID | Criteria | Verification |
|----|----------|--------------|
| AUTH-1 | User can log in via Auth0 | Click login button, redirected to Auth0, returns to app authenticated |
| AUTH-2 | User session persists across page refreshes | Refresh page, user remains logged in |
| AUTH-3 | Protected routes redirect to login | Access /cart without auth, redirected to login |
| AUTH-4 | User can log out | Click logout, session cleared, redirected to home |

### 2.2 Home Page

| ID | Criteria | Verification |
|----|----------|--------------|
| HOME-1 | Shows personalized welcome with user name | Logged in user sees "Hello, [nickname]!" |
| HOME-2 | Displays participating fundings carousel | Horizontal scroll with max 10 fundings |
| HOME-3 | Shows friends' wishlists | List of friend wishlists with preview items |
| HOME-4 | Displays popular products grid | 2-column grid with max 8 products |
| HOME-5 | Loading skeleton shown during fetch | See skeleton UI before data loads |
| HOME-6 | Empty states shown when no data | "No active fundings" message when empty |

### 2.3 Wishlist

| ID | Criteria | Verification |
|----|----------|--------------|
| WISH-1 | Can view own wishlist with all statuses | See AVAILABLE, IN_FUNDING, FUNDED items |
| WISH-2 | Can change visibility (PUBLIC/FRIENDS/PRIVATE) | Toggle visibility, persists after refresh |
| WISH-3 | Can add product to wishlist | Add product, appears in list |
| WISH-4 | Can start funding for own wishlist item | Click "Start Funding" on AVAILABLE item |
| WISH-5 | Can view friend's public wishlist | Navigate to friend's wishlist, see items |
| WISH-6 | Cannot see private wishlist | Get 403 error for private wishlist |

### 2.4 Product

| ID | Criteria | Verification |
|----|----------|--------------|
| PROD-1 | Can search products by keyword | Type "airpods", see matching results |
| PROD-2 | Can filter by category | Select "Electronics", see filtered results |
| PROD-3 | Can filter by price range | Set min/max price, results filtered |
| PROD-4 | Can view product details | Click product, see full details page |
| PROD-5 | Can add product to wishlist | Click "Add to Wishlist" on detail page |
| PROD-6 | Pagination works correctly | Scroll down, more products load |

### 2.5 Funding

| ID | Criteria | Verification |
|----|----------|--------------|
| FUND-1 | Can view funding details | See product, recipient, progress, participants |
| FUND-2 | Can participate with custom amount | Enter amount, add to cart |
| FUND-3 | Progress bar reflects accurate percentage | (currentAmount / targetAmount) * 100 |
| FUND-4 | D-day badge shows correct remaining days | Calculate from expiresAt |
| FUND-5 | Recipient can accept completed funding | ACHIEVED status shows accept/refuse buttons |
| FUND-6 | Recipient can refuse completed funding | Refuse triggers refund flow |

### 2.6 Cart & Checkout

| ID | Criteria | Verification |
|----|----------|--------------|
| CART-1 | Cart shows all funding participations | List of cart items with funding info |
| CART-2 | Can modify participation amount | Edit amount, total updates |
| CART-3 | Can remove items from cart | Remove item, list updates |
| CART-4 | Can select/deselect items | Checkbox toggles, total recalculates |
| CART-5 | Can proceed to checkout | Navigate to checkout with selected items |
| CHECK-1 | Shows order summary | List items with amounts |
| CHECK-2 | Shows wallet balance | Display current balance |
| CHECK-3 | Can pay with wallet if sufficient balance | Pay button enabled, payment succeeds |
| CHECK-4 | Shows insufficient balance warning | Balance < total shows warning + charge link |
| CHECK-5 | Payment success shows confirmation | Toast + redirect to success page |

### 2.7 Wallet

| ID | Criteria | Verification |
|----|----------|--------------|
| WALL-1 | Shows current balance | Accurate balance display |
| WALL-2 | Can charge wallet | Enter amount, mock payment, balance updates |
| WALL-3 | Shows transaction history | List of CHARGE/PAYMENT/REFUND transactions |
| WALL-4 | Transactions sorted by date | Most recent first |

### 2.8 My Page

| ID | Criteria | Verification |
|----|----------|--------------|
| MY-1 | Shows profile info | Avatar, nickname, email |
| MY-2 | Can edit profile | Update nickname, save, reflected everywhere |
| MY-3 | Shows wallet balance quick access | Click balance, navigate to wallet |
| MY-4 | Shows funding activity counts | Organized/Participated/Received counts |
| MY-5 | Can navigate to each activity list | Click menu, see respective list |
| MY-6 | Can log out | Click logout, session ends |

---

## 3. Implementation Phases

### Phase 1: Foundation & Types (Priority: Critical)
**Goal**: Establish type safety and API infrastructure

**Tasks**:
- [ ] Define comprehensive TypeScript types based on OpenAPI spec
  - `src/types/member.ts`
  - `src/types/wishlist.ts`
  - `src/types/product.ts`
  - `src/types/funding.ts`
  - `src/types/cart.ts`
  - `src/types/order.ts`
  - `src/types/payment.ts`
  - `src/types/wallet.ts`

- [ ] **[CRITICAL FIX] Update `src/types/api.ts` - PageInfo Type Alignment**

  **Current Implementation (WRONG):**
  ```typescript
  export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  }
  ```

  **OpenAPI Spec Requires:**
  ```typescript
  // PageInfo from OpenAPI spec
  export interface PageInfo {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;      // NOT 'last'
    hasPrevious: boolean;  // NOT 'first'
  }

  // Generic paginated response structure
  export interface PaginatedResponse<T> {
    items: T[];  // NOT 'content'
    page: PageInfo;
  }

  // Keep old PageResponse for backward compatibility during migration
  // Mark as @deprecated
  /** @deprecated Use PaginatedResponse<T> instead */
  export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  }
  ```

  **Action**: Replace PageResponse with PaginatedResponse in all new code. Update existing usages incrementally.

- [ ] Create API function modules
  - `src/lib/api/auth.ts`
  - `src/lib/api/members.ts`
  - `src/lib/api/wishlists.ts`
  - `src/lib/api/products.ts`
  - `src/lib/api/fundings.ts`
  - `src/lib/api/cart.ts`
  - `src/lib/api/orders.ts`
  - `src/lib/api/payments.ts`
  - `src/lib/api/wallet.ts`
  - `src/lib/api/home.ts`

- [ ] **[NEW] Setup MSW for API Mocking**
  - Install MSW: `npm install msw --save-dev`
  - Create `src/mocks/browser.ts` for browser integration
  - Create `src/mocks/handlers.ts` with API endpoint handlers
  - Create `src/mocks/data/` directory for mock data fixtures
  - Add MSW initialization to `src/app/layout.tsx` (dev mode only)
  - Configure `next.config.js` for MSW compatibility

**Verification**:
- [ ] `npm run build` passes with no type errors
- [ ] Types match OpenAPI schema exactly
- [ ] MSW intercepts API calls in development

**Estimated Effort**: 6-8 hours

---

### Phase 2: Authentication (Priority: Critical)
**Goal**: Implement Auth0 integration for user authentication

**Tasks**:
- [ ] Configure Auth0 SDK
  - `src/lib/auth/auth0.ts` - Auth0 configuration
  - `src/app/api/auth/[auth0]/route.ts` - Auth0 API routes

- [ ] **[CRITICAL FIX] Create auth middleware at CORRECT location**
  - **CORRECT**: `src/middleware.ts` (Next.js root level)
  - **WRONG**: `src/app/middleware.ts` (this path does NOT work)
  - Middleware must be at project root `src/` or root `/` level

- [ ] **[CRITICAL FIX] Implement Authenticated API Client Wrapper**

  Create `src/lib/api/authenticated-client.ts`:
  ```typescript
  import { getAccessToken } from '@auth0/nextjs-auth0';
  import { apiClient } from './client';

  /**
   * Creates an authenticated API client that attaches Auth0 token
   * to all requests automatically.
   *
   * Usage in Server Components:
   * const client = await createAuthenticatedClient();
   * const data = await client.get('/api/fundings');
   *
   * Usage in Client Components (via API route):
   * Use fetch to /api/proxy/* routes which handle auth server-side
   */
  export async function createAuthenticatedClient() {
    const { accessToken } = await getAccessToken();

    return {
      get: <T>(url: string) =>
        apiClient.get<T>(url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
      post: <T>(url: string, data: unknown) =>
        apiClient.post<T>(url, data, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
      patch: <T>(url: string, data: unknown) =>
        apiClient.patch<T>(url, data, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
      delete: <T>(url: string) =>
        apiClient.delete<T>(url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
    };
  }
  ```

  Create `src/app/api/proxy/[...path]/route.ts` for client-side token attachment:
  ```typescript
  // Proxies requests from client components with auth token attached
  import { getAccessToken } from '@auth0/nextjs-auth0';
  import { NextRequest, NextResponse } from 'next/server';

  export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const { accessToken } = await getAccessToken();
    const apiPath = params.path.join('/');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${apiPath}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return NextResponse.json(await response.json());
  }
  // Similar for POST, PATCH, DELETE
  ```

- [ ] Create auth hooks
  - `src/features/auth/hooks/useAuth.ts`
  - `src/features/auth/hooks/useUser.ts`
- [ ] Update layout with auth provider
  - Modify `src/app/layout.tsx`
- [ ] Create login/logout UI
  - `src/features/auth/components/LoginButton.tsx`
  - `src/features/auth/components/LogoutButton.tsx`
  - `src/features/auth/components/UserMenu.tsx`
- [ ] Update Header component with auth state
  - Modify `src/components/layout/Header.tsx`

- [ ] **[CLARIFICATION] Route Protection Strategy**
  - Use `src/middleware.ts` for centralized route protection
  - Protected routes pattern: `/cart`, `/checkout`, `/wallet`, `/profile`, `/wishlist`
  - Public routes: `/`, `/products`, `/products/[id]`, `/fundings/[id]`
  - Do NOT use route groups `(auth)` - middleware handles all auth

**Verification**:
- [ ] Can log in via Auth0
- [ ] Protected routes redirect to login
- [ ] User info displays in header
- [ ] Logout clears session
- [ ] API requests include Bearer token

**Estimated Effort**: 8-10 hours

---

### Phase 3: TanStack Query Integration (Priority: Critical)
**Goal**: Replace mock data with real API calls using TanStack Query

**Tasks**:
- [ ] Setup Query Client
  - Verify `src/lib/providers.tsx` has QueryClientProvider

- [ ] **[NEW] Define Cache Invalidation Strategy**

  Create `src/lib/query/keys.ts`:
  ```typescript
  export const queryKeys = {
    // Fundings
    fundings: ['fundings'] as const,
    funding: (id: string) => ['fundings', id] as const,
    myOrganizedFundings: ['fundings', 'organized'] as const,
    myParticipatedFundings: ['fundings', 'participated'] as const,
    myReceivedFundings: ['fundings', 'received'] as const,

    // Cart
    cart: ['cart'] as const,

    // Wallet
    wallet: ['wallet'] as const,
    walletHistory: ['wallet', 'history'] as const,

    // Wishlist
    myWishlist: ['wishlists', 'me'] as const,
    wishlist: (memberId: string) => ['wishlists', memberId] as const,

    // Home
    home: ['home'] as const,

    // Products
    products: ['products'] as const,
    product: (id: string) => ['products', id] as const,
  };
  ```

  **Cache Invalidation Rules:**
  | Mutation | Invalidate Keys |
  |----------|-----------------|
  | Add to cart | `cart`, `funding(id)` |
  | Remove from cart | `cart` |
  | Update cart item | `cart` |
  | Create funding | `myWishlist`, `myOrganizedFundings`, `home` |
  | Participate in funding | `funding(id)`, `cart` |
  | Accept/Refuse funding | `funding(id)`, `myReceivedFundings` |
  | Charge wallet | `wallet`, `walletHistory` |
  | Pay order | `wallet`, `walletHistory`, `cart`, affected `funding(id)`s |
  | Add wishlist item | `myWishlist` |
  | Delete wishlist item | `myWishlist` |

- [ ] Create query hooks for each domain
  - `src/features/home/hooks/useHomeData.ts`
  - `src/features/wishlist/hooks/useWishlist.ts`
  - `src/features/wishlist/hooks/useWishlistMutations.ts`
  - `src/features/product/hooks/useProducts.ts`
  - `src/features/product/hooks/useProductDetail.ts`
  - `src/features/funding/hooks/useFunding.ts`
  - `src/features/funding/hooks/useFundingMutations.ts`
  - `src/features/cart/hooks/useCart.ts`
  - `src/features/cart/hooks/useCartMutations.ts`
  - `src/features/wallet/hooks/useWallet.ts`
  - `src/features/wallet/hooks/useWalletMutations.ts`
  - `src/features/order/hooks/useOrders.ts`
  - `src/features/order/hooks/useOrderMutations.ts`
- [ ] Create mutation hooks with optimistic updates
  - Cart item add/remove/update
  - Wishlist item add/remove
  - Funding participate

**Verification**:
- [ ] Data fetches from API on page load
- [ ] Loading states display correctly
- [ ] Mutations update UI optimistically
- [ ] Error states handled gracefully
- [ ] Cache invalidation works as specified

**Estimated Effort**: 10-12 hours

---

### Phase 4: Home Page Enhancement (Priority: High)
**Goal**: Connect home page to real API and add polish

**Tasks**:
- [ ] Integrate useHomeData hook
  - Modify `src/app/page.tsx`
- [ ] Add loading skeletons
  - `src/features/home/components/HomePageSkeleton.tsx`
- [ ] Add empty states
  - Modify `src/features/home/components/MyFundingsSection.tsx`
  - Modify `src/features/home/components/FriendsWishlistSection.tsx`
- [ ] Add error boundaries
  - `src/components/common/ErrorBoundary.tsx`
- [ ] Implement horizontal scroll for fundings
  - Use scroll-area component

**Verification**:
- [ ] Home page loads with real data
- [ ] Skeleton shows during loading
- [ ] Empty states display when no data
- [ ] Carousel scrolls horizontally

**Estimated Effort**: 4-6 hours

---

### Phase 5: Product Search & Detail (Priority: High)
**Goal**: Implement product browsing and detail pages

> **Note**: This phase was moved BEFORE Wishlist (Phase 6) because Wishlist's "Add Item" feature depends on Product pages existing.

**Tasks**:
- [ ] Create product search page
  - `src/app/products/page.tsx`
- [ ] Create search components
  - `src/features/product/components/ProductSearchHeader.tsx`
  - `src/features/product/components/ProductFilters.tsx`
  - `src/features/product/components/ProductList.tsx`
  - `src/features/product/components/ProductCard.tsx`
- [ ] Create product detail page
  - `src/app/products/[id]/page.tsx`
- [ ] Create detail components
  - `src/features/product/components/ProductImages.tsx`
  - `src/features/product/components/ProductInfo.tsx`
  - `src/features/product/components/AddToWishlistButton.tsx`
- [ ] Implement infinite scroll for product list
- [ ] Add search debouncing

**Verification**:
- [ ] Can search products
- [ ] Filters work correctly
- [ ] Product detail shows all info
- [ ] Can add product to wishlist

**Estimated Effort**: 8-10 hours

---

### Phase 6: Wishlist Feature Complete (Priority: High)
**Goal**: Full wishlist functionality with API integration

> **Prerequisite**: Phase 5 (Product) must be complete - Wishlist "Add Item" navigates to Product pages.

**Tasks**:
- [ ] Integrate useWishlist hook in my wishlist page
  - Modify `src/app/wishlist/page.tsx`
- [ ] Integrate useWishlist hook in friend wishlist page
  - Modify `src/app/wishlist/[userId]/page.tsx`
- [ ] Implement visibility change
  - Create `src/features/wishlist/components/VisibilitySheet.tsx`
- [ ] Implement add item flow
  - Connect `src/features/wishlist/components/AddItemDrawer.tsx` to API
  - **Note**: This should navigate to Product Search, not inline product selection
- [ ] Implement delete item
  - Add delete functionality to WishItemCard
- [ ] Handle permission errors (403)
  - Show access denied UI

**Verification**:
- [ ] My wishlist shows real items
- [ ] Can add/remove items
- [ ] Can change visibility
- [ ] Friend wishlist respects visibility

**Estimated Effort**: 6-8 hours

---

### Phase 7: Funding Flow Complete (Priority: High)
**Goal**: Full funding creation and participation flow

**Tasks**:
- [ ] Integrate useFunding hook
  - Modify `src/app/fundings/[id]/page.tsx`

- [ ] **[CRITICAL FIX] Redesign CreateFundingModal for API Compatibility**

  **Current Implementation (WRONG):**
  ```typescript
  interface CreateFundingModalProps {
    product: { name, price, imageUrl };
  }
  // Fields: title, description, targetAmount, deadline
  ```

  **API Requires (FundingCreateRequest):**
  ```typescript
  interface FundingCreateRequest {
    wishItemId: string;       // REQUIRED - references WishItem, not Product
    expiresInDays?: number;   // 1-30, default 14
    message?: string;         // Optional message, max 500 chars
  }
  ```

  **New Component Interface:**
  ```typescript
  interface CreateFundingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    wishItem: {
      id: string;           // wishItemId for API
      product: {
        name: string;
        price: number;
        imageUrl: string;
      };
    };
    onSuccess: (funding: Funding) => void;
  }

  // Component state:
  // - expiresInDays: number (slider 1-30, default 14)
  // - message: string (textarea, optional, max 500)
  //
  // Remove: title, description, targetAmount, deadline
  // targetAmount comes from product.price automatically
  ```

  **UI Changes:**
  - Remove "title" input (not in API)
  - Remove "targetAmount" input (auto from product price)
  - Replace date picker with "Days until expiry" slider (1-30)
  - Rename "description" to "message" (optional)
  - Show product info as read-only display

- [ ] Connect ParticipateModal to API
  - Modify `src/features/funding/components/ParticipateModal.tsx`
- [ ] Implement recipient actions (accept/refuse)
  - `src/features/funding/components/RecipientActionButtons.tsx`
- [ ] Create participants list modal
  - `src/features/funding/components/ParticipantsModal.tsx`
- [ ] Add funding list pages
  - `src/app/fundings/organized/page.tsx`
  - `src/app/fundings/participated/page.tsx`
  - `src/app/fundings/received/page.tsx`

**Verification**:
- [ ] Funding detail shows real data
- [ ] Can create new funding (with wishItemId, expiresInDays, message)
- [ ] Can participate in funding
- [ ] Recipient can accept/refuse

**Estimated Effort**: 10-12 hours

---

### Phase 8: Cart & Checkout Complete (Priority: High)
**Goal**: Full cart and checkout flow with wallet payment

**Tasks**:
- [ ] Integrate useCart hook
  - Modify `src/app/cart/page.tsx`

- [ ] **[CRITICAL FIX] Redesign CartItem for Funding Participation Model**

  **Current Implementation (WRONG - e-commerce model):**
  ```typescript
  interface CartItemProps {
    item: {
      id: string;
      product: { name, price, imageUrl };
      quantity: number;
    };
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
  }
  ```

  **API Requires (Funding Participation model):**
  ```typescript
  // From OpenAPI CartItem schema
  interface CartItem {
    id: string;
    cartId: string;
    fundingId: string;
    funding: Funding;        // Full funding object with product, recipient, progress
    amount: number;          // Participation amount (NOT quantity)
    selected: boolean;       // Checkbox state
    isNewFunding: boolean;   // True if PENDING status (user is starting new funding)
    createdAt: string;
  }
  ```

  **New Component Interface:**
  ```typescript
  interface CartItemProps {
    item: {
      id: string;
      fundingId: string;
      funding: {
        id: string;
        product: { name: string; price: number; imageUrl: string };
        recipient: { nickname: string; avatarUrl?: string };
        targetAmount: number;
        currentAmount: number;
        status: FundingStatus;
        expiresAt: string;
      };
      amount: number;
      selected: boolean;
      isNewFunding: boolean;
    };
    onUpdateAmount: (id: string, amount: number) => void;  // NOT quantity
    onToggleSelect: (id: string, selected: boolean) => void;
    onRemove: (id: string) => void;
  }
  ```

  **UI Changes:**
  - Show funding recipient info (avatar + nickname)
  - Show funding progress bar
  - Show D-day badge
  - Replace quantity controls with amount input (AmountInput component)
  - Add checkbox for selection
  - Show "New Funding" badge if isNewFunding
  - Amount validation: 0 <= amount <= (targetAmount - currentAmount)

- [ ] Implement cart mutations (update amount, select, delete)
- [ ] Update checkout page for wallet payment
  - Modify `src/app/checkout/page.tsx`
- [ ] Create order creation flow
  - `src/features/order/hooks/useCreateOrder.ts`
- [ ] Create payment flow
  - `src/features/payment/hooks/usePayment.ts`
- [ ] Create success page
  - `src/app/checkout/complete/page.tsx`
- [ ] Handle insufficient balance scenario

**Verification**:
- [ ] Cart shows funding participations (not products)
- [ ] Can modify participation amounts
- [ ] Checkbox selection works
- [ ] Checkout shows wallet balance
- [ ] Payment deducts from wallet
- [ ] Success page shows result

**Estimated Effort**: 10-12 hours

---

### Phase 9: Wallet Complete (Priority: Medium)
**Goal**: Full wallet functionality with charge and history

**Tasks**:
- [ ] Integrate useWallet hook
  - Modify `src/app/wallet/page.tsx`
- [ ] Connect ChargeModal to API
  - Modify `src/features/wallet/components/ChargeModal.tsx`
- [ ] Implement transaction history with pagination
  - Modify `src/features/wallet/components/TransactionHistory.tsx`
- [ ] Add transaction filters (type)
- [ ] Create mock TossPayments charge flow
  - `src/features/wallet/components/TossPaymentWidget.tsx`

**Verification**:
- [ ] Wallet shows real balance
- [ ] Charge updates balance
- [ ] Transaction history displays correctly
- [ ] Filters work

**Estimated Effort**: 4-6 hours

---

### Phase 10: My Page (Priority: Medium)
**Goal**: Implement profile and settings

**Tasks**:
- [ ] Create my page
  - `src/app/profile/page.tsx`
- [ ] Create profile components
  - `src/features/profile/components/ProfileCard.tsx`
  - `src/features/profile/components/ProfileEditSheet.tsx`
  - `src/features/profile/components/FundingActivityMenu.tsx`
  - `src/features/profile/components/SettingsMenu.tsx`
- [ ] Integrate useUser hook for profile data
- [ ] Implement profile edit mutation
- [ ] Add logout functionality

**Verification**:
- [ ] Profile shows user info
- [ ] Can edit nickname
- [ ] Activity counts display
- [ ] Can navigate to each section
- [ ] Logout works

**Estimated Effort**: 4-6 hours

---

### Phase 11: Error Handling & Polish (Priority: Medium)
**Goal**: Robust error handling and UX polish

**Tasks**:
- [ ] Create global error boundary
  - `src/app/error.tsx`
  - `src/app/not-found.tsx`
- [ ] Create toast notification system (already have sonner)
  - Standardize error toasts
- [ ] Add retry mechanisms for failed queries
- [ ] Add loading states to all buttons
- [ ] Add form validation error displays
- [ ] Add 404 page
- [ ] Add offline indicator

**Verification**:
- [ ] API errors show toast messages
- [ ] 404 shows custom page
- [ ] Retries work for transient errors
- [ ] Forms show validation errors

**Estimated Effort**: 4-6 hours

---

### Phase 12: Testing (Priority: Medium)
**Goal**: Comprehensive test coverage

**Tasks**:
- [ ] **Ensure MSW is configured** (from Phase 1)
  - MSW handlers should cover all API endpoints
  - Mock data should match OpenAPI response shapes
- [ ] Add component tests
  - Tests for FundingCard, WishItemCard, AmountInput
  - Tests for redesigned CartItem
  - Tests for CreateFundingModal
- [ ] Add hook tests
  - Tests for useWallet, useCart, useFunding
- [ ] Add page integration tests
  - Test home page, cart page, checkout flow
- [ ] Add E2E tests (optional)
  - Full checkout flow

**Verification**:
- [ ] `npm run test` passes
- [ ] Coverage > 70%

**Estimated Effort**: 8-10 hours

---

### Phase 13: Performance & Optimization (Priority: Low)
**Goal**: Optimize for production

**Tasks**:
- [ ] Add image optimization
  - Use next/image properly
  - Add placeholder blur
- [ ] Add route prefetching
- [ ] Add query caching strategies
- [ ] Implement code splitting
- [ ] Add SEO meta tags
  - `src/app/metadata.ts`
- [ ] Add PWA manifest (optional)

**Verification**:
- [ ] Lighthouse score > 90
- [ ] Page loads < 2s

**Estimated Effort**: 4-6 hours

---

## 4. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Auth0 integration complexity | High | Medium | Follow official Next.js SDK docs, test early |
| API schema mismatch | High | Medium | Generate types from OpenAPI, validate early |
| Mock data divergence | Medium | High | Keep mock data aligned with real API response shape |
| TanStack Query learning curve | Medium | Low | Refer to official docs, start with simple queries |
| Backend not ready | High | Medium | Continue with MSW mock data |
| Performance on mobile | Medium | Medium | Test on real devices, optimize images |
| State management complexity | Medium | Low | Keep client state minimal, rely on TanStack Query |

---

## 5. Verification Checklist

### Pre-launch Checklist

**Functionality**
- [ ] All pages render without errors
- [ ] All API integrations work
- [ ] Auth flow complete (login/logout/protected routes)
- [ ] Cart to checkout flow complete
- [ ] Funding creation and participation work
- [ ] Wallet charge works
- [ ] Profile edit works

**Quality**
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] All tests pass (`npm run test`)
- [ ] No console errors in browser
- [ ] Responsive on mobile (390px width)
- [ ] Loading states on all data fetches
- [ ] Error states on all API failures

**Performance**
- [ ] Lighthouse Performance > 80
- [ ] Lighthouse Accessibility > 90
- [ ] No layout shifts (CLS < 0.1)
- [ ] Images optimized

**Security**
- [ ] No secrets in client code
- [ ] Auth tokens handled securely
- [ ] XSS prevention (React handles by default)

---

## 6. File Structure Reference

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[auth0]/route.ts      # Auth0 API (NEW)
│   │   └── proxy/[...path]/route.ts   # Auth proxy for client (NEW)
│   ├── cart/page.tsx                  # Cart (UPDATE)
│   ├── checkout/
│   │   ├── page.tsx                   # Checkout (UPDATE)
│   │   └── complete/page.tsx          # Success (NEW)
│   ├── fundings/
│   │   ├── [id]/page.tsx              # Detail (UPDATE)
│   │   ├── organized/page.tsx         # My organized (NEW)
│   │   ├── participated/page.tsx      # My participated (NEW)
│   │   └── received/page.tsx          # My received (NEW)
│   ├── products/
│   │   ├── page.tsx                   # Search (NEW)
│   │   └── [id]/page.tsx              # Detail (NEW)
│   ├── profile/page.tsx               # My Page (NEW)
│   ├── wallet/page.tsx                # Wallet (UPDATE)
│   ├── wishlist/
│   │   ├── page.tsx                   # My wishlist (UPDATE)
│   │   └── [userId]/page.tsx          # Friend wishlist (UPDATE)
│   ├── page.tsx                       # Home (UPDATE)
│   ├── layout.tsx                     # Layout (UPDATE)
│   ├── error.tsx                      # Error boundary (NEW)
│   └── not-found.tsx                  # 404 page (NEW)
├── middleware.ts                      # Auth middleware (NEW) - MUST BE HERE, NOT in app/
├── mocks/                             # MSW mock setup (NEW)
│   ├── browser.ts
│   ├── handlers.ts
│   └── data/
│       ├── fundings.ts
│       ├── products.ts
│       └── ...
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.tsx          # (NEW)
│   │   └── ... (existing)
│   ├── layout/
│   │   └── ... (existing)
│   └── ui/
│       └── ... (existing shadcn)
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginButton.tsx        # (NEW)
│   │   │   ├── LogoutButton.tsx       # (NEW)
│   │   │   └── UserMenu.tsx           # (NEW)
│   │   └── hooks/
│   │       ├── useAuth.ts             # (NEW)
│   │       └── useUser.ts             # (NEW)
│   ├── cart/
│   │   ├── components/
│   │   │   └── CartItem.tsx           # (REDESIGN - funding model)
│   │   └── hooks/
│   │       ├── useCart.ts             # (NEW)
│   │       └── useCartMutations.ts    # (NEW)
│   ├── funding/
│   │   ├── components/
│   │   │   ├── CreateFundingModal.tsx # (REDESIGN - API aligned)
│   │   │   ├── ParticipantsModal.tsx  # (NEW)
│   │   │   ├── RecipientActions.tsx   # (NEW)
│   │   │   └── ... (existing)
│   │   └── hooks/
│   │       ├── useFunding.ts          # (NEW)
│   │       └── useFundingMutations.ts # (NEW)
│   ├── home/
│   │   ├── components/
│   │   │   ├── HomePageSkeleton.tsx   # (NEW)
│   │   │   └── ... (existing)
│   │   └── hooks/
│   │       └── useHomeData.ts         # (NEW)
│   ├── order/
│   │   └── hooks/
│   │       ├── useOrders.ts           # (NEW)
│   │       └── useOrderMutations.ts   # (NEW)
│   ├── payment/
│   │   ├── api/
│   │   │   └── payment.ts             # (existing)
│   │   └── hooks/
│   │       └── usePayment.ts          # (NEW)
│   ├── product/
│   │   ├── components/
│   │   │   ├── ProductCard.tsx        # (NEW)
│   │   │   ├── ProductFilters.tsx     # (NEW)
│   │   │   ├── ProductImages.tsx      # (NEW)
│   │   │   ├── ProductInfo.tsx        # (NEW)
│   │   │   ├── ProductList.tsx        # (NEW)
│   │   │   └── ProductSearchHeader.tsx # (NEW)
│   │   └── hooks/
│   │       ├── useProducts.ts         # (NEW)
│   │       └── useProductDetail.ts    # (NEW)
│   ├── profile/
│   │   └── components/
│   │       ├── ProfileCard.tsx        # (NEW)
│   │       ├── ProfileEditSheet.tsx   # (NEW)
│   │       ├── FundingActivityMenu.tsx # (NEW)
│   │       └── SettingsMenu.tsx       # (NEW)
│   ├── wallet/
│   │   ├── components/
│   │   │   └── ... (existing)
│   │   └── hooks/
│   │       ├── useWallet.ts           # (NEW)
│   │       └── useWalletMutations.ts  # (NEW)
│   └── wishlist/
│       ├── components/
│       │   ├── VisibilitySheet.tsx    # (NEW)
│       │   └── ... (existing)
│       └── hooks/
│           ├── useWishlist.ts         # (NEW)
│           └── useWishlistMutations.ts # (NEW)
├── lib/
│   ├── api/
│   │   ├── client.ts                  # (existing)
│   │   ├── authenticated-client.ts    # (NEW) - token attachment
│   │   ├── auth.ts                    # (NEW)
│   │   ├── members.ts                 # (NEW)
│   │   ├── wishlists.ts               # (NEW)
│   │   ├── products.ts                # (NEW)
│   │   ├── fundings.ts                # (NEW)
│   │   ├── cart.ts                    # (NEW)
│   │   ├── orders.ts                  # (NEW)
│   │   ├── payments.ts                # (NEW)
│   │   ├── wallet.ts                  # (NEW)
│   │   └── home.ts                    # (NEW)
│   ├── auth/
│   │   └── auth0.ts                   # (NEW)
│   ├── query/
│   │   └── keys.ts                    # (NEW) - query key constants
│   ├── providers.tsx                  # (existing)
│   └── utils/
│       └── cn.ts                      # (existing)
├── stores/
│   └── global-store.ts                # (existing)
└── types/
    ├── api.ts                         # (UPDATE - PageInfo fix)
    ├── member.ts                      # (NEW)
    ├── wishlist.ts                    # (NEW)
    ├── product.ts                     # (NEW)
    ├── funding.ts                     # (NEW)
    ├── cart.ts                        # (NEW)
    ├── order.ts                       # (NEW)
    ├── payment.ts                     # (NEW)
    └── wallet.ts                      # (NEW)
```

---

## 7. Commit Strategy

| Phase | Commit Message Pattern |
|-------|----------------------|
| Phase 1 | `feat(types): add {domain} type definitions` |
| Phase 1 | `feat(msw): setup MSW for API mocking` |
| Phase 2 | `feat(auth): implement Auth0 integration` |
| Phase 2 | `feat(auth): add authenticated API client wrapper` |
| Phase 3 | `feat(api): add TanStack Query hooks for {domain}` |
| Phase 4-10 | `feat({feature}): {specific change}` |
| Phase 7 | `refactor(funding): redesign CreateFundingModal for API` |
| Phase 8 | `refactor(cart): redesign CartItem for funding model` |
| Phase 11 | `fix(error): implement error handling for {context}` |
| Phase 12 | `test({feature}): add tests for {component/hook}` |
| Phase 13 | `perf: optimize {specific area}` |

---

## 8. Dependencies & Prerequisites

### Backend API Requirements
- All endpoints from OpenAPI spec must be available
- Auth0 tenant configured with correct audience
- CORS configured for frontend domain

### Environment Variables Required
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
AUTH0_SECRET='...'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://dev-xxx.auth0.com'
AUTH0_CLIENT_ID='...'
AUTH0_CLIENT_SECRET='...'
AUTH0_AUDIENCE='https://api.giftify.app'
```

---

## 9. Success Criteria

This implementation is complete when:

1. **All 13 phases completed** with verification checks passed
2. **Zero TypeScript errors** on `npm run build`
3. **Zero ESLint errors** on `npm run lint`
4. **All tests pass** on `npm run test`
5. **All acceptance criteria met** (Section 2)
6. **Lighthouse Performance > 80** on key pages
7. **Responsive design works** on 390px width

---

## 10. Critical Fixes Summary

This section summarizes all critical issues that were addressed in this plan revision:

| Issue | Location | Fix |
|-------|----------|-----|
| PageInfo Type Mismatch | Phase 1 | Added explicit `PageInfo` and `PaginatedResponse<T>` types matching OpenAPI (`items`, `hasNext`, `hasPrevious`) |
| middleware.ts Placement | Phase 2 | Corrected path to `src/middleware.ts` (NOT `src/app/middleware.ts`) |
| No Token Attachment Strategy | Phase 2 | Added `authenticated-client.ts` and `/api/proxy/` route for token attachment |
| CreateFundingModal Design Mismatch | Phase 7 | Added complete redesign spec: `wishItemId`, `expiresInDays`, `message` fields |
| CartItem Design Mismatch | Phase 8 | Added complete redesign spec: funding model with `amount`, `selected`, `isNewFunding` |
| Product/Wishlist Phase Order | Phase 5/6 | Swapped order - Product now before Wishlist |
| No Cache Invalidation Strategy | Phase 3 | Added `queryKeys.ts` and invalidation rules table |
| Missing MSW Setup | Phase 1 | Added MSW setup task |

---

**Total Estimated Effort**: 90-110 hours

**Recommended Team Allocation**:
- 1 developer: 2.5-3 weeks full-time
- 2 developers: 1.5-2 weeks full-time
