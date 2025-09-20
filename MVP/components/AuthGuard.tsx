'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Body } from '@/components/ui/typography';
import { isDemoModeClient } from '@/lib/demo';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isDemo = isDemoModeClient();

  useEffect(() => {
    // Skip auth checks in demo mode
    if (isDemo) return;
    
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router, isDemo]);

  // In demo mode, always allow access
  if (isDemo) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Body className="text-text-secondary">Loading...</Body>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Body className="text-text-secondary">Redirecting to login...</Body>
      </div>
    );
  }

  return <>{children}</>;
}
