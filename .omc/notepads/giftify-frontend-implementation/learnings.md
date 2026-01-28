# Auth0 Integration Learnings

## Date: 2026-01-27

## Context
Implemented Auth0 v4 integration for Giftify frontend (Phase 2 of implementation plan).

## Key Learnings

### 1. Auth0 v4 API Changes

**Discovery**: Auth0 Next.js SDK v4 has significantly different API from v3

**Important Changes**:
- No `handleAuth()` function - auth routes handled by middleware
- No `UserProvider` - use `Auth0Provider` instead
- No `withMiddlewareAuthRequired` - use `auth0.middleware(request)` directly
- Server-side: Use `Auth0Client` class instantiation
- Client-side: Use `useUser()` hook from `@auth0/nextjs-auth0/client`

**Environment Variables (v4)**:
```bash
AUTH0_DOMAIN=dev-xxx.us.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_SECRET=...              # Generate with: openssl rand -hex 32
APP_BASE_URL=http://localhost:3000
AUTH0_AUDIENCE=...            # Optional - only for APIs
```

**Old v3 Naming (NO LONGER VALID)**:
- AUTH0_ISSUER_BASE_URL
- AUTH0_BASE_URL

### 2. Auth0 Client Setup Pattern

**Server-side Client** (`src/lib/auth/auth0.ts`):
```typescript
import { Auth0Client } from '@auth0/nextjs-auth0/server';
export const auth0 = new Auth0Client();
```

**Configuration**: Automatically reads from env vars, no manual config needed.

### 3. Middleware Implementation

**Location**: MUST be at `src/middleware.ts` (NOT `src/app/middleware.ts`)

**Pattern**:
```typescript
import { auth0 } from './lib/auth/auth0';

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
```

**Route Paths**:
- `/auth/login` - Auth0 login
- `/auth/logout` - Auth0 logout
- `/auth/callback` - Auth0 callback
- `/auth/profile` - User profile info

### 4. Next.js 15+ Dynamic Route Params

**Discovery**: Params are now async in Next.js 15+

**Pattern**:
```typescript
// OLD (Next.js 14)
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const apiPath = params.path.join('/');
}

// NEW (Next.js 15+)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const apiPath = resolvedParams.path.join('/');
}
```

### 5. Authenticated API Client Patterns

**Server Components/Actions**:
```typescript
import { createAuthenticatedClient } from '@/lib/api/authenticated-client';

const client = await createAuthenticatedClient();
const data = await client.get('/api/fundings');
```

**Client Components**:
```typescript
// Use proxy route to avoid exposing tokens
const response = await fetch('/api/proxy/fundings/123');
const data = await response.json();
```

**Implementation** (`authenticated-client.ts`):
```typescript
import { auth0 } from '../auth/auth0';

export async function createAuthenticatedClient() {
  const session = await auth0.getSession();
  const accessToken = session?.accessToken;

  // Return client with token in headers
}
```

### 6. Client-Side Auth Hook

**Pattern**:
```typescript
import { useUser } from '@auth0/nextjs-auth0/client';

export function useAuth() {
  const { user, error, isLoading } = useUser();

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && !error,
  };
}
```

### 7. Provider Setup

**Correct Provider** (`src/lib/providers.tsx`):
```typescript
import { Auth0Provider } from '@auth0/nextjs-auth0/client';

export function Providers({ children }) {
  return (
    <Auth0Provider>
      <QueryClientProvider>
        {children}
      </QueryClientProvider>
    </Auth0Provider>
  );
}
```

## Successful Patterns

### Directory Structure
```
src/
├── middleware.ts                              # Auth0 middleware (MUST be here)
├── lib/
│   ├── auth/
│   │   └── auth0.ts                          # Auth0 client singleton
│   ├── api/
│   │   ├── authenticated-client.ts           # Server-side auth wrapper
│   │   └── client.ts                         # Base API client
│   └── providers.tsx                         # App providers
├── app/
│   └── api/
│       └── proxy/[...path]/route.ts         # Client-side auth proxy
├── features/
│   └── auth/
│       ├── hooks/
│       │   └── useAuth.ts                   # Client-side auth hook
│       └── components/
│           ├── LoginButton.tsx              # Login button
│           ├── LogoutButton.tsx             # Logout button
│           └── UserMenu.tsx                 # User dropdown menu
```

### Build Verification
```bash
npm run build
# Should complete successfully with no TypeScript errors
```

## Gotchas

1. **Middleware Location**: Must be at `src/middleware.ts`, NOT `src/app/middleware.ts`
2. **Auth Routes**: Changed from `/api/auth/*` to `/auth/*` in v4
3. **Provider Name**: `Auth0Provider` not `UserProvider`
4. **Session Access**: Use `auth0.getSession()` not `getAccessToken()`
5. **Params Async**: In Next.js 15+, route params are Promise-wrapped
6. **Client vs Server**: `@auth0/nextjs-auth0/client` vs `/server` imports
7. **Env Var Names**: `AUTH0_DOMAIN` and `APP_BASE_URL` (not ISSUER_BASE_URL or BASE_URL)

## Testing Checklist

- [ ] Build passes: `npm run build`
- [ ] TypeScript compiles with no errors
- [ ] Login button redirects to `/auth/login`
- [ ] Logout button redirects to `/auth/logout`
- [ ] UserMenu displays when authenticated
- [ ] Protected routes redirect to login
- [ ] Middleware intercepts all routes correctly

## Next Steps

1. Configure actual Auth0 tenant with real credentials
2. Test authentication flow end-to-end
3. Implement protected route navigation guards
4. Add refresh token handling
5. Implement API error handling for 401/403
6. Add loading states for auth operations

## References

- [Auth0 Next.js SDK v4 Docs](https://github.com/auth0/nextjs-auth0)
- [Next.js 15 Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Auth0 Dashboard](https://manage.auth0.com)
