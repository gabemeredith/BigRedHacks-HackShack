'use client';

import { usePathname } from 'next/navigation';
import NavBar from '@/components/NavBar';
import LeftToolbar from '@/components/LeftToolbar';
import DemoBanner from '@/components/DemoBanner';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isReelsPage = pathname === '/reels';

  if (isReelsPage) {
    // Full-screen layout for reels (with demo banner only)
    return (
      <div className="h-screen overflow-hidden">
        <DemoBanner position="top" dismissible={true} />
        {children}
      </div>
    );
  }

  // Normal layout with navbar and toolbar
  return (
    <div className="flex flex-col min-h-screen">
      <DemoBanner position="top" dismissible={true} />
      <NavBar />
      <main className="flex-1 relative">
        <LeftToolbar />
        <div className="pl-20 pr-0">
          {children}
        </div>
      </main>
    </div>
  );
}
