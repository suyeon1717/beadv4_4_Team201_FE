'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { sync, getMe } from '@/lib/api/auth';

const SYNC_SESSION_KEY = 'auth_synced';

export function AuthInitializer() {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const hasSynced = useRef(false);

    useEffect(() => {
        async function syncUser() {
            if (isLoading || !user) return;

            // Skip if already synced in this component instance
            if (hasSynced.current) return;

            // Skip sync if we are already on the complete-signup page
            if (pathname === '/auth/complete-signup') return;

            // Check sessionStorage first (persists across page navigations)
            if (sessionStorage.getItem(SYNC_SESSION_KEY)) {
                hasSynced.current = true;
                return;
            }

            try {
                hasSynced.current = true;
                console.log('[AuthInitializer] Checking member status...');

                // First, check if member exists with lightweight /me endpoint
                try {
                    const member = await getMe();
                    if (member) {
                        // Member exists, no need to call login
                        console.log('[AuthInitializer] Member exists, skipping login');
                        sessionStorage.setItem(SYNC_SESSION_KEY, 'true');
                        return;
                    }
                } catch {
                    // Member doesn't exist (404) or other error, proceed to sync
                    console.log('[AuthInitializer] Member not found, will sync...');
                }

                // Member doesn't exist, call sync (which calls login)
                console.log('[AuthInitializer] New user, syncing session...');
                const result = await sync();
                console.log('[AuthInitializer] Sync result:', result);
                sessionStorage.setItem(SYNC_SESSION_KEY, 'true');

                // Redirect to complete signup if it is a new user
                if (result.isNewUser) {
                    console.log('[AuthInitializer] Redirecting to /auth/complete-signup');
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
