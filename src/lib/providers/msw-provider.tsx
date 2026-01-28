'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(
    () => process.env.NODE_ENV !== 'development'
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const initMSW = async () => {
        try {
          const { worker } = await import('@/mocks/browser');
          await worker.start({
            onUnhandledRequest: 'bypass',
          });
          setMswReady(true);
        } catch (error) {
          console.error('MSW initialization failed:', error);
          setMswReady(true);
        }
      };

      initMSW();
    }
  }, []);

  if (!mswReady) {
    return null;
  }

  return <>{children}</>;
}
