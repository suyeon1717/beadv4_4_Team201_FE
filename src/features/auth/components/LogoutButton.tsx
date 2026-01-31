'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

/**
 * Logout Button Component
 *
 * Logs out user via Auth0 and redirects to home page.
 */
interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LogoutButton({ variant = 'ghost', size = 'sm', className }: LogoutButtonProps) {
  const handleLogout = () => {
    // Clear auth sync state and local state
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/auth/logout';
  };

  return (
    <Button onClick={handleLogout} variant={variant} size={size} className={className}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
