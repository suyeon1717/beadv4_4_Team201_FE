'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

/**
 * Custom Auth Hook
 *
 * Wrapper around useUser from @auth0/nextjs-auth0/client
 * Provides a consistent auth interface across the application.
 *
 * Usage:
 * ```typescript
 * const { user, isLoading, error } = useAuth();
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * if (!user) return <div>Not logged in</div>;
 *
 * return <div>Hello, {user.name}</div>;
 * ```
 */
export function useAuth() {
  const { user, error, isLoading } = useUser();

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && !error,
  };
}
