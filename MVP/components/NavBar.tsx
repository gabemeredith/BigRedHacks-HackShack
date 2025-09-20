'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { isDemoModeClient, DEMO_SESSION } from '@/lib/demo';

const routes = [
  { href: '/', label: 'Home' },
  { href: '/reels', label: 'Reels' },
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/clothing', label: 'Clothing' },
  { href: '/art', label: 'Art' },
  { href: '/entertainment', label: 'Entertainment' },
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isDemo = isDemoModeClient();
  
  // Use demo session in demo mode
  const effectiveSession = isDemo ? DEMO_SESSION : session;
  const effectiveStatus = isDemo ? 'authenticated' : status;

  const handleSignOut = async () => {
    if (isDemo) {
      // In demo mode, just redirect without actually signing out
      window.location.href = '/login';
    } else {
      await signOut({ callbackUrl: '/login' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4 lg:space-x-6">
              <Link
                href="/"
                className="text-lg font-bold tracking-tight"
              >
                LocalLens
              </Link>
          
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2 overflow-x-auto">
            {routes.slice(0, 4).map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-xs font-medium transition-colors hover:text-primary whitespace-nowrap px-2 py-1 rounded",
                  pathname === route.href
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
            {effectiveStatus === 'loading' ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : effectiveSession ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary hidden sm:block",
                  pathname === '/dashboard'
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
              
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-secondary hidden sm:block">
                      {effectiveSession.user?.businessName || effectiveSession.user?.email}
                      {isDemo && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">DEMO</span>}
                    </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-sm"
                >
                  Log out
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
