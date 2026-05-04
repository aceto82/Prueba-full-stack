'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const publicPaths = ['/login', '/_error'];
const roleRoutes: Record<string, string[]> = {
  doctor: ['/doctor'],
  patient: ['/patient'],
  admin: ['/admin'],
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    // Skip redirect on login or error pages
    if (!pathname || pathname === '/login' || pathname.startsWith('/_')) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const allowedRoutes = roleRoutes[user.role] || [];
    const isAllowed = allowedRoutes.some(p => pathname.startsWith(p));
    
    if (pathname === '/') {
      router.push(`/${user.role}`);
    } else if (!isAllowed) {
      router.push(`/${user.role}`);
    }
  }, [user, loading, pathname, mounted]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}