'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { sync } from '@/lib/api/auth';
import { toast } from 'sonner';

export function AuthInitializer() {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const hasSynced = useRef(false);

    useEffect(() => {
        async function syncUser() {
            if (isLoading || !user || hasSynced.current) return;

            // Skip sync if we are already on the complete-signup page
            if (pathname === '/auth/complete-signup') return;

            try {
                hasSynced.current = true;
                console.log('[AuthInitializer] Syncing user session...');
                const result = await sync();
                console.log('[AuthInitializer] Sync result:', result);

                // Redirect to complete signup if it is a new user
                if (result.isNewUser) {
                    console.log('[AuthInitializer] New user detected, redirecting to /auth/complete-signup');
                    router.push('/auth/complete-signup');
                }
            } catch (error) {
                console.error('[AuthInitializer] Failed to sync user:', error);
                hasSynced.current = false; // Allow retry on next run if it failed
            }
        }

        syncUser();
    }, [user, isLoading, router, pathname]);

    return null;
}
